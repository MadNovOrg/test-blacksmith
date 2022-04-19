import { schemas, yup, TFunction } from '@app/schemas'
import { requiredMsg } from '@app/util'

import { sectors } from './components/org-data'

export type FormProps = {
  onSignUp: (email: string, password: string) => void
  courseId?: number
}

type Sector = keyof typeof sectors

export type FormInputs = {
  firstName: string
  surname: string
  email: string
  marketing: boolean
  countryCode: string
  phone: string
  password: string
  confirmPassword: string
  dob: Date | null
  orgId: string | null
  sector: Sector | ''
  position: string
  otherPosition: string
  tcs: boolean
}

export const getFormSchema = (t: TFunction) => {
  return yup.object({
    firstName: yup.string().required(requiredMsg(t, 'first-name')),

    surname: yup.string().required(requiredMsg(t, 'surname')),

    email: schemas.email(t),
    marketing: yup.boolean(),

    countryCode: yup.string(),
    phone: yup.string(),
    password: schemas.password(t),

    dob: yup.date(),
    orgId: yup
      .string()
      .required(requiredMsg(t, 'org-name'))
      .typeError(requiredMsg(t, 'org-name')),
    sector: yup.string().required(),
    position: yup.string().required(),
    otherPosition: yup.string().when('position', {
      is: 'other',
      then: yup
        .string()
        .required(t('validation-errors.other-position-required')),
    }),

    tcs: yup.boolean().oneOf([true], t('pages.signup.tcs-required')),
  })
}

export type SignUpResult = {
  username: string
  userSub: string
  confirmed: boolean
}
