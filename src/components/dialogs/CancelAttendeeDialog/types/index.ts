import { CancellationFeeType } from '@app/generated/graphql'

export type FormInput = {
  cancellationFee: number
  cancellationFeePercent: number
  cancellationReason: string
  feeType: CancellationFeeType
}
