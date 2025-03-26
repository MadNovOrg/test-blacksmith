import path from 'path'
import { mergeConfig } from 'vite'
import remarkGfm from 'remark-gfm'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: ['@storybook/addon-links', '@storybook/addon-interactions', {
    name: '@storybook/addon-essentials',
    options: {
      mdxPluginOptions: {
        mdxCompileOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    },
  }, '@storybook/addon-mdx-gfm', '@chromatic-com/storybook'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  docs: {},

  viteFinal: config => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@app': path.resolve(__dirname, '..', 'src'),
          '@test': path.resolve(__dirname, '..', 'test'),
          '@storybook-decorators': path.resolve(__dirname, 'decorators'),
        },
      },
    })
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
}
export default config
