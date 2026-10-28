/**
 * preprocess.js — Image preprocessing pipeline
 *
 * Takes a local image URI, resizes to 224×224, decodes JPEG pixels,
 * and builds a Float32Array in CHW / RGB order with ImageNet normalization.
 */

import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

// ImageNet channel means and standard deviations (RGB order)
const MEAN = [0.485, 0.456, 0.406];
const STD  = [0.229, 0.224, 0.225];
const SIZE = 224;

/**
 * Convert an image URI to a Float32Array ready for the ONNX model.
 *
 * Steps:
 *  1. Resize to 224×224 using expo-image-manipulator (outputs base64 JPEG).
 *  2. Decode JPEG bytes to raw RGBA pixel array with jpeg-js.
 *  3. Build CHW tensor: for each channel c ∈ {R,G,B}, for each pixel i:
 *       out[c * 224*224 + i] = (pixel[i*4 + c] / 255  −  mean[c]) / std[c]
 *     Alpha channel (index 3) is skipped.
 *
 * @param {string} uri  Local file URI (file:// or content://)
 * @returns {Promise<Float32Array>}  Shape [3, 224, 224], float32
 */
export async function preprocessImage(uri) {
  // Step 1: Resize to 224×224 and get base64-encoded JPEG
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: SIZE, height: SIZE } }],
    { format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  // Step 2: Decode JPEG → RGBA Uint8Array
  const buf = Buffer.from(manipResult.base64, 'base64');
  const { data, width, height } = jpeg.decode(buf, { useTArray: true });
  // data is Uint8Array of length width*height*4  (RGBA)

  // Step 3: Build CHW float tensor with ImageNet normalization
  const npixels = SIZE * SIZE;       // 224 * 224 = 50176
  const out = new Float32Array(3 * npixels);

  for (let i = 0; i < npixels; i++) {
    const srcIdx = i * 4; // offset into RGBA data
    // R channel → out[0 * npixels + i]
    out[i]              = (data[srcIdx]     / 255.0 - MEAN[0]) / STD[0];
    // G channel → out[1 * npixels + i]
    out[npixels + i]    = (data[srcIdx + 1] / 255.0 - MEAN[1]) / STD[1];
    // B channel → out[2 * npixels + i]
    out[2 * npixels + i]= (data[srcIdx + 2] / 255.0 - MEAN[2]) / STD[2];
    // Alpha (srcIdx + 3) is ignored
  }

  return out;
}
