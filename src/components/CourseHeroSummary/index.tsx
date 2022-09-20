import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PinDropIcon from '@mui/icons-material/PinDrop'
import TodayIcon from '@mui/icons-material/Today'
import VideocamIcon from '@mui/icons-material/Videocam'
import {
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { differenceInCalendarDays } from 'date-fns'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import theme from '@app/theme'
import { Course } from '@app/types'
import {
  courseEnded,
  courseStarted,
  getCourseTrainer,
  getTimeDifferenceAndContext,
  now,
} from '@app/util'

interface Props {
  course: Course
  renderButton?: () => React.ReactNode
}

export const CourseHeroSummary: React.FC<Props> = ({
  course,
  children,
  renderButton,
}) => {
  const { profile } = useAuth()
  const { t } = useTranslation()

  const courseTrainer = useMemo(
    () => getCourseTrainer(course.trainers ?? []),
    [course]
  )
  const courseStartDate = new Date(course.schedule[0].start)
  const courseEndDate = new Date(course.schedule[0].end)
  const courseBeginsFor = courseStarted(course)
    ? 0
    : differenceInCalendarDays(new Date(), new Date(courseStartDate))

  let courseBeginsForMessage

  if (courseEnded(course)) {
    courseBeginsForMessage = t('pages.course-participants.course-ended')
  } else if (courseStarted(course)) {
    courseBeginsForMessage = t('pages.course-participants.course-began')
  } else if (courseBeginsFor === 0) {
    courseBeginsForMessage = t('pages.course-participants.course-begins-today')
  } else if (courseBeginsFor === -1) {
    courseBeginsForMessage = t(
      'pages.course-participants.until-course-begins_days_one'
    )
  } else {
    courseBeginsForMessage = t(
      'pages.course-participants.until-course-begins_days_other',
      {
        count: differenceInCalendarDays(
          new Date(course.schedule[0].start),
          now()
        ),
      }
    )
  }

  const courseDuration = getTimeDifferenceAndContext(
    courseEndDate,
    courseStartDate
  )
  const { context: durationContext, count: durationCount } = courseDuration

  let courseDurationMessage
  if (durationContext == 'days' && durationCount === 1) {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_days_one'
    )
  } else if (durationContext == 'days') {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_days_other',
      { count: durationCount }
    )
  } else if (durationContext == 'hours' && durationCount === 1) {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_hours_one',
      { count: durationCount }
    )
  } else if (durationContext == 'hours') {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_hours_other',
      { count: durationCount }
    )
  } else if (durationContext == 'minutes') {
    courseDurationMessage = t(
      'pages.course-participants.course-duration_minutes_other',
      { count: durationCount }
    )
  } else {
    courseDurationMessage = t('pages.course-participants.course-duration_none')
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[100],
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={6} md={4}>
            {children}
            <Typography
              variant="h3"
              marginBottom={3}
              fontWeight={600}
              data-testid="course-name"
            >
              {course.name}
            </Typography>
            {typeof renderButton === 'function' && renderButton()}
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography
              fontWeight={500}
              fontSize="0.9rem"
              sx={{
                backgroundColor: theme.palette.grey[300],
                borderRadius: 1,
                paddingLeft: 1,
                paddingRight: 1,
                marginBottom: 1,
                display: 'inline-block',
              }}
            >
              {courseBeginsForMessage}
            </Typography>

            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <ListItemIcon>
                  <TodayIcon />
                </ListItemIcon>
                <ListItemText>
                  {t('pages.course-participants.course-beggins')}{' '}
                  <Typography component="span" fontWeight={500}>
                    {t('dates.withTime', { date: course.schedule[0].start })}
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <ListItemText inset>
                  {t('pages.course-participants.course-ends')}{' '}
                  <Typography component="span" fontWeight={500}>
                    {t('dates.withTime', { date: course.schedule[0].end })}
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <ListItemText inset>
                  <Typography variant="body2">
                    {courseDurationMessage}
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={6} md={4}>
            <List dense disablePadding>
              {courseTrainer?.profile ? (
                <ListItem>
                  <ListItemIcon>
                    <PersonOutlineIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {courseTrainer.profile.id === profile?.id
                      ? t('pages.course-participants.trainer')
                      : t('pages.course-participants.hosted-by', {
                          trainer: `${courseTrainer.profile.fullName}`,
                        })}
                  </ListItemText>
                </ListItem>
              ) : null}

              <ListItem>
                <ListItemIcon>
                  <PinDropIcon />
                </ListItemIcon>
                <ListItemText>
                  {[
                    course.schedule[0].venue?.name,
                    course.schedule[0].venue?.city,
                  ].join(', ')}
                </ListItemText>
              </ListItem>
              {course.schedule[0].virtualLink ? (
                <ListItem>
                  <ListItemIcon>
                    <VideocamIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Button
                      href={course.schedule[0].virtualLink}
                      component="a"
                      target="_blank"
                    >
                      {t('common.join-zoom')}
                    </Button>
                  </ListItemText>
                </ListItem>
              ) : null}
            </List>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
