import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { Box, Button } from '@mui/material'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

export const AdminViewButton: React.FC<{
  onShowChangelogModal: VoidFunction
}> = ({ onShowChangelogModal }) => {
  const { _t } = useScopedTranslation('common.course-certificate')
  return (
    <Box>
      <Button
        variant="text"
        color="primary"
        sx={{ ml: 1, py: 0 }}
        size="small"
        onClick={onShowChangelogModal}
        startIcon={<RemoveRedEyeIcon />}
      >
        {_t('view-details')}
      </Button>
    </Box>
  )
}
