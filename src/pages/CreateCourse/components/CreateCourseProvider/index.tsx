import React, { useCallback, useContext, useMemo, useState } from 'react'

import { ExpensesInput, TrainerInput, ValidCourseInput } from '@app/types'

type ContextValue = {
  completeStep: (step: string) => void
  completedSteps?: string[]
  courseData?: ValidCourseInput
  expenses?: Record<string, ExpensesInput>
  storeCourseData: (courseData: ValidCourseInput) => void
  storeTrainers: (trainers: TrainerInput[]) => void
  storeExpenses: (expenses: Record<string, ExpensesInput>) => void
  trainers?: TrainerInput[]
}

const CreateCourseContext = React.createContext<ContextValue | undefined>(
  undefined
)

export type CreateCourseProviderProps = {
  initialValue?: {
    courseData?: ValidCourseInput
    trainers?: TrainerInput[]
    expenses?: Record<string, ExpensesInput>
    completedSteps?: string[]
  }
}

export const CreateCourseProvider: React.FC<CreateCourseProviderProps> = ({
  children,
  initialValue,
}) => {
  const [courseData, setCourseData] = useState<ValidCourseInput | undefined>(
    initialValue?.courseData
  )
  const [trainers, setTrainers] = useState<TrainerInput[] | undefined>(
    initialValue?.trainers
  )
  const [expenses, setExpenses] = useState<
    Record<string, ExpensesInput> | undefined
  >(initialValue?.expenses)
  const [completedSteps, setCompletedSteps] = useState<string[] | undefined>(
    initialValue?.completedSteps
  )

  const storeCourseData = useCallback(
    (courseInput: ValidCourseInput) => {
      setCourseData(courseInput)
    },
    [setCourseData]
  )

  const storeTrainers = useCallback(
    (trainersInput: TrainerInput[]) => {
      setTrainers(trainersInput)
    },
    [setTrainers]
  )

  const storeExpenses = useCallback(
    (expensesInput: Record<string, ExpensesInput>) => {
      setExpenses(expensesInput)
    },
    [setExpenses]
  )

  const completeStep = useCallback(
    (step: string) => setCompletedSteps([...(completedSteps ?? []), step]),
    [completedSteps, setCompletedSteps]
  )

  const value = useMemo(() => {
    return {
      completeStep,
      completedSteps,
      courseData,
      expenses,
      storeCourseData,
      storeExpenses,
      storeTrainers,
      trainers,
    }
  }, [
    completeStep,
    completedSteps,
    courseData,
    expenses,
    storeCourseData,
    storeExpenses,
    storeTrainers,
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
