import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFetcher } from '@app/hooks/use-fetcher'
import {
  ResponseType,
  ParamsType,
  MUTATION,
} from '@app/queries/courses/insert-course'
import {
  CourseDeliveryType,
  CourseTrainerType,
  ValidCourseInput,
} from '@app/types'
import { generateCourseName, LoadingStatus } from '@app/util'

type TrainerInput = { profile_id: string; type: CourseTrainerType }

export function useSaveCourse(): {
  savingStatus: LoadingStatus
  saveCourse: (
    courseData: ValidCourseInput,
    trainers: Array<TrainerInput>
  ) => Promise<string | undefined>
} {
  const [savingStatus, setSavingStatus] = useState(LoadingStatus.IDLE)
  const fetcher = useFetcher()
  const { t } = useTranslation()

  const saveCourse = useCallback(
    async (courseData: ValidCourseInput, trainers: Array<TrainerInput>) => {
      try {
        if (courseData) {
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
              ...(courseData.minParticipants
                ? { min_participants: courseData.minParticipants }
                : null),
              max_participants: courseData.maxParticipants,
              type: courseData.type,
              ...(courseData.organizationId
                ? { organization_id: courseData.organizationId }
                : null),
              ...(courseData.contactProfile
                ? { contactProfileId: courseData.contactProfile.id }
                : null),
              ...(courseData.usesAOL
                ? { aolCostOfCourse: courseData.courseCost }
                : null),
              trainers: {
                data: trainers,
              },
              schedule: {
                data: [
                  {
                    start: courseData.startDateTime,
                    end: courseData.endDateTime,
                    virtualLink: [
                      CourseDeliveryType.VIRTUAL,
                      CourseDeliveryType.MIXED,
                    ].includes(courseData.deliveryType)
                      ? courseData.zoomMeetingUrl
                      : undefined,
                    venue_id: courseData.venue.id,
                    name: 'name', // @todo cleanup the data model for these two fields
                    type: 'PHYSICAL',
                  },
                ],
              },
            },
          })

          if (response.insertCourse.inserted.length === 1) {
            setSavingStatus(LoadingStatus.SUCCESS)

            const insertedId = response.insertCourse.inserted[0].id

            return insertedId
          }
        } else {
          setSavingStatus(LoadingStatus.ERROR)
        }
      } catch (err) {
        setSavingStatus(LoadingStatus.ERROR)
      }
    },
    [fetcher, t]
  )

  return {
    savingStatus,
    saveCourse,
  }
}
