import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { Accreditors_Enum } from '@app/generated/graphql'
import { useBildStrategies } from '@app/hooks/useBildStrategies'
import { useCourseDraft } from '@app/hooks/useCourseDraft'
import {
  CourseType,
  Draft,
  ExpensesInput,
  TrainerInput,
  TrainerRoleTypeName,
  ValidCourseInput,
} from '@app/types'
import { generateBildCourseName, generateCourseName } from '@app/util'

import { useCoursePrice } from '../../hooks/useCoursePrice'
import { ContextValue, StepsEnum } from '../../types'
import { checkCourseDetailsForExceptions } from '../CourseExceptionsConfirmation/utils'

import { getCourseType } from './helpers'

export { getCourseType }

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
  const { t } = useTranslation()
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

  const [invoiceDetails, setInvoiceDetails] = useState<
    ContextValue['invoiceDetails']
  >(initialValue?.invoiceDetails ?? undefined)

  const { strategies } = useBildStrategies(
    Boolean(courseData?.accreditedBy === Accreditors_Enum.Bild)
  )

  const pricing = useCoursePrice(courseData)

  const seniorOrPrincipalLead = useMemo(() => {
    return (
      profile?.trainer_role_types.some(
        ({ trainer_role_type: role }) =>
          role.name === TrainerRoleTypeName.SENIOR ||
          role.name === TrainerRoleTypeName.PRINCIPAL
      ) ?? false
    )
  }, [profile])

  const exceptions = useMemo(() => {
    if (!courseData) return []

    return checkCourseDetailsForExceptions(
      { ...courseData, hasSeniorOrPrincipalLeader: seniorOrPrincipalLead },
      trainers
    )
  }, [courseData, trainers, seniorOrPrincipalLead])

  const completeStep = useCallback(
    (step: StepsEnum) => {
      if (!completedSteps.includes(step)) {
        setCompletedSteps([...(completedSteps ?? []), step])
      }
    },
    [completedSteps, setCompletedSteps]
  )

  const courseName = useMemo(() => {
    if (!courseData) {
      return ''
    }

    if (courseData.accreditedBy === Accreditors_Enum.Bild) {
      return generateBildCourseName(courseData.bildStrategies, strategies)
    }

    return generateCourseName(
      {
        level: courseData.courseLevel,
        reaccreditation: courseData.reaccreditation,
      },
      t
    )
  }, [courseData, strategies, t])

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
      invoiceDetails,
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
    invoiceDetails,
  ])

  const value: ContextValue = useMemo(() => {
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
      exceptions,
      courseName,
      pricing: {
        amount: pricing.price,
        error: Boolean(pricing.error),
      },
      invoiceDetails,
      setInvoiceDetails,
    }
  }, [
    completeStep,
    completedSteps,
    courseData,
    courseType,
    currentStepKey,
    expenses,
    saveDraft,
    trainers,
    go1Licensing,
    exceptions,
    courseName,
    pricing.price,
    pricing.error,
    invoiceDetails,
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
