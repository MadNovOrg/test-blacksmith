import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useAuth } from '@app/context/auth'
import useCourseDraft from '@app/hooks/useCourseDraft'
import {
  CourseType,
  Draft,
  ExpensesInput,
  TrainerInput,
  ValidCourseInput,
} from '@app/types'

import { StepsEnum } from '../../types'

import { getCourseType } from './helpers'

export { getCourseType }

type ContextValue = {
  completeStep: (step: StepsEnum) => void
  completedSteps: StepsEnum[]
  courseData?: ValidCourseInput
  courseType: CourseType
  currentStepKey: StepsEnum | null
  expenses: Record<string, ExpensesInput>
  saveDraft: () => Promise<void>
  setCourseData: (courseData: ValidCourseInput) => void
  setCurrentStepKey: (step: StepsEnum) => void
  setExpenses: (expenses: Record<string, ExpensesInput>) => void
  setTrainers: (trainers: TrainerInput[]) => void
  trainers: TrainerInput[]
}

const CreateCourseContext = React.createContext<ContextValue | undefined>(
  undefined
)

export type CreateCourseProviderProps = {
  initialValue?: Draft
  courseType: CourseType
}

export const CreateCourseProvider: React.FC<CreateCourseProviderProps> = ({
  children,
  initialValue,
  courseType,
}) => {
  const { profile } = useAuth()
  const { removeDraft, setDraft } = useCourseDraft(
    profile?.id ?? '',
    courseType
  )

  const [courseData, setCourseData] = useState<ValidCourseInput | undefined>(
    initialValue?.courseData
  )
  const [trainers, setTrainers] = useState<TrainerInput[]>(
    initialValue?.trainers ?? []
  )
  const [expenses, setExpenses] = useState<Record<string, ExpensesInput>>(
    initialValue?.expenses ?? {}
  )
  const [completedSteps, setCompletedSteps] = useState<StepsEnum[]>(
    initialValue?.completedSteps ?? []
  )
  const [currentStepKey, setCurrentStepKey] = useState<StepsEnum | null>(
    initialValue?.currentStepKey ?? null
  )

  useEffect(() => {
    if (!profile?.id) {
      return
    }

    removeDraft()
  }, [courseType, profile, removeDraft])

  const completeStep = useCallback(
    (step: StepsEnum) => {
      if (!completedSteps.includes(step)) {
        setCompletedSteps([...(completedSteps ?? []), step])
      }
    },
    [completedSteps, setCompletedSteps]
  )

  const saveDraft = useCallback(async () => {
    if (!profile?.id) {
      return
    }

    const draft: Draft = {
      courseData,
      trainers,
      expenses,
      currentStepKey,
      completedSteps,
    }

    await setDraft(draft)
  }, [
    completedSteps,
    courseData,
    currentStepKey,
    expenses,
    profile,
    setDraft,
    trainers,
  ])

  const value = useMemo(() => {
    return {
      completeStep,
      completedSteps,
      courseData,
      courseType,
      currentStepKey,
      expenses,
      saveDraft,
      setCourseData,
      setCurrentStepKey,
      setExpenses,
      setTrainers,
      trainers,
    }
  }, [
    completeStep,
    completedSteps,
    courseData,
    courseType,
    currentStepKey,
    expenses,
    saveDraft,
    setCourseData,
    setCurrentStepKey,
    setExpenses,
    setTrainers,
    trainers,
  ])

  return (
    <CreateCourseContext.Provider value={value}>
      {children}
    </CreateCourseContext.Provider>
  )
}

export function useCreateCourse() {
  const context = useContext(CreateCourseContext)

  if (context === undefined) {
    throw new Error(
      'useCreateCourse must be used within a CreateCourseProvider'
    )
  }

  return context
}
