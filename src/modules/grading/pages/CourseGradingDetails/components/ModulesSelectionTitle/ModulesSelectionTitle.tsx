import { Box, Typography, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'

const StyledText = styled(Typography)(({ theme }) => ({
  display: 'inline',
  color: theme.palette.dimGrey.main,
}))

export const ModulesSelectionTitle: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Box mb={4}>
      <Typography variant="h5" fontWeight="500" mb={2}>
        {t('pages.modules-selection.title')}
      </Typography>
      <StyledText variant="body1">
        {t('pages.modules-selection.page-description-line1')}
      </StyledText>
      <StyledText variant="body1" fontWeight="600">
        {t('pages.modules-selection.page-description-line2')}
      </StyledText>
    </Box>
  )
}
