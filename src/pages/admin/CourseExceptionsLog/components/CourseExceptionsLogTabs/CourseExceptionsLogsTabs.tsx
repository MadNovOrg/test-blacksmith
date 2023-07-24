import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Container, Tab } from '@mui/material'
import { FC, PropsWithChildren, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Course_Audit_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import useCourseAuditLogs from '@app/hooks/useCourseAuditLogs'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'

import {
  CourseExceptionsLogFilters,
  FilterChangeEvent,
} from '../CourseExceptionsLogFilters'
import { CourseExceptionsLogTable } from '../CourseExceptionsLogTable'

export type TabsValues = Extract<
  Course_Audit_Type_Enum,
  Course_Audit_Type_Enum.Approved | Course_Audit_Type_Enum.Rejected
>
type Tabs = Array<{
  label: string
  value: TabsValues
}>
export type Filters = {
  query: string
  eventDates: {
    from: Date | undefined
    to: Date | undefined
  }
  filterByCertificateLevel: Course_Level_Enum[]
  filterByCourseType: Course_Type_Enum[]
}

export const CourseExceptionsLogTabs: FC<PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<Filters>({
    query: '',
    eventDates: {
      from: undefined,
      to: undefined,
    },
    filterByCertificateLevel: [],
    filterByCourseType: [],
  })
  const [activeTab, setActiveTab] = useState<TabsValues>(
    Course_Audit_Type_Enum.Approved
  )
  const { Pagination, limit, offset } = useTablePagination()
  const sorting = useTableSort('created_at', 'desc')

  const { logs, count, loading } = useCourseAuditLogs({
    type: activeTab,
    sort: sorting,
    filter: filters,
    limit,
    offset,
    fromExceptionsLog: true,
  })

  const tabs: Tabs = [
    {
      label: t(
        `pages.admin.course-exceptions-log.${Course_Audit_Type_Enum.Approved}`
      ),
      value: Course_Audit_Type_Enum.Approved,
    },
    {
      label: t(
        `pages.admin.course-exceptions-log.${Course_Audit_Type_Enum.Rejected}`
      ),
      value: Course_Audit_Type_Enum.Rejected,
    },
  ]

  const onFiltersChange = useCallback((e: FilterChangeEvent) => {
    switch (e.source) {
      case 'search':
        return setFilters(prev => ({ ...prev, query: e.value }))
      case 'dates':
        return setFilters(prev => ({
          ...prev,
          eventDates: {
            from: e.value[0],
            to: e.value[1],
          },
        }))
      case 'course-level':
        return setFilters(prev => ({
          ...prev,
          filterByCertificateLevel: e.value,
        }))
      case 'course-type':
        return setFilters(prev => ({ ...prev, filterByCourseType: e.value }))
      default:
        return null
    }
  }, [])
  return (
    <TabContext value={activeTab}>
      <Box data-testid="course-exceptions-log-tabs">
        <Container
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="end">
            <TabList>
              {tabs.map((tab, index) => (
                <Tab
                  onClick={() => setActiveTab(tab.value)}
                  label={tab.label}
                  value={tab.value}
                  key={`${index}+${tab.label}`}
                />
              ))}
            </TabList>
          </Box>
        </Container>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box
            display={'flex'}
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={4}
            sx={{ minWidth: { xs: '100%', md: '700px' } }}
          >
            <CourseExceptionsLogFilters
              count={count}
              onChange={onFiltersChange}
            />
            <Box
              display={'flex'}
              width={1}
              flexDirection={'column'}
              sx={{ overflow: 'auto' }}
            >
              {tabs.map((tab, index) => (
                <TabPanel
                  sx={{ width: '100%', p: 0 }}
                  value={tab.value}
                  key={`${index}+${tab.label}`}
                >
                  <CourseExceptionsLogTable
                    sorting={sorting}
                    logs={logs}
                    loading={loading}
                    activeTab={activeTab}
                  />
                </TabPanel>
              ))}
              {count ? (
                <Box sx={{ minWidth: { xs: '100%', md: '700px' } }}>
                  <Pagination total={count} />
                </Box>
              ) : null}
            </Box>
          </Box>
        </Container>
      </Box>
    </TabContext>
  )
}
