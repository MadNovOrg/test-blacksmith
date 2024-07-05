import {
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  FormHelperText,
} from '@mui/material'
import { useCallback } from 'react'
import { FieldErrors, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Course_Level_Enum } from '@app/generated/graphql'

export type AttendeeValidCertificateProps = {
  handleCheckboxValue: (state: boolean) => void
  errors: FieldErrors
  courseLevel?: Course_Level_Enum
  reaccreditation: boolean
  conversion: boolean
  totalAttendees: number
  isChecked: boolean
}

export const AttendeeValidCertificate: React.FC<
  React.PropsWithChildren<AttendeeValidCertificateProps>
> = ({
  handleCheckboxValue,
  courseLevel,
  reaccreditation = false,
  conversion = false,
  totalAttendees,
  errors,
  isChecked,
}) => {
  const { t } = useTranslation()
  const showAttendeeTranslationOptions = useCallback(
    (
      reaccreditation: boolean,
      conversion: boolean,
      attendees: number,
      courseLevel?: Course_Level_Enum,
    ) => {
      switch (courseLevel) {
        case Course_Level_Enum.Advanced:
          return {
            attendees,
            levels: reaccreditation
              ? t(
                  'pages.book-course.attendee-with-valid-certificate.levels.advanced.reaccreditation',
                )
              : t(
                  'pages.book-course.attendee-with-valid-certificate.levels.advanced.default',
                ),
          }
        case Course_Level_Enum.IntermediateTrainer:
          return {
            attendees,
            levels: reaccreditation
              ? t(
                  'pages.book-course.attendee-with-valid-certificate.levels.intermediate-trainer.reaccreditation',
                )
              : t(
                  'pages.book-course.attendee-with-valid-certificate.levels.intermediate-trainer.default',
                ),
          }
        case Course_Level_Enum.FoundationTrainerPlus:
          return {
            attendees,
            levels: reaccreditation
              ? t(
                  'pages.book-course.attendee-with-valid-certificate.levels.foundation-trainer-plus.reaccreditation',
                )
              : t(
                  'pages.book-course.attendee-with-valid-certificate.levels.foundation-trainer-plus.default',
                ),
          }
        case Course_Level_Enum.AdvancedTrainer:
          return {
            attendees,
            levels: reaccreditation
              ? t(
                  'pages.book-course.attendee-with-valid-certificate.levels.advanced-trainer.reaccreditation',
                )
              : t(
                  'pages.book-course.attendee-with-valid-certificate.levels.advanced-trainer.default',
                ),
          }
        case Course_Level_Enum.BildIntermediateTrainer:
          return {
            attendees,
            levels: reaccreditation
              ? t(
                  'pages.book-course.attendee-with-valid-certificate.levels.bild-intermediate-trainer.reaccreditation',
                )
              : conversion
              ? t(
                  'pages.book-course.attendee-with-valid-certificate.levels.bild-intermediate-trainer.conversion',
                )
              : t(
                  'pages.book-course.attendee-with-valid-certificate.levels.bild-intermediate-trainer.default',
                ),
          }
        case Course_Level_Enum.BildAdvancedTrainer:
          return {
            attendees,
            levels: reaccreditation
              ? t(
                  'pages.book-course.attendee-with-valid-certificate.levels.bild-advanced-trainer.reaccreditation',
                )
              : conversion
              ? t(
                  'pages.book-course.attendee-with-valid-certificate.levels.bild-advanced-trainer.conversion',
                )
              : t(
                  'pages.book-course.attendee-with-valid-certificate.levels.bild-advanced-trainer.default',
                ),
          }
        default:
          return {}
      }
    },
    [t],
  )

  return (
    <Controller
      name="attendeeValidCertificate"
      render={({ field }) => (
        <Box bgcolor="common.white" pt={2}>
          <FormControlLabel
            {...field}
            control={
              <Checkbox
                checked={isChecked}
                onChange={state => handleCheckboxValue(state.target.checked)}
              />
            }
            label={
              <Typography color="grey.700">
                {t(
                  'pages.book-course.attendee-with-valid-certificate.message',
                  showAttendeeTranslationOptions(
                    reaccreditation,
                    conversion,
                    totalAttendees,
                    courseLevel,
                  ),
                )}
              </Typography>
            }
          />
          {errors.attendeeValidCertificate?.message && (
            <FormHelperText error>
              {errors.attendeeValidCertificate.message as string}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  )
}
