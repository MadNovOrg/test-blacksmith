import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { Avatar } from '@app/components/Avatar'
import { BackButton } from '@app/components/BackButton'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Sticky } from '@app/components/Sticky'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import {
  TransferModeEnum,
  useTransferParticipantContext,
} from './components/TransferParticipantProvider'
import { TransferParticipantSteps } from './components/TransferParticipantSteps'

export const TransferParticipant: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useScopedTranslation('pages.transfer-participant')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { participant, completedSteps, currentStepKey, mode } =
    useTransferParticipantContext()

  const attendeeTranfserring = mode === TransferModeEnum.ATTENDEE_TRANSFERS

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
          <Box width={400} display="flex" flexDirection="column" pr={4}>
            <Sticky top={20}>
              {!attendeeTranfserring ? (
                <Box mb={2}>
                  <BackButton
                    label={t('back-btn-text')}
                    to={'../details'}
                    replace
                  />
                </Box>
              ) : null}

              <Box mb={5}>
                <Typography variant="h2" mb={2}>
                  {t(`title-${mode}`)}
                </Typography>
              </Box>

              {!attendeeTranfserring ? (
                <Box mb={4}>
                  <Typography
                    color={theme.palette.grey[700]}
                    fontWeight={600}
                    mb={1}
                  >
                    {t('attendee-label')}
                  </Typography>

                  <List>
                    <ListItem disableGutters>
                      <ListItemAvatar>
                        <Avatar
                          src={participant?.profile.avatar ?? undefined}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${participant?.profile.fullName}`}
                      />
                    </ListItem>
                  </List>
                </Box>
              ) : null}

              <TransferParticipantSteps
                completedSteps={completedSteps}
                currentStepKey={currentStepKey}
                mode={mode}
              />
            </Sticky>
          </Box>

          <Box flex={1}>
            <Box mt={8}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Container>
    </FullHeightPage>
  )
}
