import { CircularProgress, Container, Stack } from '@mui/material'
import React from 'react'

import { CertificationList } from '@app/components/CertificationList'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useTableSort } from '@app/hooks/useTableSort'
import { Course } from '@app/types'
import { LoadingStatus } from '@app/util'

type CourseCertificationsProps = {
  course: Course
}

export const CourseCertifications: React.FC<
  React.PropsWithChildren<CourseCertificationsProps>
> = ({ course }) => {
  const sorting = useTableSort('name', 'asc')

  const { data: certifiedParticipants, status } = useCourseParticipants(
    course?.id ?? '',
    {
      sortBy: sorting.by,
      order: sorting.dir,
      where: {
        certificate: {
          id: { _is_null: false },
          participant: { completed_evaluation: { _eq: true } },
        },
      },
    }
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
