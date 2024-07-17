import {
  Grid,
  Box,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { useQueryParam } from 'use-query-params'

import { FilterSearch } from '@app/components/FilterSearch'
import useCourseParticipantsOrganizations from '@app/modules/course_attendees/hooks/useCourseParticipantsOrganizations'
import { CourseDetailsTabs } from '@app/modules/course_details/pages/CourseDetails'
import theme from '@app/theme'

import { AttendeeOrganizationDropdown } from '../AttendeeOrganizationSelector'

import {
  getAttendeeTabWhereCondition,
  getGradingTabWhereCondition,
  getWhereCondition,
} from './utils'

type Props = {
  canViewEvaluationSubmittedColumn?: boolean
  courseId: number
  trainersWithEvaluations?: string[]
  handleWhereConditionChange: (where: Record<string, object>) => void
}
export const CourseDetailsFilters: React.FC<Props> = (props: Props) => {
  const {
    canViewEvaluationSubmittedColumn,
    courseId,
    trainersWithEvaluations,
    handleWhereConditionChange,
  } = props

  const { t } = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [keyword, setKeyword] = useState('')
  const [keywordDebounced] = useDebounce(keyword, 300)
  const [selectedOrganization, setSelectedOrganization] = useState<string>('')
  const [filterByHandS, setFilterByHandS] = useState(false)
  const [filterByCourseEvaluation, setFilterByCourseEvaluation] =
    useState(false)

  const selectedTab = useQueryParam('tab')
  const isAttendeesTab =
    selectedTab.includes(CourseDetailsTabs.ATTENDEES) ||
    selectedTab[0] === undefined
  const isGradingTab = selectedTab.includes(CourseDetailsTabs.GRADING)

  const includeTrainerOrganizations =
    selectedTab.includes(CourseDetailsTabs.EVALUATION) &&
    Number(trainersWithEvaluations?.length) > 0

  const { data: orgNames } = useCourseParticipantsOrganizations(
    courseId,
    getWhereCondition(selectedTab[0] as CourseDetailsTabs),
    includeTrainerOrganizations,
    trainersWithEvaluations,
  )
  const attendeeOrganizations =
    orgNames?.course_participant?.flatMap(cp =>
      cp?.profile?.organizations?.map(org => org?.organization?.name),
    ) ?? []
  const trainerOrganizations =
    orgNames?.course_trainer?.flatMap(ct =>
      ct?.profile?.organizations?.map(org => org?.organization?.name),
    ) ?? []

  const keywordArray = useMemo(() => {
    return keywordDebounced.toLocaleLowerCase().trim().split(' ')
  }, [keywordDebounced])

  const where = useMemo(() => {
    switch (true) {
      case isAttendeesTab:
        return getAttendeeTabWhereCondition(
          keywordArray,
          selectedOrganization,
          filterByHandS,
          filterByCourseEvaluation,
        )
      case isGradingTab:
        return getGradingTabWhereCondition(keywordArray, selectedOrganization)
      default:
        return {
          condition: {
            keywordArray: keywordArray,
            selectedOrganization: selectedOrganization,
          },
        }
    }
  }, [
    filterByCourseEvaluation,
    filterByHandS,
    isAttendeesTab,
    isGradingTab,
    keywordArray,
    selectedOrganization,
  ])

  useEffect(() => {
    handleWhereConditionChange(where)
  }, [handleWhereConditionChange, where])

  const handleOrganizationChange = useCallback((value: string) => {
    setSelectedOrganization(value)
  }, [])

  const handleHandSChange = useCallback(
    (checked: boolean) => {
      setFilterByHandS(checked)
    },
    [setFilterByHandS],
  )

  const handleCourseEvaluationChange = useCallback(
    (checked: boolean) => {
      setFilterByCourseEvaluation(checked)
    },
    [setFilterByCourseEvaluation],
  )

  return (
    <Grid
      container
      alignItems={'flex-end'}
      paddingBottom={'15px'}
      md={12}
      spacing={2}
    >
      <Grid item xs={12} sm={12} md={4}>
        <FilterSearch
          fullWidth={isMobile}
          value={keyword}
          onChange={setKeyword}
          placeholder={t('common.search')}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <AttendeeOrganizationDropdown
          options={Array.from(
            new Set([...attendeeOrganizations, ...trainerOrganizations]),
          )}
          selectedOrganization={selectedOrganization ?? ''}
          onChange={handleOrganizationChange}
        />
      </Grid>
      {isAttendeesTab ? (
        <Grid item xs={12} sm={12} md={4}>
          <Grid container justifyContent={'space-around'}>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={filterByHandS}
                    data-testid="h-and-s-checkbox"
                    onChange={(event, checked) => handleHandSChange(checked)}
                  />
                }
                label={t('common.filters.h-and-s')}
              />
            </Box>
            {canViewEvaluationSubmittedColumn ? (
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={filterByCourseEvaluation}
                      data-testid="course-evaluation-checkbox"
                      onChange={(event, checked) =>
                        handleCourseEvaluationChange(checked)
                      }
                    />
                  }
                  label={t('common.filters.course-evaluation')}
                />
              </Box>
            ) : null}
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  )
}
