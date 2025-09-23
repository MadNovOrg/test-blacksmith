import {
  Grid,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { useQueryParam } from 'use-query-params'

import { FilterSearch } from '@app/components/FilterSearch'
import useCourseParticipantsOrganizations from '@app/modules/course_details/hooks/course-participant/useCourseParticipantsOrganizations'
import { CourseDetailsTabs } from '@app/modules/course_details/pages/CourseDetails'
import theme from '@app/theme'

import { AttendeeOrganizationDropdown } from '../AttendeeOrganizationSelector'

import {
  getAttendeeTabWhereCondition,
  getGradingTabWhereCondition,
  getWhereCondition,
  HAndSFilterValues,
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
  const [filterByHandS, setFilterByHandS] = useState<HAndSFilterValues>(
    HAndSFilterValues.ALL,
  )
  const [filterByCourseEvaluation, setFilterByCourseEvaluation] =
    useState<HAndSFilterValues>(HAndSFilterValues.ALL)

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

  const attendeeSubmissionOptions: Record<HAndSFilterValues, string> = useMemo(
    () => ({
      [HAndSFilterValues.ALL]: t(
        'common.filters.attendee-submission-option-all',
      ),
      [HAndSFilterValues.YES]: t(
        'common.filters.attendee-submission-option-yes',
      ),
      [HAndSFilterValues.NO]: t('common.filters.attendee-submission-option-no'),
    }),
    [t],
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
          <Grid
            container
            alignItems="start"
            gap={1}
            justifyContent="space-around"
          >
            <FormControl sx={{ flex: 1 }} variant="filled">
              <InputLabel id="attendee-h-and-s-label">
                {t('common.filters.h-and-s')}
              </InputLabel>
              <Select
                id="attendee-h-and-s-select"
                data-testid="attendee-h-and-s-select"
                label={t('common.filters.h-and-s')}
                labelId="attendee-h-and-s-label"
                value={filterByHandS}
                onChange={e =>
                  setFilterByHandS(e.target.value as HAndSFilterValues)
                }
              >
                {Object.entries(attendeeSubmissionOptions).map(
                  ([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
            {canViewEvaluationSubmittedColumn ? (
              <FormControl sx={{ flex: 1 }} variant="filled">
                <InputLabel id="attendee-course-evaluation-label">
                  {t('common.filters.course-evaluation')}
                </InputLabel>
                <Select
                  id="attendee-course-evaluation-select"
                  data-testid="attendee-course-evaluation-select"
                  label={t('common.filters.course-evaluation')}
                  labelId="attendee-course-evaluation-label"
                  value={filterByCourseEvaluation}
                  onChange={e =>
                    setFilterByCourseEvaluation(
                      e.target.value as HAndSFilterValues,
                    )
                  }
                >
                  {Object.entries(attendeeSubmissionOptions).map(
                    ([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
            ) : null}
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  )
}
