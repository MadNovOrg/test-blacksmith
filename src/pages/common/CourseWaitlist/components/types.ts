import { schemas, yup, TFunction } from '@app/schemas'
import { requiredMsg } from '@app/util'

export const getFormSchema = (t: TFunction) => {
  return yup.object({
    firstName: yup.string().required(requiredMsg(t, 'first-name')),

    surname: yup.string().required(requiredMsg(t, 'surname')),

    email: schemas.email(t, true),

    phone: yup
      .string()
      .required(requiredMsg(t, 'phone'))
      .min(10, t('validation-errors.phone-invalid')),

    orgName: yup.string().required(requiredMsg(t, 'org-name')),
  })
}
