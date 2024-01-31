import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { StepsNavigation } from '@app/components/StepsNavigation'

import { useImportContext } from '../../context/ImportProvider'

export const ImportSteps: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'import-users' })
  const { currentStepKey, completedSteps } = useImportContext()

  const steps: ComponentProps<typeof StepsNavigation>['steps'] = [
    { label: t('steps.choose.title'), key: 'choose' },
    { label: t('steps.configure.title'), key: 'configure' },
    { label: t('steps.preview.title'), key: 'preview' },
    { label: t('steps.importing.title'), key: 'importing' },
    { label: t('steps.results.title'), key: 'results' },
  ]

  return (
    <StepsNavigation
      steps={steps}
      currentStepKey={currentStepKey}
      completedSteps={completedSteps}
    />
  )
}
