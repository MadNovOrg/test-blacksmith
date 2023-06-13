import { Box, Button, Grid, Typography } from '@mui/material'
import { useState } from 'react'

import { Dialog } from '@app/components/Dialog'
import GettingStartedItem, {
  GettingStartedItemProps,
} from '@app/components/GettingStartedItem'
import { useAuth } from '@app/context/auth'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import options from '@app/pages/GettingStarted/options'

type Props = {
  open: boolean
  onClose: () => void
}
export const GettingStartedModal = ({ open, onClose }: Props) => {
  const { t, _t } = useScopedTranslation('components.get-started-modal')
  const auth = useAuth()

  const [active, setActive] = useState<GettingStartedItemProps | null>()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <>
          <Typography variant="h4" fontWeight={600}>
            {active?.title || t('title')}
          </Typography>
          <Typography>
            {_t(`components.role-switcher.${auth.activeRole}`) ||
              auth.activeRole}
          </Typography>
        </>
      }
      minWidth={700}
      maxWidth={700}
    >
      {!active ? (
        <Grid container spacing={3}>
          {options.map(item => (
            <Grid item key={item.id} onClick={() => setActive(item)}>
              <GettingStartedItem {...item} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box display="flex" flexDirection="column">
          <video src={active.video} width="100%" controls autoPlay></video>

          <Button
            sx={{ alignSelf: 'flex-end', mt: 4 }}
            variant="contained"
            size="small"
            onClick={() => setActive(null)}
          >
            {_t('back')}
          </Button>
        </Box>
      )}
    </Dialog>
  )
}
