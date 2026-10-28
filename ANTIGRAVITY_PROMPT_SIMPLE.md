# TASK: Build "Plant Doctor", a simple offline leaf-scanner app (React Native / Expo), and run it on my Android phone over USB

You are an autonomous coding agent working inside my project folder. Do the work yourself: create files, run terminal commands, read errors, fix them and retry. Ask me only when something needs a physical action on my phone or a decision only I can make.

This file is the **single source of truth**. Ignore any other prompt files in this folder.

---

## 1. WHAT THE APP DOES (keep it SIMPLE)

The user takes a photo of a plant leaf (or picks one from the gallery). The photo goes to an **AI model that runs on the phone**. The app shows the result: plant, healthy or diseased, disease name, and confidence. That's all.

**Screens (only three):**
1. **Splash:** logo and app name, short animation, then go to Home.
2. **Home (scan screen):** the whole app's main screen. A big hero with a **Scan leaf** button (camera) and a **Choose from gallery** button, plus a small "Tips for a good photo" card.
3. **Result:** shows the photo with an animated scan effect while analyzing, then the diagnosis.

**NOT included:** no login, no accounts, no history, no saved scans, no profile, no settings, no database, no network calls. Each scan lives only in memory.

---

## 2. MY SETUP

- OS: **Windows**. Editor: Antigravity with this project folder open.
- Test device: **my real Android phone connected by USB** (USB debugging on).
- Node.js, Android Studio (with Android SDK) and ADB should be installed (verify in Step A).
- The folder `deploy_bundle/` is inside this project folder and holds my trained model files.

---

## 3. THE MODEL FILES (in `deploy_bundle/`)

| File | Use it? | What it is |
|---|---|---|
| `deploy_bundle/student_kd.onnx` | ✅ **YES** | Trained model (about 1.1 MB), a small CNN trained by knowledge distillation from a ResNet50 teacher on PlantVillage |
| `deploy_bundle/class_names.json` | ✅ **YES** | JSON array of 38 class names, in the exact order of the model's outputs |
| `deploy_bundle/student_kd.pth` | ❌ **NO** | PyTorch backup. Do not use it. Do not delete it |

Rules:
- **Copy** the two used files into the app at `assets/model/`. Leave `deploy_bundle/` untouched.
- Do **not** retrain, re-export, modify or quantize the model. Only run inference.
- Never hard-code the class list. Always read `class_names.json`.

### Model contract (follow exactly; any mismatch gives wrong predictions)

| Item | Value |
|---|---|
| Input name | `image` |
| Input shape | `[1, 3, 224, 224]`, float32 |
| Layout | **CHW**, **RGB** order |
| Resize | Directly to 224×224 (no crop, no padding) |
| Scaling | Divide pixel values by 255 |
| Normalization (R,G,B) | mean `[0.485, 0.456, 0.406]`, std `[0.229, 0.224, 0.225]` |
| Output name | `logits` |
| Output shape | `[1, 38]`, raw scores (not probabilities) |
| Post-processing | Numerically stable **softmax** (subtract the max first), then top-3 |

Labels look like `Tomato___Late_blight` or `Apple___healthy`. Plant = text before `___`, condition = text after. If the condition contains "healthy" (case-insensitive), show the Healthy state. Some names contain commas, parentheses or a trailing underscore (for example `Corn_(maize)___Common_rust_`, `Pepper,_bell___Bacterial_spot`), so clean them for display: replace `_` with spaces, trim, remove stray commas.

---

## 4. UI: MODERN AND COOL (but simple)

Design a polished, premium-looking app, not a plain template. **Dark-first** design (one theme is enough).

**Look**
- Background: deep green-black `#0A130E`. Cards: `#122019` with a subtle 1px border `#1F3A2C`.
- Accent gradient: emerald `#10B981` to lime `#A3E635`. Use it on the main button, the confidence ring, and highlights.
- Status colours: Healthy = green `#22C55E`, Disease = amber/red `#F59E0B` to `#EF4444`.
- Text: white `#F5FAF7` for titles, soft grey-green `#9DB5A8` for secondary text.
- Rounded shapes: cards radius 24, buttons radius 18, pill badges. Soft glow behind the main button and the confidence ring.
- One font family bundled in the app (for example Inter or Poppins through an `@expo-google-fonts` package) so it works offline. Never load fonts from the network.
- Large readable type and large touch targets (at least 52px).
- Icons from `@expo/vector-icons`.

**Home screen**
- A big gradient hero card with a leaf icon, the title "Scan a leaf", and the line "Instant plant disease detection, offline".
- A large glowing primary button **Scan leaf** (camera icon) and a secondary outlined button **Choose from gallery**.
- Below, a "Tips for a good photo" card with 3 short tips (one leaf, plain background, daylight, in focus).
- A small "Offline AI" chip at the top showing a green dot (model ready) or a spinner ("Preparing AI model...") while loading. Keep the buttons disabled until the model is ready.

