import { Box, FormLabel, TextField, TextFieldProps } from '@mui/material'
import { useTranslation } from 'react-i18next'

import theme from '@app/theme'

type Props = {
  groupId: string
} & TextFieldProps

export const ModuleGroupNoteInput: React.FC<Props> = ({
  groupId,
  ...props
}) => {
  const { t } = useTranslation('pages', {
    keyPrefix: 'course-grading.module-group-note-input',
  })

  return (
    <Box bgcolor="white" p={2} pt={0}>
      <FormLabel
        htmlFor={`module-group-note-${groupId}`}
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: 'block',
          mb: 1,
        }}
      >
        {t('label')}
      </FormLabel>
      <TextField
        {...props}
        name="module-group-note"
        fullWidth
        type="text"
        variant="filled"
        size="small"
        placeholder={t('placeholder')}
        id={`module-group-note-${groupId}`}
      />
    </Box>
  )
}
