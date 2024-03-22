import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import React, { memo, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { FeesForm } from '@app/components/FeesForm'
import {
  schema as feesSchema,
  FormValues as FeesFormValues,
} from '@app/components/FeesForm'
import { InfoPanel } from '@app/components/InfoPanel'
import {
  schema as participantPostalAddressSchema,
  FormValues as ParticipantFormValues,
} from '@app/components/ParticipantPostalAddressForm'
import { ParticipantPostalAddressForm } from '@app/components/ParticipantPostalAddressForm'
import {
  Course_Level_Enum,
  TransferCourse,
  TransferFeeType,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { isAddressInfoRequired } from '@app/pages/TransferParticipant/utils'

import {
  TransferModeEnum,
  useTransferParticipantContext,
} from '../TransferParticipantProvider'
import { TransferTermsTable } from '../TransferTermsTable'

export type FormValues = FeesFormValues & ParticipantFormValues

type Props = {
  courseStartDate: Date
  courseLevel: Course_Level_Enum
  priceCurrency: string | null | undefined
  onChange: (values: FormValues, isValid: boolean) => void
  mode?: TransferModeEnum
  termsTable?: React.ReactElement
  optionLabels?: Record<TransferFeeType, string>
  courseToTransferTo: TransferCourse
}

const FeesPanel: React.FC<React.PropsWithChildren<Props>> = ({
  courseStartDate,
  courseLevel,
  priceCurrency,
  onChange,
  mode = TransferModeEnum.ADMIN_TRANSFERS,
  courseToTransferTo,
}) => {
  const { t } = useScopedTranslation(
    'pages.transfer-participant.transfer-details'
  )

  const { fromCourse } = useTransferParticipantContext()

  const isAddressRequired = isAddressInfoRequired({
    fromCourse: fromCourse as unknown as TransferCourse,
    toCourse: courseToTransferTo,
  })

  const schema = () => {
    let combinedSchema = feesSchema
    if (isAddressRequired) {
      combinedSchema = feesSchema.concat(participantPostalAddressSchema)
    }
    return combinedSchema
  }

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema()),
    mode: 'onChange',
    defaultValues: {
      feeType:
        mode === TransferModeEnum.ORG_ADMIN_TRANSFERS
          ? TransferFeeType.ApplyTerms
          : undefined,
    },
  })

  const { watch, formState, trigger } = methods

  const formValues = watch()

  useEffect(() => {
    onChange(formValues, formState.isValid)
  }, [formValues, formState.isValid, onChange])
  useEffect(() => {
    if (formValues.inviteeCountry) {
      trigger('inviteeCountry')
    }
  }, [formValues.inviteeCountry, trigger])

  return (
    <Box>
      <FormProvider {...methods}>
        <InfoPanel titlePosition="inside">
          <FeesForm
            mode={mode}
            priceCurrency={priceCurrency}
            optionLabels={{
              [TransferFeeType.ApplyTerms]: t('apply-terms-option'),
            }}
          >
            <TransferTermsTable
              startDate={courseStartDate}
              courseLevel={courseLevel}
            />
          </FeesForm>
        </InfoPanel>
        {isAddressRequired ? (
          <Box mt={2}>
            <InfoPanel>
              <ParticipantPostalAddressForm />
            </InfoPanel>
          </Box>
        ) : null}
      </FormProvider>
    </Box>
  )
}

export default memo(FeesPanel)
