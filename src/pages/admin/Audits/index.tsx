import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Container, Tab, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { AttendeeCancellationTable } from '@app/pages/admin/Audits/AttendeeCancellationTable'
import { AttendeeReplacementTable } from '@app/pages/admin/Audits/AttendeeReplacementTable'
import { AttendeeTransferTable } from '@app/pages/admin/Audits/AttendeeTransferTable'
import { CourseCancellationTable } from '@app/pages/admin/Audits/CourseCancellationTable'
import { CourseReschedulingTable } from '@app/pages/admin/Audits/CourseReschedulingTable'
import theme from '@app/theme'

enum PageTab {
  ATTENDEE_CANCELLATION = 'attendee-cancellation',
  ATTENDEE_REPLACEMENT = 'attendee-replacement',
  ATTENDEE_TRANSFER = 'attendee-transfer',
  COURSE_CANCELLATION = 'course-cancellation',
  COURSE_RESCHEDULING = 'course-rescheduling',
}

export const AuditsPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialTab =
    (searchParams.get('tab') as PageTab) ?? PageTab.ATTENDEE_CANCELLATION
  const [activeTab, setActiveTab] = useState<PageTab>(initialTab)

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab)
  }, [initialTab])

  return (
    <FullHeightPage>
      <Box sx={{ bgcolor: theme.palette.grey[100] }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <BackButton label={t('pages.admin.back-to-settings')} />

          <Typography variant="h1" py={2} fontWeight={600}>
            {t(`pages.audits.title`)}
          </Typography>
        </Container>
      </Box>

      <Container>
        <TabContext value={activeTab}>
          <Box>
            <Container
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="end"
              >
                <TabList
                  onChange={(_, tab) =>
                    navigate(`.?tab=${tab}`, { replace: true })
                  }
                >
                  <Tab
                    label={t(`pages.audits.${PageTab.ATTENDEE_CANCELLATION}`)}
                    value={PageTab.ATTENDEE_CANCELLATION}
                  />
                  <Tab
                    label={t(`pages.audits.${PageTab.ATTENDEE_REPLACEMENT}`)}
                    value={PageTab.ATTENDEE_REPLACEMENT}
                  />
                  <Tab
                    label={t(`pages.audits.${PageTab.ATTENDEE_TRANSFER}`)}
                    value={PageTab.ATTENDEE_TRANSFER}
                  />
                  <Tab
                    label={t(`pages.audits.${PageTab.COURSE_CANCELLATION}`)}
                    value={PageTab.COURSE_CANCELLATION}
                  />
                  <Tab
                    label={t(`pages.audits.${PageTab.COURSE_RESCHEDULING}`)}
                    value={PageTab.COURSE_RESCHEDULING}
                  />
                </TabList>
              </Box>
            </Container>
            <Container>
              <TabPanel sx={{ px: 0 }} value={PageTab.ATTENDEE_CANCELLATION}>
                <AttendeeCancellationTable />
              </TabPanel>
              <TabPanel sx={{ px: 0 }} value={PageTab.ATTENDEE_REPLACEMENT}>
                <AttendeeReplacementTable />
              </TabPanel>
              <TabPanel sx={{ px: 0 }} value={PageTab.ATTENDEE_TRANSFER}>
                <AttendeeTransferTable />
              </TabPanel>
              <TabPanel sx={{ px: 0 }} value={PageTab.COURSE_CANCELLATION}>
                <CourseCancellationTable />
              </TabPanel>
              <TabPanel sx={{ px: 0 }} value={PageTab.COURSE_RESCHEDULING}>
                <CourseReschedulingTable />
              </TabPanel>
            </Container>
          </Box>
        </TabContext>
      </Container>
    </FullHeightPage>
  )
}
