import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import SchoolIcon from '@mui/icons-material/School'
import { Box, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { DashboardCard } from '@app/pages/TrainerBase/components/TrainerDashboard/components/DashboardCard'

type MyTrainingDashboardProps = unknown

export const MyTrainingDashboard: React.FC<MyTrainingDashboardProps> = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('pages.my-training.dashboard.title')}
        </Typography>
        <Typography variant="body2">&nbsp;</Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DashboardCard
              title={t('pages.my-training.dashboard.my-upcoming-training')}
              icon={<CalendarTodayIcon fontSize="inherit" />}
              onClick={() => navigate('upcoming-training')}
            >
              <Typography variant="subtitle2">
                {t('pages.my-training.dashboard.next-course')}
              </Typography>
              <Typography variant="h6" gutterBottom>
                3rd-4th May 2022
              </Typography>
              <Typography variant="body2">
                Birchwood Academy, Wrotham, Kent
                <br />
                Positive Behaviour Training: Level Two
                <br />
                14 Attendees
              </Typography>
            </DashboardCard>
          </Grid>

          <Grid item xs={6}>
            <DashboardCard
              title={t(
                'pages.my-training.common.my-certification-and-credentials'
              )}
              icon={<SchoolIcon fontSize="inherit" />}
              onClick={() => navigate('certifications')}
            >
              <Typography variant="subtitle2">
                {t('pages.my-training.dashboard.latest-certification')}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Level One
              </Typography>
              <Typography variant="body2">
                Passed on 17/05/20
                <br />
                Six theory modules
                <br />
                Two physical modules
              </Typography>
            </DashboardCard>
          </Grid>

          <Grid item xs={6}>
            <DashboardCard
              title={t('pages.my-training.dashboard.my-resources')}
              icon={<LibraryBooksIcon fontSize="inherit" />}
              onClick={() => navigate('resources')}
            >
              <Typography variant="subtitle2">
                {t('pages.my-training.dashboard.latest-available')}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Level One Resource Kit
              </Typography>
              <Typography variant="body2">
                Latest government guidance
                <br />
                How-to videos
                <br />
                Useful contacts
              </Typography>
            </DashboardCard>
          </Grid>

          <Grid item xs={6}>
            <DashboardCard
              title={t('pages.my-training.dashboard.my-membership')}
              icon={<LightbulbOutlinedIcon fontSize="inherit" />}
              onClick={() => navigate('membership')}
            >
              <Typography variant="subtitle2">
                {t('pages.my-training.dashboard.membership-status')}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Premium Subscriber
              </Typography>
              <Typography variant="body2">
                Annual subscription
                <br />
                Renewal on 21/07/22
              </Typography>
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
