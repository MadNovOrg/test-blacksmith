import type { Preview } from '@storybook/react'
import withMuiThemeProvider from './decorators/withMuiThemeProvider'
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
  decorators: [withMuiThemeProvider],
}

export default preview
