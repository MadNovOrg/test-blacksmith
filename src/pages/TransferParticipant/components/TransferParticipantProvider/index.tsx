import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Course, Course_Participant, Profile } from '@app/generated/graphql'

import { useTransferDetails } from '../../hooks/useTransferDetails'
import { EligibleCourse, TransferStepsEnum } from '../../types'

export type FromCourse = Pick<Course, 'id' | 'type' | 'status' | 'level'> & {
  start?: string | null
  end?: string | null
}

type ContextValue = {
  participant?: Pick<Course_Participant, 'id'> & {
    profile: Pick<Profile, 'fullName' | 'avatar'>
  }
  fromCourse?: FromCourse
  toCourse?: EligibleCourse
  completedSteps: TransferStepsEnum[]
  currentStepKey: TransferStepsEnum
  courseChoosen: (course: EligibleCourse) => void
}

export const TransferParticipantContext = React.createContext<
  ContextValue | undefined
>(undefined)

export const TransferParticipantProvider: React.FC<{
  initialValue?: Partial<Omit<ContextValue, 'courseChoosen'>>
}> = ({ children, initialValue }) => {
  const [participant, setParticipant] = useState<ContextValue['participant']>(
    initialValue?.participant
  )
  const [fromCourse, setFromCourse] = useState<ContextValue['fromCourse']>(
    initialValue?.fromCourse
  )
  const [toCourse, setToCourse] = useState<ContextValue['toCourse']>(
    initialValue?.toCourse
  )
  const [completedSteps, setCompletedSteps] = useState<
    ContextValue['completedSteps']
  >(initialValue?.completedSteps ?? [])
  const [currentStepKey, setCurrentStepKey] = useState<TransferStepsEnum>(
    initialValue?.currentStepKey ?? TransferStepsEnum.SELECT_COURSE
  )

  const { id: courseId, participantId } = useParams() as {
    id: string
    participantId: string
  }

  const { course, participant: fetchedParticipant } = useTransferDetails(
    Number(courseId),
    participantId
  )

  const navigate = useNavigate()

  useEffect(() => {
    if (fetchedParticipant) {
      setParticipant(fetchedParticipant)
    }

    if (course) {
      setFromCourse({
        ...course,
        start: course.dates.aggregate?.start?.date,
        end: course.dates.aggregate?.end?.date,
      })
    }
  }, [course, fetchedParticipant])

  const completeStep = useCallback(
    (step: TransferStepsEnum) => {
      setCompletedSteps([...completedSteps, step])
    },
    [completedSteps]
  )

  const courseChoosen: ContextValue['courseChoosen'] = useCallback(
    course => {
      setToCourse(course)
      completeStep(TransferStepsEnum.SELECT_COURSE)
      navigate('./details')
      setCurrentStepKey(TransferStepsEnum.TRANSFER_DETAILS)
    },
    [completeStep, navigate]
  )

  const value = useMemo(
    () => ({
      participant,
      fromCourse,
      completeStep,
      completedSteps,
      currentStepKey,
      courseChoosen,
      toCourse,
    }),
    [
      participant,
      fromCourse,
      completedSteps,
      completeStep,
      currentStepKey,
      courseChoosen,
      toCourse,
    ]
  )

  return (
    <TransferParticipantContext.Provider value={value}>
      {children}
    </TransferParticipantContext.Provider>
  )
}

export function useTransferParticipantContext() {
  const context = useContext(TransferParticipantContext)

  if (context === undefined) {
    throw new Error(
      'useTransferParticipantContext must be used within a TransferParticipantContext'
    )
  }

  return context
}
