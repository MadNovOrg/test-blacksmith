import { CircularProgress, Container, Stack } from '@mui/material'
import React from 'react'

import { useAuth } from '@app/context/auth'
import { useTableSort } from '@app/hooks/useTableSort'
import { CertificationList } from '@app/modules/certifications/components/CertificationList'
import useCourseParticipants from '@app/modules/course_details/hooks/course-participant/useCourseParticipants'
import { Course } from '@app/types'
import { LoadingStatus } from '@app/util'

type CourseCertificationsProps = {
  course: Course
}

export const CourseCertifications: React.FC<
  React.PropsWithChildren<CourseCertificationsProps>
> = ({ course }) => {
  const { acl, profile } = useAuth()
  const sorting = useTableSort('name', 'asc')

  const { data: certifiedParticipants, status } = useCourseParticipants(
    course?.id ?? '',
    {
      sortBy: sorting.by,
      order: sorting.dir,
      where: {
        ...(acl.isOneOfBookingContactsOfTheOpenCourse(course)
          ? { order: { bookingContactProfileId: { _eq: profile?.id } } }
          : {}),
        certificate: {
          id: { _is_null: false },
          participant: { completed_evaluation: { _eq: true } },
        },
      },
    },
  )

  return (
    <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
      {status === LoadingStatus.FETCHING ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="course-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : (
        <CertificationList
          participants={certifiedParticipants ?? []}
          sorting={sorting}
        />
      )}
    </Container>
  )
}
