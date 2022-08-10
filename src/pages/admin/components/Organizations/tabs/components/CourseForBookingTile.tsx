import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { differenceInDays, format } from 'date-fns'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GetOrgCoursesQuery } from '@app/generated/graphql'

type CourseType = GetOrgCoursesQuery['courses'][0]

type CourseForBookingTileParams = {
  course: CourseType
}

export const CourseForBookingTile: React.FC<CourseForBookingTileParams> = ({
  course,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const dateLabel = useMemo(() => {
    const start = new Date(course.schedules[0].start)
    const end = new Date(course.schedules[0].end)
    const days = Math.abs(differenceInDays(start, end)) + 1
    return days === 1
      ? `${t('dates.short', {
          date: start,
        })} (${days} ${t('common.day')})`
      : `${t('dates.short', {
          date: start,
        })}-${t('dates.short', {
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

  return (
    <Box bgcolor="common.white" p={2} mt={2}>
      <Typography variant="body2" color="grey.900" fontWeight={600}>
        {dateLabel}
      </Typography>
      <Typography variant="body2" color="grey.600" mt={1}>
        {dateSecondLabel}
      </Typography>
      <Typography variant="h4" fontWeight={600} mt={1}>
        {t(`common.certificates.${course.level?.toLowerCase()}`)}
      </Typography>
      <Typography variant="body2" color="grey.600" mt={1}>
        {venue ? venue.city : t('common.online')}
      </Typography>

      <Box display="flex" alignItems="center" mt={2} gap={2}>
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
    </Box>
  )
}
