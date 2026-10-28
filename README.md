# PlantDoctor - KD Experiment

PlantDoctor is an experimental mobile app for checking crop leaves with an image classifier that runs on the device. Take a photo or choose one from the gallery to see the most likely crop condition and the model's top three predictions.

> **Experimental project:** predictions are model estimates, not a professional diagnosis or treatment recommendation. Check important crop-health decisions with a qualified agricultural expert.

## What’s inside

- **PlantDoctor mobile app** — an Expo and React Native app in `PlantDoctor/`.
- **On-device inference** — the app loads the bundled ONNX model with ONNX Runtime for React Native. Inference does not require sending the leaf image to a server.
- **38 output classes** — crop and condition labels are stored in `PlantDoctor/assets/model/class_names.json` and paired with the model output order.
- **Model artifacts** — `deploy_bundle/` contains the ONNX model, its class list, and a PyTorch checkpoint. The app uses the ONNX model; the `.pth` file is retained as an experiment artifact.
- **Model check utility** — `tools/verify_model.py` checks the ONNX input/output contract and can run a prediction on an image.

## Run the mobile app

### Requirements

- Node.js and npm
- Android Studio and Android SDK for Android builds
- Xcode for iOS builds (macOS only)

### Install and start

```bash
cd PlantDoctor
npm install
npm start
```

For a native device build, use one of these commands from `PlantDoctor/`:

```bash
npm run android
npm run ios
```

The project includes native modules, including ONNX Runtime. Use an Expo development build or a native build for device testing; Expo Go may not include the required native modules.

## Model details

The app resizes each image to 224 × 224, converts pixels to RGB, and applies ImageNet channel normalization before inference. The ONNX model expects a float32 tensor named `image` with shape `[1, 3, 224, 224]` in CHW layout. It returns raw logits named `logits` with shape `[1, 38]`. The app applies softmax and displays the top three predictions.

The matching app assets are:

- `PlantDoctor/assets/model/student_kd.onnx`
- `PlantDoctor/assets/model/class_names.json`

Keep the class-name order aligned with the model outputs when replacing or updating the model.

## Verify the ONNX bundle

The optional Python utility uses NumPy, ONNX Runtime, and Pillow:

```bash
python -m pip install numpy onnxruntime pillow
python tools/verify_model.py
```

Pass an image path to print the top three predictions:

```bash
python tools/verify_model.py path/to/leaf.jpg
```

## Repository layout

```text
.
├── deploy_bundle/       # ONNX model, labels, and PyTorch checkpoint
├── PlantDoctor/         # Expo / React Native application
└── tools/               # Model verification utility
```
