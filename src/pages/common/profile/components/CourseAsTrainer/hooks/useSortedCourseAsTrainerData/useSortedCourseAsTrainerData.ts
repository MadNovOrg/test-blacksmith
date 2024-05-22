import { GetProfileDetailsQuery } from '@app/generated/graphql'

import { useSortAscDesc } from '../../../Hooks/useSortAscDesc'

interface Props {
  profile: GetProfileDetailsQuery['profile']
}

export const useSortedCourseAsTrainerData = ({ profile }: Props) => {
  const { sortOrder, handleSortToggle } = useSortAscDesc()

  const sortedCourses = [...(profile?.courseAsTrainer ?? [])].sort((a, b) => {
    const aDate = new Date(a.course.dates.aggregate?.start?.date ?? '')
    const bDate = new Date(b.course.dates.aggregate?.start?.date ?? '')

    return sortOrder === 'asc'
      ? aDate.getTime() - bDate.getTime()
      : bDate.getTime() - aDate.getTime()
  })

  return { sortOrder, handleSortToggle, sortedCourses }
}
