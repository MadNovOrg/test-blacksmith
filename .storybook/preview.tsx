import type { Preview } from '@storybook/react'
import { urqlDecorator } from '@urql/storybook-addon'
import withMuiThemeProvider from './decorators/withMuiThemeProvider'
import withRouterProvider from './decorators/withRouterProvider'
import withI18Provider from './decorators/withi18nProvider'

import DocumentationTemplate from './templates/documentation.mdx'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      page: DocumentationTemplate,
    },
  },

  decorators: [
    withMuiThemeProvider,
    withI18Provider,
    withRouterProvider,
    urqlDecorator,
  ],

  tags: ['autodocs']
}

export default preview
