import * as yup from 'yup'
import YupPassword from 'yup-password'
import type { TFunction } from 'react-i18next'

YupPassword(yup)

const SIGNUP_VERIFY_LENGTH = 6

const schemas = {
  email: (t: TFunction, required = true) => {
    const email = yup.string().email(t('validation-errors.email-invalid'))
    return required
      ? email.required(t('validation-errors.email-required'))
      : email
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
        [yup.ref(passRef), null],
        t('validation-errors.confirm-password-invalid')
      )
  },
}

export { yup, schemas, SIGNUP_VERIFY_LENGTH as EMAIL_VERIFY_LEN, TFunction }
