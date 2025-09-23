import { Box } from '@mui/material'
import { t } from 'i18next'
import { FieldErrors, UseFormRegister, Control } from 'react-hook-form'

import { InfoPanel } from '@app/components/InfoPanel'
import { CourseInput } from '@app/types'

import { DisabledFields } from '../..'

import FinancePricingSection from './FinancePricingSection'

interface Props {
  isCreateCourse: boolean
  errors: FieldErrors<CourseInput>
  price?: number | null
  priceCurrency?: string
  includeVAT?: boolean | null
  residingCountry?: string
  disabledFields: Set<DisabledFields>
  register: UseFormRegister<CourseInput>
  control?: Control<CourseInput>
}

const OpenCourseFinanceSection: React.FC<React.PropsWithChildren<Props>> = ({
  isCreateCourse,
  errors,
  price,
  priceCurrency,
  includeVAT,
  residingCountry,
  disabledFields,
  register,
  control,
}) => {
  return (
    <InfoPanel
      title={t('components.course-form.finance-section-title')}
      titlePosition="outside"
      renderContent={(content, props) => (
        <Box {...props} p={3} pt={4}>
          {content}
        </Box>
      )}
    >
      <FinancePricingSection
        isCreateCourse={isCreateCourse}
        errors={errors}
        price={price}
        priceCurrency={priceCurrency}
        includeVAT={includeVAT}
        residingCountry={residingCountry}
        disabledFields={disabledFields}
        control={control}
        register={register}
      />
    </InfoPanel>
  )
}

export default OpenCourseFinanceSection
