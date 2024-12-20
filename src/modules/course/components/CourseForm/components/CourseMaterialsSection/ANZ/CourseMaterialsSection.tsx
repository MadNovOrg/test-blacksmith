import InfoIcon from '@mui/icons-material/Info'
import { Box, Typography, Grid } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { InfoPanel } from '@app/components/InfoPanel'
import { NumericTextField } from '@app/components/NumericTextField'
import { useAuth } from '@app/context/auth'
import {
  Course_Level_Enum,
  Course_Type_Enum,
  Currency,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useResourcePackPricing } from '@app/modules/resource_packs/hooks/useResourcePackPricing'
import { type CourseInput } from '@app/types'
import { CurrencySymbol, GST, isNotNullish } from '@app/util'

type Props = {
  isCreation?: boolean
}

export const CourseMaterialsSection = ({ isCreation }: Props) => {
  const { acl } = useAuth()
  const { t } = useScopedTranslation('components.course-form.resource-packs')
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CourseInput>()
  const [
    maxParticipants,
    freeCourseMaterials,
    priceCurrency,
    includeVAT,
    type,
    courseLevel,
    deliveryType,
    reaccreditation,
  ] = useWatch({
    control,
    name: [
      'maxParticipants',
      'freeCourseMaterials',
      'priceCurrency',
      'includeVAT',
      'type',
      'courseLevel',
      'deliveryType',
      'reaccreditation',
    ],
  })

  const [enableEditMCM, setEnableEditMCM] = useState(isCreation)
  const initialMaxParticipants = useRef(maxParticipants)
  const initialFreeCourseMaterials = useRef(freeCourseMaterials)
  const courseCurrency = (priceCurrency as Currency) ?? Currency.Gbp

  const { data } = useResourcePackPricing({
    course_type: type as Course_Type_Enum,
    course_level: courseLevel as Course_Level_Enum,
    course_delivery_type: deliveryType,
    reaccreditation,
    currency: courseCurrency,
  })

  useEffect(() => {
    if (!isCreation) {
      if (maxParticipants === initialMaxParticipants.current) {
        setEnableEditMCM(false)
        setValue('freeCourseMaterials', initialFreeCourseMaterials.current)
      } else {
        setEnableEditMCM(true)
      }
    }
  }, [isCreation, maxParticipants, setValue])

  const mandatoryCourseMaterials =
    isNotNullish(maxParticipants) &&
    isNotNullish(freeCourseMaterials) &&
    freeCourseMaterials >= 0
      ? maxParticipants - freeCourseMaterials
      : 0

  return (
    <InfoPanel
      title={t('section-title')}
      titlePosition="outside"
      renderContent={(content, props) => (
        <Box {...props} p={3} pt={4}>
          {content}
        </Box>
      )}
    >
      <Box>
        <Typography fontWeight={600}>{t('panel-title')}</Typography>
        <Typography variant="body2" mb={2}>
          {t('panel-description', {
            mcmAmount: `${CurrencySymbol[courseCurrency]}${
              data?.anz_resource_packs_pricing[0]?.price
            }${acl.isAustralia() && includeVAT ? GST : ''}`,
          })}
        </Typography>

        <Grid container spacing={2}>
          <Grid item md={12} sm={12}>
            <NumericTextField
              required
              {...register('freeCourseMaterials', {
                valueAsNumber: true,
              })}
              label={t('placeholder-description')}
              variant="filled"
              fullWidth
              error={Boolean(errors.freeCourseMaterials)}
              helperText={errors.freeCourseMaterials?.message}
              inputProps={{ min: 1 }}
              data-testid="free-course-materials"
              disabled={!enableEditMCM}
            />
          </Grid>
        </Grid>
        <Box display={'flex'} alignItems={'center'} mt={2}>
          <InfoIcon color="action" />
          <Typography
            fontWeight={600}
            ml={1}
            data-testid="mandatory-course-materials"
          >
            {t('amount-of-mandatory-mcm', {
              count:
                mandatoryCourseMaterials > 0 ? mandatoryCourseMaterials : 0,
            })}
          </Typography>
        </Box>
      </Box>
    </InfoPanel>
  )
}
