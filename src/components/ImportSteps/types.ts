import { ComponentProps } from 'react'

import { StepsNavigation } from '../StepsNavigation'

export enum ImportStepsEnum {
  CHOOSE = 'choose',
  CONFIGURE = 'configure',
  PREVIEW = 'preview',
  IMPORTING = 'importing',
  RESULTS = 'results',
}
export type Step = {
  label: ComponentProps<typeof StepsNavigation>['steps'][0]['label']
  key: ImportStepsEnum
}
