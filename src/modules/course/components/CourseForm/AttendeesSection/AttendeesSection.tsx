import { Box, Typography, Grid, Alert } from '@mui/material'
import { useFormContext, useWatch } from 'react-hook-form'

import { InfoPanel } from '@app/components/InfoPanel'
import { NumericTextField } from '@app/components/NumericTextField'
import { useAuth } from '@app/context/auth'
import { Accreditors_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { type CourseInput } from '@app/types'

import { type DisabledFields } from '..'

type Props = {
  disabledFields: Set<DisabledFields>
  isCreation?: boolean
}

export const AttendeesSection = ({ disabledFields, isCreation }: Props) => {
  const { acl } = useAuth()
  const { t } = useScopedTranslation('components.course-form')
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CourseInput>()
  const [type, accreditedBy] = useWatch({
    control,
    name: ['type', 'accreditedBy'],
  })
  const isOpenCourse = type === Course_Type_Enum.Open
  const isIndirectCourse = type === Course_Type_Enum.Indirect
  const isClosedCourse = type === Course_Type_Enum.Closed
  const isBild = accreditedBy === Accreditors_Enum.Bild
  const hasMinParticipants = isOpenCourse

  return (
    <InfoPanel
      title={t('attendees-section-title')}
      titlePosition="outside"
      renderContent={(content, props) => (
        <Box {...props} p={3} pt={4}>
          {content}
        </Box>
      )}
    >
      <Box>
        <Typography fontWeight={600}>{t('attendees-number-title')}</Typography>
        <Typography variant="body2" mb={2}>
          {t('attendees-description')}
        </Typography>

        <Grid container spacing={2}>
          {hasMinParticipants ? (
            <Grid item md={6} sm={12}>
              <NumericTextField
                required
                {...register('minParticipants', {
                  valueAsNumber: true,
                })}
                label={t('min-attendees-placeholder')}
                variant="filled"
                fullWidth
                error={Boolean(errors.minParticipants)}
                helperText={errors.minParticipants?.message}
                inputProps={{ min: 1 }}
                data-testid="min-attendees"
                disabled={disabledFields.has('minParticipants')}
              />
            </Grid>
          ) : null}

          <Grid item md={type === Course_Type_Enum.Open ? 6 : 12} sm={12}>
            <NumericTextField
              required
              {...register('maxParticipants', {
                deps: ['minParticipants'],
                valueAsNumber: true,
              })}
              id="filled-basic"
              label={t(
                isOpenCourse
                  ? 'max-attendees-placeholder'
                  : 'num-attendees-placeholder'
              )}
              variant="filled"
              fullWidth
              error={Boolean(errors.maxParticipants)}
              helperText={errors.maxParticipants?.message}
              inputProps={{ min: 1 }}
              data-testid="max-attendees"
              disabled={disabledFields.has('maxParticipants')}
            />
          </Grid>
          <Grid item>
            {!isCreation && isIndirectCourse && isBild && acl.isTrainer() && (
              <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
                {t('attendees-edit-label')}
              </Alert>
            )}
          </Grid>
        </Grid>
      </Box>

      {isClosedCourse ? (
        <Box mt={2}>
          <Typography fontWeight={600}>{t('free-spaces-title')}</Typography>
          <Typography variant="body2" mb={2}>
            {t('free-spaces-description')}
          </Typography>

          <Grid container spacing={2}>
            <Grid item md={12} sm={12}>
              <NumericTextField
                required
                {...register('freeSpaces', { valueAsNumber: true })}
                label={t('free-spaces-placeholder')}
                variant="filled"
                fullWidth
                error={Boolean(errors.freeSpaces)}
                helperText={errors.freeSpaces?.message}
                inputProps={{ min: 0 }}
                data-testid="free-spaces"
                disabled={disabledFields.has('freeSpaces')}
              />
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </InfoPanel>
  )
}
