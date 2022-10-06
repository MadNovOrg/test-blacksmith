import PinDropIcon from '@mui/icons-material/PinDrop'
import TodayIcon from '@mui/icons-material/Today'
import {
  Alert,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  styled,
  Stack,
  CircularProgress,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { AppLayoutMinimal } from '@app/components/AppLayoutMinimal'
import { LinkBehavior } from '@app/components/LinkBehavior'
import useCourse from '@app/hooks/useCourse'
import {
  getCourseDurationMessage,
  getTimeDifferenceAndContext,
  LoadingStatus,
} from '@app/util'

import { Form } from './components/Form'

const StyledListIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '32px',
  color: theme.palette.secondary.main,
}))

const StyledMailToLink = styled('a')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.primary.main,
  '&:hover': {
    textDecoration: 'underline',
  },
}))

const VenueAddressField: React.FC<{ field: string }> = ({ field }) => (
  <ListItem disableGutters disablePadding>
    <ListItemText sx={{ paddingLeft: 4 }}>
      {' '}
      <Typography variant="body2">{field}</Typography>
    </ListItemText>
  </ListItem>
)

export const CourseWaitlist: React.FC = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const [courseDurationMessage, setCourseDurationMessage] = useState('')
  const courseId = searchParams.get('course_id')

  const { data: course, status: courseLoadingStatus } = useCourse(
    courseId ?? ''
  )

  useEffect(() => {
    if (course) {
      const duration = getTimeDifferenceAndContext(
        new Date(course.schedule[0].end),
        new Date(course.schedule[0].start)
      )
      setCourseDurationMessage(getCourseDurationMessage(duration, t))
    }
  }, [course, t])

  if (email) {
    return (
      <AppLayoutMinimal width={628}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Alert
            variant="outlined"
            color="success"
            sx={{ mb: 3 }}
            data-testid="success-alert"
          >
            {t('waitlist-added')}
          </Alert>

          <Typography
            variant="subtitle1"
            fontWeight="500"
            mb={2}
            textAlign="center"
          >
            {t('confirmation-email-sent', { email })}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            component={LinkBehavior}
            href="/"
          >
            {t('goto-tt')}
          </Button>
        </Box>
      </AppLayoutMinimal>
    )
  }

  return (
    <AppLayoutMinimal
      width={628}
      contentBoxStyles={{ p: 3 }}
      footer={
        <Box mt={4}>
          <StyledMailToLink
            href={`mailto:${import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS}`}
            target="_blank"
            rel="noopener"
          >
            {t('need-help')}? {t('contact-us')}
          </StyledMailToLink>
        </Box>
      }
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography
          variant="h3"
          fontWeight="600"
          color="secondary"
          gutterBottom
        >
          {t('join-waitlist-title')}
        </Typography>
        <Typography variant="body1" textAlign="center" color="grey.700" mb={4}>
          {t('join-waitlist-notice')}
        </Typography>
      </Box>
      {course ? (
        <>
          {courseLoadingStatus === LoadingStatus.FETCHING ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              data-testid="course-fetching"
            >
              <CircularProgress />
            </Stack>
          ) : (
            <>
              <Typography variant="body1" fontWeight={600} pb={2}>
                {course.name}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List dense disablePadding>
                    <ListItem disableGutters disablePadding>
                      <StyledListIcon>
                        <TodayIcon />
                      </StyledListIcon>
                      <ListItemText>
                        {t('pages.course-participants.course-beggins')}{' '}
                        <Typography
                          component="span"
                          variant="body2"
                          fontWeight={600}
                        >
                          {t('dates.withTime', {
                            date: course.schedule[0].start,
                          })}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                    <ListItem disableGutters disablePadding>
                      <ListItemText sx={{ paddingLeft: 4 }}>
                        {t('pages.course-participants.course-ends')}{' '}
                        <Typography
                          component="span"
                          variant="body2"
                          fontWeight={600}
                        >
                          {t('dates.withTime', {
                            date: course.schedule[0].end,
                          })}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                    <ListItem disableGutters disablePadding>
                      <ListItemText sx={{ paddingLeft: 4 }}>
                        <Typography variant="body2">
                          {courseDurationMessage}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List dense disablePadding>
                    <ListItem disableGutters disablePadding>
                      <StyledListIcon>
                        <PinDropIcon />
                      </StyledListIcon>
                      {course.schedule[0].venue?.name && (
                        <ListItemText>
                          {' '}
                          <Typography
                            component="span"
                            variant="body2"
                            fontWeight={600}
                          >
                            {course.schedule[0].venue?.name}
                          </Typography>
                        </ListItemText>
                      )}
                    </ListItem>
                    {course.schedule[0].venue?.addressLineOne && (
                      <VenueAddressField
                        field={course.schedule[0].venue?.addressLineOne}
                      />
                    )}
                    {course.schedule[0].venue?.addressLineTwo && (
                      <VenueAddressField
                        field={course.schedule[0].venue?.addressLineTwo}
                      />
                    )}
                    {course.schedule[0].venue?.city && (
                      <VenueAddressField
                        field={`${course.schedule[0].venue?.city}${
                          course.schedule[0].venue?.postCode
                            ? ', ' + course.schedule[0].venue.postCode
                            : ''
                        }`}
                      />
                    )}
                  </List>
                </Grid>
              </Grid>
            </>
          )}
        </>
      ) : null}
      {courseId ? <Form onSuccess={setEmail} courseId={+courseId} /> : null}
    </AppLayoutMinimal>
  )
}
