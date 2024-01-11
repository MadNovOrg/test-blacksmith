import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

type Props = {
  note: string
}

export const ModuleGroupNote: React.FC<Props> = ({ note }) => {
  const { t } = useTranslation('pages', {
    keyPrefix: 'course-grading.module-group-note-input',
  })

  return (
    <Box p={1.5} pt={0} bgcolor="white">
      <Typography fontWeight={600} mb={1}>
        {t('label')}
      </Typography>
      <Typography>{note}</Typography>
    </Box>
  )
}
