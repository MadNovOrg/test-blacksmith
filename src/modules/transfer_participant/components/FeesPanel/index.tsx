import { yupResolver } from '@hookform/resolvers/yup'
import { Alert } from '@mui/material'
import Box from '@mui/material/Box'
import React, { memo, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import useWorldCountries, {
  UKsCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  FeesForm,
  schema as feesSchema,
  FormValues as FeesFormValues,
} from '@app/components/FeesForm'
import { InfoPanel } from '@app/components/InfoPanel'
import {
  Course_Level_Enum,
  TransferCourse,
  TransferFeeType,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import {
  ParticipantPostalAddressForm,
  schema as participantPostalAddressSchema,
  FormValues as ParticipantFormValues,
} from '@app/modules/course_details/course_attendees_tab/components/ParticipantPostalAddressForm'
import { isAddressInfoRequired } from '@app/modules/transfer_participant/utils/utils'

import {
  ContextValue,
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
  defaultValues?: ContextValue['fees']
}

const FeesPanel: React.FC<React.PropsWithChildren<Props>> = ({
  courseStartDate,
  courseLevel,
  priceCurrency,
  onChange,
  mode = TransferModeEnum.ADMIN_TRANSFERS,
  courseToTransferTo,
  defaultValues,
}) => {
  const { isUKCountry } = useWorldCountries()
  const { t, _t } = useScopedTranslation(
    'pages.transfer-participant.transfer-details',
  )

  const { fromCourse, virtualCourseParticipantAdress } =
    useTransferParticipantContext()

  const isAddressRequired =
    isUKCountry(fromCourse?.residingCountry ?? UKsCodes.GB_ENG) &&
    isAddressInfoRequired({
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
    mode: 'all',
    defaultValues: {
      feeType:
        mode === TransferModeEnum.ORG_ADMIN_TRANSFERS
          ? TransferFeeType.ApplyTerms
          : defaultValues?.type,
      ...virtualCourseParticipantAdress,
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
            defaultValues={defaultValues}
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
              <Alert severity="info" variant="filled" sx={{ mt: 1 }}>
                <b>{_t('important')}:</b> {`${_t('pages.book-course.notice')}`}
              </Alert>
              <Alert
                variant="filled"
                color="info"
                severity="info"
                sx={{ mt: 2 }}
              >
                <b>{_t('important')}:</b>{' '}
                {`${_t('pages.book-course.notice-participants')}`}
              </Alert>
            </InfoPanel>
          </Box>
        ) : null}
      </FormProvider>
    </Box>
  )
}

export default memo(FeesPanel)
