import PinDropIcon from '@mui/icons-material/PinDrop'
import TodayIcon from '@mui/icons-material/Today'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { WaitlistCourseQuery } from '@app/generated/graphql'
import {
  getCourseDurationMessage,
  getTimeDifferenceAndContext,
} from '@app/util'

const StyledListIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '32px',
  color: theme.palette.secondary.main,
}))

const VenueAddressField: React.FC<
  React.PropsWithChildren<{ field: string }>
> = ({ field }) => (
  <ListItem disableGutters disablePadding>
    <ListItemText sx={{ paddingLeft: 4 }}>
      {' '}
      <Typography variant="body2">{field}</Typography>
    </ListItemText>
  </ListItem>
)
2
type Props = {
  course: WaitlistCourseQuery['courses'][0]
}

export const CourseInfo: React.FC<React.PropsWithChildren<Props>> = ({
  course,
}) => {
  const { t } = useTranslation()

  if (!course) {
    return null
  }

  const courseDurationMessage = course
    ? getCourseDurationMessage(
        getTimeDifferenceAndContext(
          new Date(course.schedule[0].end),
          new Date(course.schedule[0].start)
        ),
        t
      )
    : ''

  return (
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
                <Typography component="span" variant="body2" fontWeight={600}>
                  {t('dates.withTime', {
                    date: course.schedule[0].start,
                  })}
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText sx={{ paddingLeft: 4 }}>
                {t('pages.course-participants.course-ends')}{' '}
                <Typography component="span" variant="body2" fontWeight={600}>
                  {t('dates.withTime', {
                    date: course.schedule[0].end,
                  })}
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText sx={{ paddingLeft: 4 }}>
                <Typography variant="body2">{courseDurationMessage}</Typography>
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
                  <Typography component="span" variant="body2" fontWeight={600}>
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
  )
}

export const CourseInfoSkeleton = () => (
  <>
    <Skeleton
      width="50%"
      sx={{ marginBottom: 2 }}
      data-testid="course-info-skeleton"
    />
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Grid>
    </Grid>
  </>
)
