import { TFunction } from 'i18next'
import { isPossiblePhoneNumber } from 'libphonenumber-js'
import { matchIsValidTel } from 'mui-tel-input'
import * as yup from 'yup'
import YupPassword from 'yup-password'

import 'yup-phone'
import { requiredMsg } from './util'

YupPassword(yup)

const SIGNUP_VERIFY_LENGTH = 6

yup.addMethod(yup.string, 'phoneNumber', function (t: TFunction) {
  return this.test(
    'phoneNumber',
    t('validation-errors.invalid-phone'),
    (value?: string) => matchIsValidTel(value ?? ''),
  )
})

yup.addMethod(yup.string, 'isPossiblePhoneNumber', function (t: TFunction) {
  return this.test(
    'isPossiblePhoneNumber',
    t('validation-errors.invalid-phone'),
    (value?: string) => isPossiblePhoneNumber(value ?? ''),
  )
})

yup.addMethod(yup.number, 'allowEmptyNumberField', function () {
  return this.transform(function (value, originalValue) {
    if (this.isType(value)) return value
    if (!originalValue || !originalValue.trim()) {
      return null
    }
    return originalValue
  })
})

const schemas = {
  email: (t: TFunction) => {
    const email = yup
      .string()
      .transform(currentValue => currentValue.trim().toLowerCase())
      .email(t('validation-errors.email-invalid'))
    return email
  },

  emailCode: (t: TFunction) => {
    return yup
      .string()
      .min(SIGNUP_VERIFY_LENGTH, t('validation-errors.otp-required'))
  },

  password: (t: TFunction) => {
    return yup
      .string()
      .min(8, t('validation-errors.password-min', { count: 8 }))
      .minLowercase(1, t('validation-errors.password-minlower', { count: 1 }))
      .minUppercase(1, t('validation-errors.password-minupper', { count: 1 }))
      .minNumbers(1, t('validation-errors.password-minnums', { count: 1 }))
      .minSymbols(1, t('validation-errors.password-minspecial', { count: 1 }))
  },

  passconf: (t: TFunction, passRef = 'password') => {
    return yup
      .string()
      .oneOf(
        [yup.ref(passRef), ''],
        t('validation-errors.confirm-password-invalid'),
      )
  },
  phone: (t: TFunction) => {
    return yup
      .string()
      .required(requiredMsg(t, 'phone'))
      .phoneNumber(t)
      .isPossiblePhoneNumber(t)
  },
}

export { yup, schemas, SIGNUP_VERIFY_LENGTH as EMAIL_VERIFY_LEN }
