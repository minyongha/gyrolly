const { getDefaultConfig } = require("expo/metro-config");
const defaultConfig = getDefaultConfig(__dirname);
console.log(__dirname);
// defaultConfig.resolver.assetsInclude.push("**/*.glb");
defaultConfig.resolver.assetExts.push("glb");
module.exports = {
  ...defaultConfig,
  watchFolders: ["./"],
  maxWorkers: 2, // 워커 개수를 제한
};
