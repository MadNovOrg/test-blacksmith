import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { Accreditors_Enum } from '@app/generated/graphql'

import { CourseDetailsTabs } from '../../CourseDetails'

type Step = 'grading-clearance' | 'modules'

type Context = {
  steps: Array<Step>
  currentStepKey: Step
  completeStep: (step: Step) => void
  completedSteps: Array<Step>
  backToStep: (step: Step) => void
}

const GradingDetailsContext = React.createContext<Context | undefined>(
  undefined
)

type Props = {
  accreditedBy: Accreditors_Enum
}

export const GradingDetailsProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  accreditedBy,
}) => {
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const location = useLocation()

  const [currentStepKey, setCurrentStepKey] =
    useState<Step>('grading-clearance')

  const [completedSteps, setCompletedSteps] = useState<
    Context['completedSteps']
  >([])

  const steps: Context['steps'] = useMemo(
    () =>
      accreditedBy === Accreditors_Enum.Bild
        ? ['grading-clearance']
        : ['grading-clearance', 'modules'],
    [accreditedBy]
  )

  useEffect(() => {
    if (location.pathname.includes('modules')) {
      setCompletedSteps(['grading-clearance'])
    } else {
      setCompletedSteps([])
    }
  }, [location.pathname])

  const navigateToCourse = useCallback(() => {
    navigate(`/courses/${courseId}/details?tab=${CourseDetailsTabs.GRADING}`)
  }, [courseId, navigate])

  const value: Context = useMemo(
    () => ({
      steps,
      currentStepKey,
      completedSteps,
      completeStep: async step => {
        switch (step) {
          case 'grading-clearance': {
            if (steps.includes('modules')) {
              setCurrentStepKey('modules')
              navigate('./modules')
            } else {
              navigateToCourse()
            }

            break
          }

          case 'modules': {
            navigateToCourse()
            break
          }

          default: {
            break
          }
        }
      },
      backToStep: step => {
        if (step === 'grading-clearance') {
          navigate('../grading-details', { replace: true })
        }
      },
    }),
    [completedSteps, currentStepKey, navigate, navigateToCourse, steps]
  )

  return (
    <GradingDetailsContext.Provider value={value}>
      {children}
    </GradingDetailsContext.Provider>
  )
}

export function useGradingDetails() {
  const context = useContext(GradingDetailsContext)

  if (!context) {
    throw new Error('There is no GradingDetailsContext in the tree')
  }

  return context
}
