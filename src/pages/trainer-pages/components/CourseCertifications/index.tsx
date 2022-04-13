import { CircularProgress, Container, Stack } from '@mui/material'
import React, { useCallback, useState } from 'react'

import { CertificationList } from '@app/components/CertificationList'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { Course, SortOrder } from '@app/types'
import { LoadingStatus } from '@app/util'

type CourseCertificationsProps = {
  course: Course
}

export const CourseCertifications: React.FC<CourseCertificationsProps> = ({
  course,
}) => {
  const [order, setOrder] = useState<SortOrder>('asc')
  const [sortColumn, setSortColumn] = useState<string>('name')
  const handleSortChange = useCallback(
    columnName => {
      if (sortColumn === columnName) {
        setOrder(prevState => (prevState === 'asc' ? 'desc' : 'asc'))
      } else {
        setOrder('asc')
        setSortColumn(columnName)
      }
    },
    [sortColumn]
  )

  const sortingOptions = {
    order,
    orderBy: sortColumn,
    onSort: handleSortChange,
  }

  const { data: certifiedParticipants, status } = useCourseParticipants(
    course?.id ?? '',
    {
      sortBy: 'name',
      order,
      where: {
        certificate: { id: { _is_null: false } },
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
          sortingOptions={sortingOptions}
        />
      )}
    </Container>
  )
}
