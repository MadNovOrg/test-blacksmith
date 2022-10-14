import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { Course, Course_Participant, Profile } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { useTransferDetails } from '../../hooks/useTransferDetails'
import { EligibleCourse, FeeType, TransferStepsEnum } from '../../types'

export type FromCourse = Pick<
  Course,
  'id' | 'type' | 'status' | 'level' | 'course_code'
> & {
  start?: string | null
  end?: string | null
}

export type ChosenParticipant = Pick<Course_Participant, 'id'> & {
  profile: Pick<Profile, 'fullName' | 'avatar'>
}

export enum TransferModeEnum {
  ADMIN_TRANSFERS = 'ADMIN_TRANSFERS',
  ORG_ADMIN_TRANSFERS = 'ORG_ADMIN_TRANSFERS',
  ATTENDEE_TRANSFERS = 'ATTENDEE_TRANSFERS',
}

export type ContextValue = {
  participant?: ChosenParticipant
  fromCourse?: FromCourse
  toCourse?: EligibleCourse
  fees?: {
    type?: FeeType
    customFee?: number | null
  }
  completedSteps: TransferStepsEnum[]
  completeStep: (step: TransferStepsEnum) => void
  currentStepKey: TransferStepsEnum
  courseChosen: (course: EligibleCourse) => void
  feesChosen: (type?: FeeType, customFee?: number | null) => void
  backFrom: (step: TransferStepsEnum) => void
  mode: TransferModeEnum
  cancel: () => void
}

export const TransferParticipantContext = React.createContext<
  ContextValue | undefined
>(undefined)

type Props = {
  courseId: Course['id']
  participantId: Course_Participant['id']
  initialValue?: Partial<Omit<ContextValue, 'courseChosen'>>
  mode?: ContextValue['mode']
}

export const TransferParticipantProvider: React.FC<Props> = ({
  children,
  initialValue,
  courseId,
  participantId,
  mode = TransferModeEnum.ADMIN_TRANSFERS,
}) => {
  const [participant, setParticipant] = useState<ContextValue['participant']>(
    initialValue?.participant
  )
  const [fromCourse, setFromCourse] = useState<ContextValue['fromCourse']>(
    initialValue?.fromCourse
  )
  const [toCourse, setToCourse] = useState<ContextValue['toCourse']>(
    initialValue?.toCourse
  )
  const [fees, setFees] = useState<ContextValue['fees']>(() =>
    mode === TransferModeEnum.ADMIN_TRANSFERS
      ? initialValue?.fees
      : { type: FeeType.APPLY_TERMS }
  )
  const [completedSteps, setCompletedSteps] = useState<
    ContextValue['completedSteps']
  >(initialValue?.completedSteps ?? [])
  const [currentStepKey, setCurrentStepKey] = useState<TransferStepsEnum>(
    initialValue?.currentStepKey ?? TransferStepsEnum.SELECT_COURSE
  )

  const { t } = useScopedTranslation('pages.transfer-participant')

  const {
    course,
    participant: fetchedParticipant,
    fetching,
    error,
  } = useTransferDetails(courseId, participantId)

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

  const completeStep: ContextValue['completeStep'] = useCallback(
    step => {
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
          const previousPath =
            mode === TransferModeEnum.ATTENDEE_TRANSFERS
              ? `../transfer`
              : `../transfer/${participantId}/details`

          setCurrentStepKey(TransferStepsEnum.TRANSFER_DETAILS)
          navigate(previousPath)

          break
        }

        default: {
          break
        }
      }
    },
    [navigate, participantId, mode]
  )

  const courseChosen: ContextValue['courseChosen'] = useCallback(
    course => {
      setToCourse(course)
      completeStep(TransferStepsEnum.SELECT_COURSE)

      const nextStep =
        mode === TransferModeEnum.ATTENDEE_TRANSFERS ? './review' : './details'
      const nextStepKey =
        mode === TransferModeEnum.ATTENDEE_TRANSFERS
          ? TransferStepsEnum.REVIEW
          : TransferStepsEnum.TRANSFER_DETAILS

      navigate(nextStep)
      setCurrentStepKey(nextStepKey)
    },
    [completeStep, navigate, mode]
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

  const cancel: ContextValue['cancel'] = useCallback(() => {
    navigate(`/courses/${fromCourse?.id}/details`)
  }, [navigate, fromCourse])

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
      mode,
      cancel,
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
      mode,
      cancel,
    ]
  )

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    )
  }

  if (!fetching && (!fromCourse || !participant)) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 5 }}>
          {t('no-data-error')}
        </Alert>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 5 }}>
          {t('generic-error')}
        </Alert>
      </Container>
    )
  }

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
