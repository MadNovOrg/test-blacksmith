import { schemas, yup, TFunction } from '@app/schemas'
import { requiredMsg } from '@app/util'

export type FormProps = {
  onSignUp: (email: string, password: string) => void
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
