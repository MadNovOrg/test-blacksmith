import { schemas, yup, TFunction } from '@app/schemas'

export type FormProps = {
  onSignUp: (resp: SignUpResult) => void
}

export type FormInputs = {
  email: string
  password: string
  confirmPassword: string
  givenName: string
  familyName: string
  marketing: boolean
  tcs: boolean
}

const requiredMsg = (t: TFunction, name: string) => {
  return t('validation-errors.required-field', { name: t(name) })
}

export const getFormSchema = (t: TFunction) => {
  return yup.object({
    email: schemas.email(t),

    givenName: yup
      .string()
      .required(requiredMsg(t, 'pages.signup.givenName-label')),

    familyName: yup
      .string()
      .required(requiredMsg(t, 'pages.signup.familyName-label')),

    password: schemas.password(t),

    confirmPassword: schemas
      .passconf(t, 'password')
      .required(requiredMsg(t, 'pages.signup.confirmPassword-label')),

    marketing: yup.boolean(),

    tcs: yup.boolean().oneOf([true], t('pages.signup.tcs-required')),
  })
}

export type SignUpResult = {
  username: string
  userSub: string
  confirmed: boolean
}

export type VerifyProps = {
  username: string
  onVerified: () => void
}

export type VerifyInputs = {
  code: string
}

export const getVerifySchema = (t: TFunction) => {
  return yup.object({
    code: schemas
      .emailCode(t)
      .required(requiredMsg(t, 'pages.signup.verify-code-label')),
  })
}
