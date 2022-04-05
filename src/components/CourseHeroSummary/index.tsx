import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PinDropIcon from '@mui/icons-material/PinDrop'
import TodayIcon from '@mui/icons-material/Today'
import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { differenceInDays, format } from 'date-fns'
import { t } from 'i18next'
import React from 'react'

import { useAuth } from '@app/context/auth'
import theme from '@app/theme'
import { Course } from '@app/types'
import { courseEnded, courseStarted, now } from '@app/util'

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

  const courseBeginsFor = courseStarted(course)
    ? 0
    : differenceInDays(new Date(), new Date(course.schedule[0].start))

  let courseBeginsForMessage

  if (courseEnded(course)) {
    courseBeginsForMessage = t('pages.course-participants.course-ended')
  } else if (courseStarted(course)) {
    courseBeginsForMessage = t('pages.course-participants.course-began')
  } else if (courseBeginsFor === 0) {
    courseBeginsForMessage = t('pages.course-participants.course-begins-today')
  } else {
    courseBeginsForMessage = t(
      'pages.course-participants.until-course-begins',
      {
        count: differenceInDays(new Date(course.schedule[0].start), now()),
      }
    )
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
            <Typography variant="h3" marginBottom={3} fontWeight={600}>
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
                    {format(
                      new Date(course.schedule[0].start),
                      'd MMMM yyyy, HH:mma'
                    )}
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <ListItemText inset>
                  {t('pages.course-participants.course-ends')}{' '}
                  <Typography component="span" fontWeight={500}>
                    {format(
                      new Date(course.schedule[0].end),
                      'd MMMM yyyy, HH:mma'
                    )}
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <ListItemText inset>
                  <Typography variant="body2">
                    {t('pages.course-participants.course-duration', {
                      count: differenceInDays(
                        new Date(course.schedule[0].end),
                        new Date(course.schedule[0].start)
                      ),
                    })}
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={6} md={4}>
            <List dense disablePadding>
              {course.trainer ? (
                <ListItem>
                  <ListItemIcon>
                    <PersonOutlineIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {course.trainer.id === profile?.id
                      ? t('pages.course-participants.trainer')
                      : t('pages.course-participants.hosted-by', {
                          trainer: `${course.trainer.fullName}`,
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
            </List>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
