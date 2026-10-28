const { withProjectBuildGradle } = require('@expo/config-plugins');

// The ONNX React Native package requests latest.integration from Maven Central.
// Pin it to the matching native runtime version to avoid dynamic metadata lookup
// and keep the JS bridge and Android runtime in sync.
module.exports = function withOnnxAndroidVersion(config) {
  return withProjectBuildGradle(config, (modConfig) => {
    const marker = '// Pin ONNX Runtime Android to the React Native package version.';
    if (modConfig.modResults.contents.includes(marker)) return modConfig;

    const pin = `${marker}\nsubprojects {\n  configurations.configureEach {\n    resolutionStrategy.eachDependency { details ->\n      if (details.requested.group == 'com.microsoft.onnxruntime' &&\n          details.requested.name in ['onnxruntime-android', 'onnxruntime-android-qnn']) {\n        details.useVersion '1.24.3'\n      }\n    }\n  }\n}\n`;
    modConfig.modResults.contents += `\n${pin}`;
    return modConfig;
  });
};