**Result screen**
- The photo at the top with rounded corners.
- While analyzing: an animated scan line sweeping over the photo, a soft pulsing glow, and rotating status text ("Analyzing leaf...", "Checking patterns...").
- Then reveal with a smooth animation:
  - A status banner: **Healthy ✅** (green) or **Disease detected ⚠️** (amber/red)
  - Plant name (large) and condition name
  - An animated circular **confidence ring** (`react-native-svg` + Reanimated) counting up to the percentage
  - **Top-3 predictions** as animated horizontal bars with percentages
  - A short "What to do" tip card (from a small local `tips.json`, generic advice per condition is fine)
  - A low-confidence notice if the top probability is under 60%: "Not sure. Try a clear photo of one leaf on a plain background."
  - Primary button **Scan another**
- A small back arrow to return Home.

**Motion (keep smooth, 200 to 500 ms)**
- Splash logo fade and scale. Staggered card entrance on Home. Press-scale on buttons. Scan-line animation during analysis. Ring and bars animate in on the result. Light haptic feedback when the result appears (`expo-haptics`).
- Animations must never block the UI.

**Quality**
- All colours, spacing, radii and font sizes come from `src/theme.js`. No hard-coded styles scattered in screens.
- Reusable components: `GradientButton`, `Card`, `ConfidenceRing`, `ProgressBar`, `ScreenContainer`.
- Respect safe areas, set a light status-bar style on the dark background.
- No remote images, fonts, icons or animations. Everything must work in airplane mode.

---

## 5. STEPS (do them in order)

### Step A: Check my environment
Run these and show me the results. If something is missing or wrong, tell me exactly how to fix it, then continue.
```
node -v
npm -v
java -version
adb --version
adb devices
```
- `adb devices` must list my phone as `device`. If it shows `unauthorized`, tell me to unlock the phone and tap **Allow** on the "Allow USB debugging?" popup. If the list is empty, tell me to check the cable, set USB mode to "File transfer", and turn on USB debugging (Settings → About phone → tap Build number 7 times → Developer options → USB debugging).
- If `ANDROID_HOME` is not set, tell me how to set it on Windows (usually `C:\Users\<name>\AppData\Local\Android\Sdk`, plus `%ANDROID_HOME%\platform-tools` in Path) and that I must restart the terminal afterwards.

### Step B: Verify the model before any app code
Create `tools/verify_model.py`, run `pip install onnxruntime pillow numpy`, then run it. It must print input name `image`, output name `logits`, and 38 classes. If anything differs from section 3, **stop and tell me**.

```python
import onnxruntime as ort, numpy as np, json, sys
from PIL import Image

sess = ort.InferenceSession("deploy_bundle/student_kd.onnx")
print("Inputs :", [(i.name, i.shape, i.type) for i in sess.get_inputs()])
print("Outputs:", [(o.name, o.shape, o.type) for o in sess.get_outputs()])
classes = json.load(open("deploy_bundle/class_names.json"))
print("Number of classes:", len(classes))

def predict(path):
    img = Image.open(path).convert("RGB").resize((224, 224))
    x = (np.array(img, dtype=np.float32) / 255 - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    x = x.transpose(2, 0, 1)[None].astype(np.float32)
    logits = sess.run(None, {"image": x})[0][0]
    e = np.exp(logits - logits.max()); p = e / e.sum()
    return [(classes[i], round(float(p[i]) * 100, 1)) for i in p.argsort()[::-1][:3]]

if len(sys.argv) > 1:
    print(predict(sys.argv[1]))
```
Later I may run `python tools/verify_model.py leaf.jpg`. The app's answer for the same photo must match this script.

### Step C: Create the Expo app
Create it in a **subfolder** called `PlantDoctor` inside this project folder:
```
npx create-expo-app@latest PlantDoctor
cd PlantDoctor
npx expo install expo-image-picker expo-image-manipulator expo-asset expo-file-system expo-linear-gradient expo-haptics react-native-reanimated react-native-svg @expo/vector-icons
npm install onnxruntime-react-native jpeg-js buffer
```
Also install a font package (for example `@expo-google-fonts/inter` with `expo-font`) and the navigation packages for your chosen router (`expo-router` comes with the default template; otherwise `@react-navigation/native-stack`). Pick one approach and use it consistently. Then copy the two model files into `PlantDoctor/assets/model/`.

### Step D: Configure bundling
- `metro.config.js`: add `onnx` to `resolver.assetExts` so the model is bundled into the app.
- `babel.config.js`: configure the Reanimated plugin correctly (it must be the last plugin).

