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
import { EligibleCourse, FeeType, TransferStepsEnum } from '../../types'

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
  fees?: {
    type?: FeeType
    customFee?: number | null
  }
  completedSteps: TransferStepsEnum[]
  currentStepKey: TransferStepsEnum
  courseChosen: (course: EligibleCourse) => void
  feesChosen: (type?: FeeType, customFee?: number | null) => void
  backFrom: (step: TransferStepsEnum) => void
}

export const TransferParticipantContext = React.createContext<
  ContextValue | undefined
>(undefined)

export const TransferParticipantProvider: React.FC<{
  initialValue?: Partial<Omit<ContextValue, 'courseChosen'>>
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
  const [fees, setFees] = useState<ContextValue['fees']>(initialValue?.fees)
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
    if (!fromCourse) {
      navigate(`../transfer/${participantId}`)
    }
  }, [fromCourse, navigate, participantId])

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

  const backFrom = useCallback(
    (step: TransferStepsEnum) => {
      switch (step) {
        case TransferStepsEnum.TRANSFER_DETAILS: {
          setCurrentStepKey(TransferStepsEnum.SELECT_COURSE)
          navigate(`../transfer/${participantId}`)

          break
        }

        case TransferStepsEnum.REVIEW: {
          setCurrentStepKey(TransferStepsEnum.TRANSFER_DETAILS)
          navigate(`../transfer/${participantId}/details`)

          break
        }

        default: {
          break
        }
      }
    },
    [navigate, participantId]
  )

  const courseChosen: ContextValue['courseChosen'] = useCallback(
    course => {
      setToCourse(course)
      completeStep(TransferStepsEnum.SELECT_COURSE)
      navigate('./details')
      setCurrentStepKey(TransferStepsEnum.TRANSFER_DETAILS)
    },
    [completeStep, navigate]
  )

  const feesChosen: ContextValue['feesChosen'] = useCallback(
    (type, customFee) => {
      setFees({
        type,
        customFee,
      })

      completeStep(TransferStepsEnum.TRANSFER_DETAILS)
      setCurrentStepKey(TransferStepsEnum.REVIEW)
      navigate('./review')
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
      courseChosen,
      toCourse,
      backFrom,
      fees,
      feesChosen,
    }),
    [
      participant,
      fromCourse,
      completedSteps,
      completeStep,
      currentStepKey,
      courseChosen,
      toCourse,
      fees,
      feesChosen,
      backFrom,
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
