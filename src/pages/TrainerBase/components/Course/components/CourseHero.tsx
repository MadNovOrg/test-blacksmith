import React from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { Course } from '@app/types'
import { formatDateWithTime } from '@app/util'

type CourseHeroProps = {
  data: Course
  className?: string
}

export const CourseHero: React.FC<CourseHeroProps> = ({ data, className }) => {
  const { t } = useTranslation()

  let courseStartDate = ''
  let courseEndDate = ''
  let location = ''
  if (data.schedule && data.schedule.length > 0) {
    courseStartDate = formatDateWithTime(data.schedule[0].start)
    courseEndDate = formatDateWithTime(
      data.schedule[data.schedule.length - 1].end
    )
    if (data.schedule[0].venue) {
      const venue = data.schedule[0].venue
      location = [venue.name, venue.address?.city].join(', ')
    }
  }

  return (
    <div className={clsx(className, 'flex flex-col text-sm')}>
      <p>
        <b>{t('pages.trainer-base.create-course.new-course.location')}: </b>
        {location}
      </p>
      <p>
        <b>{t('pages.trainer-base.create-course.new-course.starts')}: </b>
        {courseStartDate}
      </p>
      <p>
        <b>{t('pages.trainer-base.create-course.new-course.ends')}: </b>
        {courseEndDate}
      </p>
      <p>
        <b>{t('pages.trainer-base.create-course.new-course.course-type')}: </b>
        {data.deliveryType &&
          t(`common.course.delivery-type.${data.deliveryType}`)}
      </p>
    </div>
  )
}
