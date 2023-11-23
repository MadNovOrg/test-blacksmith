import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import React, { memo, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { FeesForm, schema as feesFormSchema } from '@app/components/FeesForm'
import { InfoPanel } from '@app/components/InfoPanel'
import { Course_Level_Enum, TransferFeeType } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { yup } from '@app/schemas'

import { TransferModeEnum } from '../TransferParticipantProvider'
import { TransferTermsTable } from '../TransferTermsTable'

export type FormValues = yup.InferType<typeof feesFormSchema>
type Props = {
  courseStartDate: Date
  courseLevel: Course_Level_Enum
  onChange?: (values: FormValues, isValid: boolean) => void
  mode?: TransferModeEnum
  termsTable?: React.ReactElement
  optionLabels?: Record<TransferFeeType, string>
}

const FeesPanel: React.FC<React.PropsWithChildren<Props>> = ({
  courseStartDate,
  courseLevel,
  onChange,
  mode = TransferModeEnum.ADMIN_TRANSFERS,
}) => {
  const { t } = useScopedTranslation(
    'pages.transfer-participant.transfer-details'
  )

  const methods = useForm<FormValues>({
    resolver: yupResolver(feesFormSchema),
    mode: 'onChange',
    defaultValues: {
      feeType:
        mode === TransferModeEnum.ORG_ADMIN_TRANSFERS
          ? TransferFeeType.ApplyTerms
          : undefined,
    },
  })

  const { watch, formState } = methods

  const formValues = watch()

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(formValues, formState.isValid)
    }
  }, [formValues, formState.isValid, onChange])

  return (
    <Box>
      <InfoPanel titlePosition="inside">
        <FormProvider {...methods}>
          <FeesForm
            mode={mode}
            optionLabels={{
              [TransferFeeType.ApplyTerms]: t('apply-terms-option'),
            }}
          >
            <TransferTermsTable
              startDate={courseStartDate}
              courseLevel={courseLevel}
            />
          </FeesForm>
        </FormProvider>
      </InfoPanel>
    </Box>
  )
}

export default memo(FeesPanel)
