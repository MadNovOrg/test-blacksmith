import {
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  FormHelperText,
} from '@mui/material'
import { FieldErrors, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Course_Level_Enum } from '@app/generated/graphql'

import { showAttendeeTranslationOptions } from '../utils'

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
