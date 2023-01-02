const path = require('path');
const {
  loadConfigFromFile,
  mergeConfig
} = require('vite');
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  async viteFinal(config) {
    const {
      config: userConfig
    } = await loadConfigFromFile(path.resolve(__dirname, '../vite.config.ts'));
    config = mergeConfig(config, {
      resolve: {
        alias: {
          '@app': path.resolve(__dirname, '..', 'src'),
          '@test': path.resolve(__dirname, '..', 'test'),
          '@storybook-decorators': path.resolve(__dirname, './decorators')
        }
      },
      plugins: [userConfig.plugins.find(p => p.name === 'vite:svgr')]
    });
    return {
      ...config,
      define: {
        ...config.define,
        global: 'window'
      }
    };
  },
  docs: {
    autodocs: true
  }
};