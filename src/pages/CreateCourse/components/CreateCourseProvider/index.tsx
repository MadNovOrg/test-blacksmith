import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useAuth } from '@app/context/auth'
import {
  CourseType,
  ExpensesInput,
  TrainerInput,
  ValidCourseInput,
} from '@app/types'

import { StepsEnum } from '../../types'

type Draft = {
  courseData?: ValidCourseInput
  trainers?: TrainerInput[]
  expenses?: Record<string, ExpensesInput>
  completedSteps?: StepsEnum[]
  currentStepKey?: StepsEnum | null
  savedAt?: Date
}

type ContextValue = {
  completeStep: (step: StepsEnum) => void
  completedSteps: StepsEnum[]
  courseData?: ValidCourseInput
  courseType: CourseType
  currentStepKey: StepsEnum | null
  expenses: Record<string, ExpensesInput>
  saveDraft: () => void
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

export const getCourseType = (
  profileId: string,
  queryType: string | null,
  isFirstPage = true
): CourseType => {
  if (queryType) {
    return queryType as CourseType
  }

  const lastCourseType = localStorage.getItem(
    `${profileId}-last-draft-course-type`
  )
  if (lastCourseType && !isFirstPage) {
    return lastCourseType as CourseType
  }

  return CourseType.OPEN
}

export const getItemId = (profileId: string, courseType: CourseType) =>
  `${profileId}-${courseType}`

export const getItem = (itemId: string): Draft => {
  try {
    return JSON.parse(localStorage.getItem(itemId) ?? '{}')
  } catch (_) {
    return {}
  }
}

export const removeItem = (itemId: string) => localStorage.removeItem(itemId)

export const setItem = (itemId: string, data: Draft) =>
  localStorage.setItem(itemId, JSON.stringify({ ...data, savedAt: new Date() }))

export const CreateCourseProvider: React.FC<CreateCourseProviderProps> = ({
  children,
  initialValue,
  courseType,
}) => {
  const { profile } = useAuth()

  const itemId = useMemo(
    () => getItemId(profile?.id ?? 'unknown', courseType),
    [courseType, profile]
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

  useEffect(() => removeItem(itemId), [itemId])

  const completeStep = useCallback(
    (step: StepsEnum) => {
      if (!completedSteps.includes(step)) {
        setCompletedSteps([...(completedSteps ?? []), step])
      }
    },
    [completedSteps, setCompletedSteps]
  )

  const saveDraft = useCallback(() => {
    const draft: Draft = {
      courseData,
      trainers,
      expenses,
      currentStepKey,
      completedSteps,
    }

    setItem(itemId, draft)
    localStorage.setItem(
      `${profile?.id ?? 'unknown'}-last-draft-course-type`,
      courseType
    )
  }, [
    completedSteps,
    courseData,
    courseType,
    currentStepKey,
    expenses,
    itemId,
    profile,
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
