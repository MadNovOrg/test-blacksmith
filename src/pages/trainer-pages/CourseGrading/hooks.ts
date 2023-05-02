import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useGradingParticipants<T extends { id: string }>(
  participants: T[]
): T[] {
  const [searchParams] = useSearchParams()

  const participantIds = useMemo(() => {
    return new Set(searchParams.get('participants')?.split(',') ?? [])
  }, [searchParams])

  const filteredCourseParticipants = useMemo(() => {
    if (!participantIds || !participantIds.size) {
      return participants
    }

    return participants?.filter(participant =>
      participantIds.has(participant.id)
    )
  }, [participants, participantIds])

  return filteredCourseParticipants
}
