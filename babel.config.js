// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // ← Add / enable this line
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: ['expo-router/babel'],
  };
};