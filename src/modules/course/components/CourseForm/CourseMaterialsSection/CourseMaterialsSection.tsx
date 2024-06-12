import InfoIcon from '@mui/icons-material/Info'
import { Box, Typography, Grid } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { InfoPanel } from '@app/components/InfoPanel'
import { NumericTextField } from '@app/components/NumericTextField'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { type CourseInput } from '@app/types'
import { isNotNullish } from '@app/util'

type Props = {
  isCreation?: boolean
}

export const CourseMaterialsSection = ({ isCreation }: Props) => {
  const { t } = useScopedTranslation(
    'components.course-form.mandatory-course-materials'
  )
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CourseInput>()
  const [maxParticipants, mandatoryCourseMaterials] = useWatch({
    control,
    name: ['maxParticipants', 'mandatoryCourseMaterials'],
  })

  const [enableEditMCM, setEnableEditMCM] = useState(isCreation)
  const initialMaxParticipants = useRef(maxParticipants)

  useEffect(() => {
    if (!isCreation) {
      setEnableEditMCM(maxParticipants !== initialMaxParticipants.current)
    }
  }, [isCreation, maxParticipants])

  const freeMaterials =
    isNotNullish(maxParticipants) && isNotNullish(mandatoryCourseMaterials)
      ? maxParticipants - mandatoryCourseMaterials
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
          {t('panel-description')}
        </Typography>

        <Grid container spacing={2}>
          <Grid item md={12} sm={12}>
            <NumericTextField
              required
              {...register('mandatoryCourseMaterials', {
                valueAsNumber: true,
              })}
              label={t('placeholder-description')}
              variant="filled"
              fullWidth
              error={Boolean(errors.mandatoryCourseMaterials)}
              helperText={errors.mandatoryCourseMaterials?.message}
              inputProps={{ min: 1 }}
              data-testid="mandatory-course-materials"
              disabled={!enableEditMCM}
            />
          </Grid>
        </Grid>
        <Box display={'flex'} alignItems={'center'} mt={2}>
          <InfoIcon color="action" />
          <Typography
            fontWeight={600}
            ml={1}
            data-testid="free-course-materials"
          >
            {t('amount-of-free-mcm', {
              count: freeMaterials > 0 ? freeMaterials : 0,
            })}
          </Typography>
        </Box>
      </Box>
    </InfoPanel>
  )
}
