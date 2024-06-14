import { GetProfileDetailsQuery } from '@app/generated/graphql'

import { useSortAscDesc } from '../useSortAscDesc'

interface Props {
  profile: GetProfileDetailsQuery['profile']
}

export const useSortedCoursesTableData = ({ profile }: Props) => {
  const { sortOrder, handleSortToggle } = useSortAscDesc()

  const mergedData = [
    ...(profile?.courses ?? []),
    ...(profile?.participantAudits ?? []),
  ]

  // since CourseTable is showing 2 different data types (course_participant and course_participant_audit)
  // we need those ugly if / else to pick the correct date field for sorting
  const sortedData = [...mergedData].sort((a, b) => {
    if (!a.__typename || !b.__typename) return 0

    let targetA: string | undefined
    let targetB: string | undefined

    if (a.__typename === 'course_participant') {
      targetA = a.course.start ?? ''
    } else if (a.__typename === 'course_participant_audit') {
      targetA = a.course.dates?.aggregate?.start?.date ?? ''
    } else {
      targetA = undefined
    }

    if (b.__typename === 'course_participant') {
      targetB = b.course.start ?? ''
    } else if (b.__typename === 'course_participant_audit') {
      targetB = b.course.dates?.aggregate?.start?.date ?? ''
    } else {
      targetB = undefined
    }

    if (!targetA || !targetB) return 0

    const timeDifference =
      new Date(targetA).getTime() - new Date(targetB).getTime()

    return sortOrder === 'asc' ? timeDifference : -timeDifference
  })

  return { sortOrder, handleSortToggle, sortedData }
}
