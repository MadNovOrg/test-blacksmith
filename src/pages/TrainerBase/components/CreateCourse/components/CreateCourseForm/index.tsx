import { LoadingButton } from '@mui/lab'
import { Box } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  CourseForm,
  FormValues,
  ValidFormFiels,
} from '@app/components/CourseForm'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/courses/insert-course'
import { CourseType } from '@app/types'
import { generateCourseName, LoadingStatus } from '@app/util'

function assertCourseDataValid(
  data: FormValues,
  isValid: boolean
): asserts data is ValidFormFiels {
  if (!isValid) {
    throw new Error()
  }
}

export const CreateCourseForm = () => {
  const courseDataRef = useRef<FormValues>()
  const [courseDataValid, setCourseDataValid] = useState(false)
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [savingStatus, setSavingStatus] = useState(LoadingStatus.IDLE)
  const navigate = useNavigate()

  const saveCourse = async () => {
    try {
      const courseData = courseDataRef.current

      if (courseData) {
        assertCourseDataValid(courseData, courseDataValid)
        setSavingStatus(LoadingStatus.FETCHING)

        const response = await fetcher<ResponseType, ParamsType>(MUTATION, {
          course: {
            name: generateCourseName(
              {
                level: courseData.courseLevel,
                reaccreditation: courseData.reaccreditation,
              },
              t
            ),
            deliveryType: courseData.deliveryType,
            level: courseData.courseLevel,
            reaccreditation: courseData.reaccreditation,
            go1Integration: courseData.blendedLearning,
            min_participants: courseData.minParticipants,
            max_participants: courseData.maxParticipants,
            type: CourseType.OPEN,
            schedule: {
              data: [
                {
                  start: courseData.startDateTime,
                  end: courseData.endDateTime,
                  virtualLink: courseData.zoomMeetingUrl,
                  venue_id: courseData.venueId,
                  name: 'name', // @todo cleanup the data model for these two fields
                  type: 'PHYSICAL',
                },
              ],
            },
          },
        })

        if (response.insertCourse.inserted.length === 1) {
          setSavingStatus(LoadingStatus.SUCCESS)

          navigate(`../assign-trainers/${response.insertCourse.inserted[0].id}`)
        }
      }
    } catch (err) {
      console.log(err)
      setSavingStatus(LoadingStatus.ERROR)
    }
  }

  return (
    <Box paddingBottom={5}>
      <CourseForm
        onChange={(data, isValid) => {
          courseDataRef.current = data
          setCourseDataValid(isValid)
        }}
      />

      <Box display="flex" justifyContent="flex-end">
        <LoadingButton
          variant="contained"
          disabled={!courseDataValid}
          sx={{ marginTop: 4 }}
          onClick={saveCourse}
          loading={savingStatus === LoadingStatus.FETCHING}
        >
          {t('pages.create-course.next-page-button-text')}
        </LoadingButton>
      </Box>
    </Box>
  )
}
