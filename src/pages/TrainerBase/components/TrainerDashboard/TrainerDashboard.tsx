import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import SchoolIcon from '@mui/icons-material/School'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import { Box, Container, Grid, Typography } from '@mui/material'
import Link from '@mui/material/Link'
import React from 'react'
import { Link as RRLink, useNavigate } from 'react-router-dom'

import { DashboardCard } from './components/DashboardCard'

type TrainerDashboardProps = unknown

export const TrainerDashboard: React.FC<TrainerDashboardProps> = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Trainer Base
        </Typography>
        <Typography variant="body2">&nbsp;</Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DashboardCard
              title="My Calendar"
              icon={<CalendarTodayIcon fontSize="inherit" />}
              onClick={() => navigate('management')}
            >
              <Typography variant="subtitle2">Next Event</Typography>
              <Typography variant="h6" gutterBottom>
                3rd-4th May 2022
              </Typography>
              <Typography variant="body2">
                Birchwood Academy, Wrotham, Kent Positive Behaviour Training:
                Level Two 14 Attendees
              </Typography>
            </DashboardCard>
          </Grid>

          <Grid item xs={6}>
            <DashboardCard
              title="Create a Course"
              icon={<CollectionsBookmarkIcon fontSize="inherit" />}
              onClick={() => navigate('course')}
            >
              <Box display="flex" flexDirection="column" color="white">
                <Link component={RRLink} to="course" gutterBottom>
                  Create a new course
                </Link>
                <Link component={RRLink} to="course/history" gutterBottom>
                  Select from your previous courses
                </Link>
                <Link component={RRLink} to="course/templates" gutterBottom>
                  Select a Team Teach template
                </Link>
                <Link component={RRLink} to="" gutterBottom>
                  Create an exception
                </Link>
              </Box>
            </DashboardCard>
          </Grid>

          <Grid item xs={6}>
            <DashboardCard
              title="Course Manager"
              icon={<SupervisorAccountIcon fontSize="inherit" />}
              onClick={() => console.log('TBD')}
            >
              <Typography variant="subtitle2">Next Event</Typography>
              <Typography variant="h6" gutterBottom>
                Registration in progress
              </Typography>
              <Typography variant="body2">
                Birchwood Academy, Wrotham, Kent Positive Behaviour Training:
                Level Two 14 Attendees
              </Typography>
            </DashboardCard>
          </Grid>

          <Grid item xs={6}>
            <DashboardCard
              title="Certification Centre"
              icon={<SchoolIcon fontSize="inherit" />}
              onClick={() => console.log('TBD')}
            >
              <Box display="flex" flexDirection="column" color="white">
                <Link component={RRLink} to="" gutterBottom>
                  Grade a course
                </Link>
                <Link component={RRLink} to="" gutterBottom>
                  View your certification history
                </Link>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
