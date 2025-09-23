import { I18nextProvider } from 'react-i18next'
import i18n from '../../src/i18n/config'

export default function withi18nProvider(Story: any) {
  return (
    <I18nextProvider i18n={i18n}>
      <Story />
    </I18nextProvider>
  )
}
