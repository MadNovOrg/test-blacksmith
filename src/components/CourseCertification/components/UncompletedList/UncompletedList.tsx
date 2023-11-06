import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { ModuleObject } from '../../types'

type UncompletedListProps = {
  uncompletedModules: ModuleObject[]
}

export const UncompletedList: React.FC<
  React.PropsWithChildren<UncompletedListProps>
> = ({ uncompletedModules }) => {
  const { t } = useTranslation()
  return (
    <Box>
      <Typography variant="body2" color="grey.600" gutterBottom>
        {t('incomplete')}
      </Typography>
      {uncompletedModules.map(module => {
        return (
          <Typography
            key={module.name}
            color="grey.600"
            variant="body1"
            gutterBottom
          >
            {module.name}
          </Typography>
        )
      })}
    </Box>
  )
}
