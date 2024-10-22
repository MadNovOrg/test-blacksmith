import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ImportOrganisationsConfig,
  ImportUsersConfig,
} from '@app/generated/graphql'

import { ImportStepsEnum as ImportSteps, ImportStepsEnum } from '..'

export type ContextValue = {
  data: string | null
  jobId: string | null
  config: ImportUsersConfig | ImportOrganisationsConfig | null
  currentStepKey: ImportSteps
  completedSteps: ImportSteps[]
  completeStep: (step: ImportSteps) => void
  goToStep: (step: ImportSteps) => void
  fileChosen: (data: string) => void
  importConfigured: (
    config: ImportUsersConfig | ImportOrganisationsConfig,
  ) => void
  importStarted: (jobId: string) => void
  setCurrentStepKey: (step: ImportStepsEnum) => void
}

export const ImportContext = React.createContext<ContextValue | undefined>(
  undefined,
)

export const ImportProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()

  const [currentStepKey, setCurrentStepKey] = useState<ImportSteps>(
    ImportSteps.CHOOSE,
  )

  const [data, setData] = useState<ContextValue['data']>(null)
  const [config, setConfig] = useState<ContextValue['config']>(null)
  const [jobId, setJobId] = useState<ContextValue['jobId']>(null)

  const completeStep = useCallback<ContextValue['completeStep']>(step => {
    switch (step) {
      case ImportSteps.CHOOSE: {
        setCurrentStepKey(ImportSteps.CONFIGURE)
        break
      }

      case ImportSteps.CONFIGURE: {
        setCurrentStepKey(ImportSteps.PREVIEW)
        break
      }

      case ImportSteps.PREVIEW: {
        setCurrentStepKey(ImportSteps.IMPORTING)
        break
      }

      case ImportSteps.IMPORTING: {
        setCurrentStepKey(ImportSteps.RESULTS)
        break
      }
    }
  }, [])

  const completedSteps = useMemo<ContextValue['completedSteps']>(() => {
    switch (currentStepKey) {
      case ImportSteps.CHOOSE: {
        return []
      }

      case ImportSteps.CONFIGURE: {
        return [ImportSteps.CHOOSE]
      }

      case ImportSteps.PREVIEW: {
        return [ImportSteps.CHOOSE, ImportSteps.CONFIGURE]
      }

      case ImportSteps.IMPORTING: {
        return [ImportSteps.CHOOSE, ImportSteps.CONFIGURE, ImportSteps.PREVIEW]
      }

      case ImportSteps.RESULTS: {
        return [
          ImportSteps.CHOOSE,
          ImportSteps.CONFIGURE,
          ImportSteps.PREVIEW,
          ImportSteps.IMPORTING,
        ]
      }
    }
  }, [currentStepKey])

  const goToStep = useCallback<ContextValue['goToStep']>(
    step => {
      switch (step) {
        case ImportSteps.CHOOSE: {
          navigate('./')
          break
        }

        case ImportSteps.CONFIGURE: {
          navigate('./configure')
          break
        }

        case ImportSteps.PREVIEW: {
          navigate('./preview')
          break
        }

        case ImportSteps.IMPORTING: {
          navigate('./importing')
          break
        }

        case ImportSteps.RESULTS: {
          navigate('./results')
          break
        }
      }
    },
    [navigate],
  )

  const fileChosen = useCallback<ContextValue['fileChosen']>(data => {
    setData(data)
  }, [])

  const importConfigured = useCallback<ContextValue['importConfigured']>(
    config => {
      setConfig(config)
    },
    [],
  )

  const importStarted = useCallback<ContextValue['importStarted']>(jobId => {
    setJobId(jobId)
  }, [])

  const value = useMemo<ContextValue>(
    () => ({
      data,
      config,
      jobId,
      currentStepKey,
      completedSteps,
      completeStep,
      goToStep,
      fileChosen,
      importConfigured,
      importStarted,
      setCurrentStepKey,
    }),
    [
      completeStep,
      completedSteps,
      config,
      currentStepKey,
      data,
      fileChosen,
      goToStep,
      importConfigured,
      importStarted,
      jobId,
      setCurrentStepKey,
    ],
  )

  return (
    <ImportContext.Provider value={value}>{children}</ImportContext.Provider>
  )
}
