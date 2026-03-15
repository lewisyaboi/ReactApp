const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;           // ← disable exports field
// or (alternative / more targeted)
// config.resolver.extraNodeModules = {
//   'zustand': require.resolve('zustand'),   // forces CJS version
// };

module.exports = config;