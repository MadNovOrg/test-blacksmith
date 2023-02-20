import { TFunction } from 'i18next'
import * as Yup from 'yup'

declare module 'yup' {
  interface StringSchema extends Yup.StringSchema {
    phoneNumber(t: TFunction): StringSchema
  }
}
