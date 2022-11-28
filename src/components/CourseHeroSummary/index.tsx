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
  styled,
  Typography,
} from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { useAuth } from '@app/context/auth'
import { Course_Status_Enum } from '@app/generated/graphql'
import theme from '@app/theme'
import { Course } from '@app/types'
import {
  getCourseBeginsForMessage,
  getCourseDurationMessage,
  getCourseTrainer,
  getTimeDifferenceAndContext,
} from '@app/util'

const StyledListIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '32px',
  color: theme.palette.secondary.main,
}))

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

  const courseBeginsForMessage = getCourseBeginsForMessage(course, t)

  const courseDuration = getTimeDifferenceAndContext(
    courseEndDate,
    courseStartDate
  )

  const courseDurationMessage = getCourseDurationMessage(courseDuration, t)

  const showStatus =
    course.status === Course_Status_Enum.Cancelled ||
    course.status === Course_Status_Enum.Declined

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
              marginTop={1}
              fontWeight={600}
              data-testid="course-name"
            >
              {course.name}
            </Typography>
            <Typography variant="body2" color="secondary">
              {course.course_code}
            </Typography>
            {showStatus ? (
              <Box mt={1}>
                <CourseStatusChip status={course.status} />
              </Box>
            ) : null}
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
                <StyledListIcon>
                  <TodayIcon />
                </StyledListIcon>
                <ListItemText>
                  {t('pages.course-participants.course-beggins')}{' '}
                  <Typography
                    component="span"
                    variant="body2"
                    fontWeight={600}
                    color="secondary"
                  >
                    {t('dates.withTime', { date: course.schedule[0].start })}
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
                    color="secondary"
                  >
                    {t('dates.withTime', { date: course.schedule[0].end })}
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
          <Grid item xs={6} md={4}>
            <List dense disablePadding>
              {courseTrainer?.profile ? (
                <ListItem>
                  <StyledListIcon>
                    <PersonOutlineIcon />
                  </StyledListIcon>
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
                <StyledListIcon>
                  <PinDropIcon />
                </StyledListIcon>
                <ListItemText>
                  {[
                    course.schedule[0].venue?.name,
                    course.schedule[0].venue?.city,
                  ].join(', ')}
                </ListItemText>
              </ListItem>
              {course.schedule[0].virtualLink ? (
                <ListItem>
                  <StyledListIcon>
                    <VideocamIcon />
                  </StyledListIcon>
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