### Step E: Write the app (full files, no placeholders)
Structure:
```
PlantDoctor/
├── assets/model/ (student_kd.onnx, class_names.json)
├── assets/data/tips.json        # condition -> short advice (generic is fine)
└── src/
    ├── theme.js
    ├── ml/
    │   ├── preprocess.js
    │   └── model.js
    ├── components/              # GradientButton, Card, ConfidenceRing, ProgressBar, ScreenContainer
    └── screens/                 # Splash, Home, Result
```

**`src/ml/preprocess.js`**
- Resize to 224×224 with `expo-image-manipulator` (JPEG, `base64: true`).
- Decode with `jpeg-js` (`useTArray: true`), which returns RGBA.
- Build `Float32Array(3*224*224)` in CHW order: `out[c*224*224 + i] = (data[i*4 + c] / 255 - mean[c]) / std[c]`. Ignore alpha.

**`src/ml/model.js`**
- `loadModel()`: `Asset.fromModule(require('.../assets/model/student_kd.onnx'))`, `await asset.downloadAsync()`, `InferenceSession.create(asset.localUri)`. Cache the session so it loads once.
- `predict(imageUri)`: preprocess, `new Tensor('float32', data, [1, 3, 224, 224])`, `session.run({ image: tensor })`, read `output.logits.data`, stable softmax, return the top 3 as `{ label, plant, condition, isHealthy, probability }`.
- Call `loadModel()` at app start and gate the scan buttons on it.

**Error handling (no crashes):** camera permission denied (show a friendly message with a button to retry), model load failure, inference failure, unreadable image.

### Step F: Build and run on my phone over USB
`onnxruntime-react-native` contains native code, so **Expo Go will NOT work**. Use a development build:
```
npx expo prebuild --platform android
npx expo run:android --device
```
- Make sure my phone is listed by `adb devices` first and choose it if asked.
- The first build can take 5 to 15 minutes. Wait for it. If a Gradle, Java or SDK error appears, read it, fix the cause and retry. Try `npx expo prebuild --clean` if the native project is in a bad state.
- When the app opens on my phone, tell me and tell me what to test.

### Step G: Tests (tell me to do these on my phone)
1. App opens, the "Offline AI" chip turns ready, and the scan buttons enable.
2. Scan a leaf with the camera (grant permission) and from the gallery.
3. The same photo gives the same top-1 class as `python tools/verify_model.py <photo>`.
4. The Result screen shows the status banner, plant, condition, confidence ring, top-3 bars and a tip. Percentages are between 0 and 100.
5. A non-leaf photo (for example a shoe) does not crash, and the low-confidence notice appears when confidence is under 60%.
6. **Turn on airplane mode, close and reopen the app, and scan again. It must still work.**

---

## 6. COMMON PROBLEMS (use these when debugging)

| Symptom | Cause and fix |
|---|---|
| Native module error / red screen about onnxruntime | Running in Expo Go. Use `npx expo run:android` (development build) |
| "Unable to resolve module ...onnx" | Wrong path, or `onnx` missing from `assetExts` in `metro.config.js` |
| Wrong or random predictions | Preprocessing mismatch. Check CHW, RGB, `/255`, mean/std, 224×224, and compare with `verify_model.py` on the same image |
| Huge values instead of 0 to 100% | The model outputs logits. Apply softmax |
| Input/output name error | They must be exactly `image` and `logits` |
| Blank screen or Reanimated crash | Babel plugin missing or not last. Run `npx expo start -c` |
| `adb devices` empty or `unauthorized` | Cable, USB mode, USB debugging, and the Allow popup on the phone |
| `SDK location not found` | Set `ANDROID_HOME`, or create `android/local.properties` with `sdk.dir=C:\\Users\\<name>\\AppData\\Local\\Android\\Sdk` |
| Gradle or Java errors | Use JDK 17. Check `JAVA_HOME`. Retry with `npx expo prebuild --clean` |
| JPEG decode fails | Make sure `ImageManipulator` outputs JPEG before decoding with `jpeg-js` |
| Slow first prediction | Normal warm-up. Keep the session cached |

---

## 7. HONEST LIMITS (show a small note on the Home or Result screen, and in your final notes)

- The model was trained on **PlantVillage**: clean lab photos with plain backgrounds. Accuracy on real field photos is lower.
- It only knows the **38 classes** in that dataset. Anything else is forced into one of them.
- It is a decision aid, not a replacement for an agronomist.

---

## 8. RULES

- Complete, runnable code. No "TODO", no "rest of code here".
- Functional components and hooks. Comment the preprocessing and softmax steps.
- Do not change the model's input/output names, shapes or normalization.
- Keep dependencies to what is listed unless truly needed, and say why.
- If you are unsure about a library API (versions change), check the official docs instead of guessing.
- Run commands yourself where you can and show me the results.

## 9. WHEN YOU FINISH, TELL ME

1. What you ran and what the results were (including Step B).
2. Anything you assumed or could not verify.
3. The exact things I should test on my phone (Step G).
