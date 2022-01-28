const path = require("path");
const { loadConfigFromFile, mergeConfig } = require("vite");

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: '@storybook/addon-postcss',
      options: {
        cssLoaderOptions: {
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    }
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "storybook-builder-vite"
  },
  async viteFinal(config) {
    const { config: userConfig } = await loadConfigFromFile(
      path.resolve(__dirname, "../vite.config.ts")
    );

    config = mergeConfig(config, {
      resolve: {
        alias: {
          '@app': path.resolve(__dirname, '..', 'src'),
        },
      },
      plugins: [userConfig.plugins.find(p => p.name === 'vite:svgr')],
    });

    return config;
  },
}
