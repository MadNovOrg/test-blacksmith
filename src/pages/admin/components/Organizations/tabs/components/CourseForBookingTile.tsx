import { Button, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { differenceInDays, format, formatDistanceToNowStrict } from 'date-fns'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GetOrgCoursesQuery } from '@app/generated/graphql'

type CourseType = GetOrgCoursesQuery['courses'][0]

type CourseForBookingTileParams = {
  course: CourseType
  variant?: 'default' | 'row'
  showDistance?: boolean
  distance?: number | null
}

export const CourseForBookingTile: React.FC<CourseForBookingTileParams> = ({
  course,
  variant = 'default',
  showDistance,
  distance,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isRow = variant === 'row'

  const dateLabel = useMemo(() => {
    const start = new Date(course.schedules[0].start)
    const end = new Date(course.schedules[0].end)
    const days = Math.abs(differenceInDays(start, end)) + 1
    return days === 1
      ? `${t('dates.defaultShort', {
          date: start,
        })} (${days} ${t('common.day')})`
      : `${t('dates.defaultShort', {
          date: start,
        })}-${t('dates.defaultShort', {
          date: end,
        })} (${days} ${t('common.days')})`
  }, [course, t])

  const venue = course.schedules[0].venue

  const dateSecondLabel = useMemo(() => {
    const start = new Date(course.schedules[0].start)
    const end = new Date(course.schedules[0].end)
    let weekDayPart = format(start, 'iii')
    if (differenceInDays(start, end) !== 0) {
      weekDayPart += `-${format(end, 'iii')}`
    }
    return `${weekDayPart} • ${format(start, 'p')}`
  }, [course])

  const distanceLabel = useMemo(() => {
    if (!course.schedules[0].start) return ''
    const d = new Date(course.schedules[0].start)
    if (differenceInDays(d, new Date()) === 0) {
      return t('common.today')
    }
    return t('common.in-n-days', {
      num: formatDistanceToNowStrict(d, { unit: 'day' }),
    })
  }, [course, t])

  const addressLabel = useMemo(() => {
    if (!venue) {
      return t('common.online')
    }
    if (isRow) {
      return [
        venue.name,
        [venue.addressLineTwo, venue.addressLineTwo, venue.city, venue.postCode]
          .filter(Boolean)
          .join(', '),
      ].join('\n')
    }
    return venue.city
  }, [isRow, t, venue])

  return (
    <Box bgcolor="common.white" p={2} mt={2}>
      <Grid container spacing={1}>
        <Grid item xs={isRow ? 4 : 12}>
          {isRow ? (
            <Typography
              variant="body1"
              color="grey.900"
              fontWeight={600}
              pb={1}
            >
              {distanceLabel}
            </Typography>
          ) : null}
          <Typography variant="body2" color="grey.900" fontWeight={600}>
            {dateLabel}
          </Typography>
          <Typography variant="body2" color="grey.600" mt={1}>
            {dateSecondLabel}
          </Typography>
        </Grid>

        <Grid item xs={isRow ? (showDistance ? 4 : 6) : 12}>
          <Typography variant={isRow ? 'body1' : 'h4'} fontWeight={600}>
            {t(`common.certificates.${course.level?.toLowerCase()}`)}
          </Typography>
          <Typography variant="body2" color="grey.600" mt={1}>
            {addressLabel}
          </Typography>
        </Grid>

        {showDistance ? (
          <Grid item xs={2} container alignItems="center">
            <Typography variant="body2" color="grey.600">
              {distance
                ? t('common.km-distance', { number: distance.toFixed(1) })
                : ''}
            </Typography>
          </Grid>
        ) : null}

        <Grid item xs={isRow ? 2 : 12} container alignItems="center">
          <Box
            display="flex"
            flexDirection={isRow ? 'column' : 'row'}
            alignItems="center"
            mt={isRow ? 0 : 2}
            gap={1}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(`/registration?course_id=${course.id}&quantity=1`)
              }
            >
              {t('common.book-now')}
            </Button>
            <Typography variant="caption" color="grey.900" fontWeight={600}>
              {t('common.spaces-left', {
                number:
                  course.max_participants -
                  (course.participantsCount?.aggregate?.count ?? 0),
              })}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
