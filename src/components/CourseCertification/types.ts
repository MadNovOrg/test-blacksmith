import { GetCertificateQuery } from '@app/generated/graphql'
import { NonNullish } from '@app/types'

export type ModuleObject = {
  name: string
  completed: boolean
}
export type Participant = Pick<
  NonNullish<GetCertificateQuery['certificate']>,
  'participant'
>
export type CertificateChangelog = Pick<
  NonNullish<Participant['participant']>,
  'certificateChanges'
>
