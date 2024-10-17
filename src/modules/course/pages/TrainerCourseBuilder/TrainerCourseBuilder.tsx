import React, { useCallback, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { Accreditors_Enum, ModuleSettingsQuery } from '@app/generated/graphql'
import { generateCourseName } from '@app/util'

import {
  BILDBuilderCourseData,
  BILDCourseBuilder,
} from '../CourseBuilder/components/BILDCourseBuilder/BILDCourseBuilder'
import {
  ICMCourseBuilderV2,
  OnSubmitICMCourseBuilderArgs,
} from '../CourseBuilder/components/ICMCourseBuilderV2/ICMCourseBuilderV2'
import { useCreateCourse } from '../CreateCourse/components/CreateCourseProvider'
import { useSaveCourse } from '../CreateCourse/useSaveCourse'
import {
  BuilderCourseData,
  mapCourseFormInputToBuilderCourseData,
} from '../CreateCourse/utils'

export const TrainerCourseBuilder: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const {
    bildStrategyModules,
    courseData,
    curriculum,
    go1Licensing,
    setBildModules,
    setBildStrategyModules,
    setCurriculum,
  } = useCreateCourse()
  const { saveCourse } = useSaveCourse()

  const builderCourseData: BuilderCourseData<Accreditors_Enum> | null =
    useMemo(() => {
      if (courseData) {
        const name = generateCourseName(
          {
            level: courseData.courseLevel,
            reaccreditation: courseData.reaccreditation,
          },
          t,
          acl.isUK(),
        )

        return mapCourseFormInputToBuilderCourseData({
          courseData,
          curriculum: curriculum?.curriculum ?? undefined,
          go1Integration: Boolean(go1Licensing),
          name,
        })
      }

      return null
    }, [courseData, curriculum, go1Licensing, t, acl])

  const onCourseBuilderSubmit = useCallback(() => {
    return saveCourse()
  }, [saveCourse])

  const onICMModuleSelectionChange = useCallback(
    (modulesData: OnSubmitICMCourseBuilderArgs) => {
      setCurriculum({
        curriculum: modulesData.curriculum,
        modulesDuration: modulesData.duration,
      })
    },
    [setCurriculum],
  )

  const onBILDModuleSelectionChange = useCallback(
    (data: {
      modulesDuration: number
      strategyModules: Record<string, boolean>
      bildModules: ModuleSettingsQuery['moduleSettings']
    }) => {
      setBildStrategyModules({
        modules: data.strategyModules,
        modulesDuration: data.modulesDuration,
      })
      setBildModules(data.bildModules)
    },
    [setBildModules, setBildStrategyModules],
  )

  return (
    <>
      <Helmet>
        <title>
          {t('pages.browser-tab-titles.manage-courses.course-builder')}
        </title>
      </Helmet>

      {courseData?.accreditedBy === Accreditors_Enum.Icm &&
      builderCourseData ? (
        <ICMCourseBuilderV2
          data={builderCourseData}
          editMode={false}
          onModuleSelectionChange={onICMModuleSelectionChange}
          onSubmit={onCourseBuilderSubmit}
        />
      ) : null}

      {courseData?.accreditedBy === Accreditors_Enum.Bild &&
      builderCourseData ? (
        <BILDCourseBuilder
          data={builderCourseData as BILDBuilderCourseData}
          onModuleSelectionChange={onBILDModuleSelectionChange}
          onSubmit={onCourseBuilderSubmit}
          initialStrategyModules={bildStrategyModules?.modules}
        />
      ) : null}
    </>
  )
}
