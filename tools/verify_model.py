import json
import sys

import numpy as np
import onnxruntime as ort
from PIL import Image


MODEL_PATH = "deploy_bundle/student_kd.onnx"
CLASSES_PATH = "deploy_bundle/class_names.json"
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)

session = ort.InferenceSession(MODEL_PATH)
inputs = session.get_inputs()
outputs = session.get_outputs()
classes = json.load(open(CLASSES_PATH, encoding="utf-8"))

print("Inputs :", [(item.name, item.shape, item.type) for item in inputs])
print("Outputs:", [(item.name, item.shape, item.type) for item in outputs])
print("Number of classes:", len(classes))

if len(inputs) != 1 or inputs[0].name != "image" or inputs[0].shape[1:] != [3, 224, 224] or inputs[0].type != "tensor(float)":
    raise SystemExit("Model input does not match the required contract")
if len(outputs) != 1 or outputs[0].name != "logits" or outputs[0].shape[1:] != [38] or outputs[0].type != "tensor(float)":
    raise SystemExit("Model output does not match the required contract")
if len(classes) != 38:
    raise SystemExit("Expected exactly 38 class names")


def predict(path):
    image = Image.open(path).convert("RGB").resize((224, 224))
    pixels = np.asarray(image, dtype=np.float32) / 255.0
    tensor = ((pixels - MEAN) / STD).transpose(2, 0, 1)[None].astype(np.float32)
    logits = session.run(["logits"], {"image": tensor})[0][0]
    exp = np.exp(logits - logits.max())
    probabilities = exp / exp.sum()
    return [(classes[index], round(float(probabilities[index]) * 100, 1))
            for index in probabilities.argsort()[::-1][:3]]


if len(sys.argv) > 1:
    print(predict(sys.argv[1]))
