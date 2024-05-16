import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { InfoPanel } from '@app/components/InfoPanel'
import { Course_Renewal_Cycle_Enum } from '@app/generated/graphql'
import { yup } from '@app/schemas'
import theme from '@app/theme'

export const schema = yup
  .mixed()
  .oneOf(Object.values(Course_Renewal_Cycle_Enum))

export const RenewalCycleRadios: React.FC<
  RadioGroupProps & { error?: string }
> = ({ error, ...props }) => {
  const { t } = useTranslation('components', {
    keyPrefix: 'course-form.renewal-cycle',
  })

  return (
    <InfoPanel
      title={t('panel-title')}
      titlePosition="outside"
      renderContent={(content, props) => (
        <Box {...props} pt={4} p={3}>
          {content}
        </Box>
      )}
    >
      <FormControl>
        <FormLabel id="renewal-cycle-label" component={Typography}>
          <Typography fontWeight={600} color={theme.palette.text.primary}>
            {t('label')}
          </Typography>
        </FormLabel>
        <RadioGroup
          aria-labelledby="renewal-cycle-label"
          row
          {...props}
          data-testid="renewal-cycle"
        >
          <FormControlLabel
            value={Course_Renewal_Cycle_Enum.One}
            control={<Radio />}
            label={t('radio-label', { count: 1 })}
          />
          <FormControlLabel
            value={Course_Renewal_Cycle_Enum.Two}
            control={<Radio />}
            label={t('radio-label', { count: 2 })}
          />
          <FormControlLabel
            value={Course_Renewal_Cycle_Enum.Three}
            control={<Radio />}
            label={t('radio-label', { count: 3 })}
          />
        </RadioGroup>
        {error ? (
          <FormHelperText error sx={{ mt: 2, mx: 0 }}>
            {error}
          </FormHelperText>
        ) : null}
      </FormControl>
    </InfoPanel>
  )
}
