import React, { useCallback, useContext, useMemo, useState } from 'react'

import { useAuth } from '@app/context/auth'
import { useCourseDraft } from '@app/hooks/useCourseDraft'
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
  setGo1Licensing: (go1Licensing: Draft['go1Licensing']) => void
  go1Licensing: Draft['go1Licensing']
}

const CreateCourseContext = React.createContext<ContextValue | undefined>(
  undefined
)

export type CreateCourseProviderProps = {
  initialValue?: Draft
  courseType: CourseType
}

export const CreateCourseProvider: React.FC<
  React.PropsWithChildren<CreateCourseProviderProps>
> = ({ children, initialValue, courseType }) => {
  const { profile } = useAuth()
  const { setDraft } = useCourseDraft(profile?.id ?? '', courseType)

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
  const [go1Licensing, setGo1Licensing] = useState<Draft['go1Licensing']>(
    initialValue?.go1Licensing ?? undefined
  )

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
      go1Licensing,
    }

    setDraft(draft)
  }, [
    completedSteps,
    courseData,
    currentStepKey,
    expenses,
    profile,
    setDraft,
    trainers,
    go1Licensing,
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
      go1Licensing,
      setGo1Licensing,
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
    go1Licensing,
    setGo1Licensing,
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
