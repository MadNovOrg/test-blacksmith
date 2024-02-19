import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Type_Enum,
  SetCourseDraftMutation,
  SetCourseDraftMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { useBildStrategies } from '@app/hooks/useBildStrategies'
import { QUERY as SET_COURSE_DRAFT } from '@app/queries/courses/set-course-draft'
import {
  Draft,
  ExpensesInput,
  TrainerInput,
  TrainerRoleType,
  TrainerRoleTypeName,
  ValidCourseInput,
} from '@app/types'
import {
  checkIsETA,
  checkIsEmployerAOL,
  generateBildCourseName,
  generateCourseName,
} from '@app/util'

import { ContextValue, StepsEnum } from '../../types'
import { checkCourseDetailsForExceptions } from '../CourseExceptionsConfirmation/utils'

import { getCourseType } from './helpers'

export { getCourseType }

const CreateCourseContext = React.createContext<ContextValue | undefined>(
  undefined
)

export enum SaveDraftError {
  NO_USER_PROFILE,
  DRAFT_SAVE_FAILURE,
}

export type SaveDraftResult = {
  id?: string
  name?: string
  error?: SaveDraftError
}

export type CreateCourseProviderProps = {
  initialValue?: Draft
  courseType: Course_Type_Enum
  draftName?: string | null
}

export const CreateCourseProvider: React.FC<
  React.PropsWithChildren<CreateCourseProviderProps>
> = ({ children, initialValue, courseType, draftName }) => {
  const { t } = useTranslation()
  const { acl, profile } = useAuth()
  const { id: draftId } = useParams()
  const fetcher = useFetcher()

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

  const [showDraftConfirmationDialog, setShowDraftConfirmationDialog] =
    useState(false)

  const [invoiceDetails, setInvoiceDetails] = useState<
    ContextValue['invoiceDetails']
  >(initialValue?.invoiceDetails ?? undefined)

  const { strategies } = useBildStrategies(
    Boolean(courseData?.accreditedBy === Accreditors_Enum.Bild)
  )

  const seniorOrPrincipalLead = useMemo(() => {
    return trainers.some(t =>
      t.trainer_role_types.some(
        ({ trainer_role_type: role }) =>
          role?.name === TrainerRoleTypeName.SENIOR ||
          role?.name === TrainerRoleTypeName.PRINCIPAL
      )
    )
  }, [trainers])

  const isETA = useMemo(() => {
    return trainers.some(t =>
      checkIsETA(t.trainer_role_types as TrainerRoleType[])
    )
  }, [trainers])

  const isEmployerAOL = useMemo(() => {
    return trainers.some(t =>
      checkIsEmployerAOL(t.trainer_role_types as TrainerRoleType[])
    )
  }, [trainers])

  const exceptions = useMemo(() => {
    if (!courseData) return []

    return checkCourseDetailsForExceptions(
      {
        ...courseData,
        hasSeniorOrPrincipalLeader: seniorOrPrincipalLead,
        usesAOL: courseData.usesAOL,
        isTrainer: acl.isTrainer(),
        isETA: isETA,
        isEmployerAOL: isEmployerAOL,
      },
      trainers
    )
  }, [courseData, seniorOrPrincipalLead, acl, isETA, isEmployerAOL, trainers])

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
      return generateBildCourseName(
        strategies,
        {
          level: courseData.courseLevel,
          reaccreditation: courseData.reaccreditation,
          conversion: courseData.conversion,
          bildStrategies: courseData.bildStrategies,
        },
        t
      )
    }

    return generateCourseName(
      {
        level: courseData.courseLevel,
        reaccreditation: courseData.reaccreditation,
      },
      t
    )
  }, [courseData, strategies, t])

  const saveDraft = useCallback(
    async (name?: string): Promise<SaveDraftResult> => {
      if (!profile?.id) {
        return {
          error: SaveDraftError.NO_USER_PROFILE,
        }
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

      const normalizedDraft = draft
      if (normalizedDraft.expenses) {
        for (const key in normalizedDraft.expenses) {
          normalizedDraft.expenses[key].transport =
            normalizedDraft.expenses[key].transport?.filter(Boolean) ?? []
          normalizedDraft.expenses[key].miscellaneous =
            normalizedDraft.expenses[key].miscellaneous?.filter(Boolean) ?? []
        }
      }

      try {
        const response = await fetcher<
          SetCourseDraftMutation,
          SetCourseDraftMutationVariables
        >(SET_COURSE_DRAFT, {
          object: {
            courseType: courseType ?? draft.courseData?.type,
            data: normalizedDraft,
            name,
            id: draftId,
          },
        })

        return {
          id: response.insert_course_draft_one?.id,
          name,
        }
      } catch (error) {
        console.log({
          message: 'Error saving draft',
          error,
        })
        return {
          error: SaveDraftError.DRAFT_SAVE_FAILURE,
        }
      }
    },
    [
      completedSteps,
      courseData,
      currentStepKey,
      expenses,
      profile,
      trainers,
      go1Licensing,
      invoiceDetails,
      courseType,
      draftId,
      fetcher,
    ]
  )

  const value: ContextValue = useMemo(() => {
    return {
      completeStep,
      completedSteps,
      courseData,
      courseType,
      currentStepKey,
      expenses,
      draftName,
      saveDraft,
      setCourseData,
      setCurrentStepKey,
      setExpenses,
      setTrainers,
      trainers,
      go1Licensing,
      showDraftConfirmationDialog,
      setShowDraftConfirmationDialog,
      setGo1Licensing,
      exceptions,
      courseName,
      pricing: {
        amount: 0,
        error: false,
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
    draftName,
    saveDraft,
    trainers,
    go1Licensing,
    exceptions,
    courseName,
    invoiceDetails,
    showDraftConfirmationDialog,
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
