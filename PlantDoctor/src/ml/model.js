/**
 * model.js — ONNX Runtime inference for PlantVillage leaf classification
 *
 * Loads the ONNX model once, runs inference, applies stable softmax,
 * and returns top-3 predictions with parsed plant/condition info.
 */

import { Asset } from 'expo-asset';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import { preprocessImage } from './preprocess';

// Singleton session + class list
let session = null;
let classNames = null;
let loadPromise = null;

/**
 * Load the ONNX model and class names. Safe to call multiple times;
 * only loads once. Returns { session, classNames }.
 */
export async function loadModel() {
  if (session && classNames) {
    return { session, classNames };
  }
  if (!loadPromise) {
    loadPromise = (async () => {
      // Metro bundles JSON as data, so use the bundled class order directly.
      classNames = require('../../assets/model/class_names.json');
      const modelAsset = Asset.fromModule(require('../../assets/model/student_kd.onnx'));
      await modelAsset.downloadAsync();
      session = await InferenceSession.create(modelAsset.localUri);
      return { session, classNames };
    })().catch((error) => {
      loadPromise = null;
      session = null;
      classNames = null;
      throw error;
    });
  }
  return loadPromise;
}

/**
 * Check if model is loaded
 */
export function isModelReady() {
  return session !== null && classNames !== null;
}

/**
 * Clean a raw class label for display.
 * "Tomato___Late_blight" → { plant: "Tomato", condition: "Late blight" }
 * Handles commas, parentheses, trailing underscores.
 */
function parseLabel(label) {
  const parts = label.split('___');
  const rawPlant = parts[0] || label;
  const rawCondition = parts.length > 1 ? parts.slice(1).join('___') : '';

  // Clean: replace _ with spaces, trim, remove trailing commas
  const clean = (s) =>
    s.replace(/_/g, ' ')
      .replace(/,\s*/g, ', ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/,\s*$/, '')
      .trim();

  const plant = clean(rawPlant);
  const condition = clean(rawCondition);
  const isHealthy = /healthy/i.test(condition);

  return { plant, condition, isHealthy };
}

/**
 * Numerically stable softmax.
 * Subtracts the max before exponentiating to prevent overflow.
 */
function softmax(logits) {
  const max = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/**
 * Run inference on an image URI.
 *
 * @param {string} imageUri  Local file URI
 * @returns {Promise<Array<{label: string, plant: string, condition: string, isHealthy: boolean, probability: number}>>}
 *   Top-3 predictions sorted by probability (descending). probability is 0–100.
 */
export async function predict(imageUri) {
  if (!session || !classNames) {
    throw new Error('Model not loaded. Call loadModel() first.');
  }

  // Step 1: Preprocess image → Float32Array [3, 224, 224]
  const inputData = await preprocessImage(imageUri);

  // Step 2: Create ONNX tensor with shape [1, 3, 224, 224]
  const inputTensor = new Tensor('float32', inputData, [1, 3, 224, 224]);

  // Step 3: Run inference with input name "image"
  const output = await session.run({ image: inputTensor });

  // Step 4: Read raw logits from output name "logits"
  const logits = Array.from(output.logits.data);

  // Step 5: Apply stable softmax to get probabilities
  const probs = softmax(logits);

  // Step 6: Get top-3 indices sorted by probability
  const indexed = probs.map((p, i) => ({ prob: p, idx: i }));
  indexed.sort((a, b) => b.prob - a.prob);
  const top3 = indexed.slice(0, 3);

  // Step 7: Build result with parsed labels
  return top3.map(({ prob, idx }) => {
    const rawLabel = classNames[idx];
    const { plant, condition, isHealthy } = parseLabel(rawLabel);
    return {
      label: rawLabel,
      plant,
      condition,
      isHealthy,
      probability: Math.round(prob * 10000) / 100, // e.g. 87.34
    };
  });
}
