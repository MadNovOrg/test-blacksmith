import { LoadingButton } from '@mui/lab'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useFetcher } from '@app/hooks/use-fetcher'
import useCourseModules from '@app/hooks/useCourseModules'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/courses/save-course-modules-selection'
import { LoadingStatus } from '@app/util'

import { HoldsRecord, ModulesSelectionList } from '../ModulesSelectionList'

export const ModulesSelection = () => {
  const { t } = useTranslation()
  const { id: courseId } = useParams()
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const [savingSelectionStatus, setSavingSelectionStatus] = useState(
    LoadingStatus.IDLE
  )

  const STORAGE_KEY = `modules-selection-${courseId}`

  const { status, data: courseModules } = useCourseModules(courseId ?? '')
  const modulesSelectionRef = useRef<Record<string, boolean> | null>(null)

  const moduleGroups = useMemo(() => {
    if (!courseModules) {
      return []
    }

    const groups: Record<
      string,
      {
        id: string
        name: string
        modules: Array<{ id: string; name: string; covered: boolean }>
      }
    > = {}

    const rawStoredSelection = localStorage.getItem(STORAGE_KEY)
    const storedSelection: Record<string, boolean> = JSON.parse(
      rawStoredSelection ?? '{}'
    )

    courseModules.forEach(courseModule => {
      const moduleGroup = groups[courseModule.module.moduleGroup.id]

      if (!moduleGroup) {
        groups[courseModule.module.moduleGroup.id] = {
          id: courseModule.module.moduleGroup.id,
          name: courseModule.module.moduleGroup.name,
          modules: [],
        }
      }

      groups[courseModule.module.moduleGroup.id].modules.push({
        id: courseModule.module.id,
        name: courseModule.module.name,
        covered:
          courseModule.covered ??
          storedSelection[courseModule.module.id] ??
          true,
      })
    })

    return Object.values(groups)
  }, [STORAGE_KEY, courseModules])

  useEffect(() => {
    const initialSelection: Record<string, boolean> = {}

    moduleGroups.forEach(group => {
      group.modules.forEach(module => {
        initialSelection[module.id] = module.covered
      })
    })

    modulesSelectionRef.current = initialSelection
  }, [moduleGroups])

  const handleSelectionChange = (selection: HoldsRecord) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
    modulesSelectionRef.current = selection
  }

  const saveModulesSelection = async () => {
    setSavingSelectionStatus(LoadingStatus.FETCHING)

    try {
      const covered: string[] = []
      const notCovered: string[] = []

      for (const id in modulesSelectionRef.current) {
        if (modulesSelectionRef.current[id]) {
          covered.push(id)
        } else {
          notCovered.push(id)
        }
      }

      const { saveCovered, saveNotCovered } = await fetcher<
        ResponseType,
        ParamsType
      >(MUTATION, {
        coveredModules: covered,
        notCoveredModules: notCovered,
        courseId: courseId ?? '',
      })

      if (
        saveCovered.affectedRows !== covered.length ||
        saveNotCovered.affectedRows !== notCovered.length
      ) {
        setSavingSelectionStatus(LoadingStatus.ERROR)
      } else {
        localStorage.removeItem(STORAGE_KEY)

        navigate(
          `/trainer-base/course/${courseId}/details?tab=${CourseDetailsTabs.GRADING}`
        )
      }
    } catch (err) {
      setSavingSelectionStatus(LoadingStatus.ERROR)
    }
  }

  return (
    <Box pb={5}>
      {status === LoadingStatus.FETCHING ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="modules-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : null}
      {moduleGroups.length ? (
        <>
          <Box mb={2}>
            <Typography variant="h5" fontWeight="500" mb={1}>
              {t('pages.modules-selection.title')}
            </Typography>
            <Typography>
              {t('pages.modules-selection.page-description-line1')}
            </Typography>
            <Typography fontWeight="500">
              {t('pages.modules-selection.page-description-line2')}
            </Typography>
          </Box>

          <ModulesSelectionList
            moduleGroups={moduleGroups}
            onChange={handleSelectionChange}
          />

          <Box display="flex" justifyContent="space-between" mt={3}>
            <LoadingButton
              loading={savingSelectionStatus === LoadingStatus.FETCHING}
              onClick={() => {
                navigate(`/trainer-base/course/${courseId}/grading-details`)
              }}
            >
              {t('pages.modules-selection.back-button-text')}
            </LoadingButton>
            <LoadingButton
              loading={savingSelectionStatus === LoadingStatus.FETCHING}
              variant="contained"
              onClick={saveModulesSelection}
            >
              {t('pages.modules-selection.save-button-text')}
            </LoadingButton>
          </Box>
        </>
      ) : null}
    </Box>
  )
}
