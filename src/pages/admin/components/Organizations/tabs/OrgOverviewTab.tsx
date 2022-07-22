import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  CircularProgress,
  Container,
  Grid,
  Stack,
  Tab,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CountPanel } from '@app/components/CountPanel'
import { useAuth } from '@app/context/auth'
import useOrg from '@app/hooks/useOrg'
import { IndividualsByLevelList } from '@app/pages/admin/components/Organizations/tabs/components/IndividualsByLevelList'
import { CourseLevel } from '@app/types'

type OrgOverviewTabParams = {
  orgId?: string
}

const LEVELS_IN_ORDER = [
  CourseLevel.LEVEL_1,
  CourseLevel.LEVEL_2,
  CourseLevel.INTERMEDIATE_TRAINER,
  CourseLevel.ADVANCED,
  CourseLevel.ADVANCED_TRAINER,
  null,
]

export const OrgOverviewTab: React.FC<OrgOverviewTabParams> = ({ orgId }) => {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const [userByLevelSelectedTab, setUserByLevelSelectedTab] = useState<string>()

  const { stats, profilesByLevel, loading } = useOrg(orgId, profile?.id)

  useEffect(() => {
    if (userByLevelSelectedTab === undefined && profilesByLevel?.size > 0) {
      const defaultTab = LEVELS_IN_ORDER.filter(level =>
        profilesByLevel.get(level)
      )[0]
      setUserByLevelSelectedTab(defaultTab ?? 'none')
    }
  }, [userByLevelSelectedTab, profilesByLevel])

  if (loading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="org-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 4 }}>
      <Grid container>
        <Grid item xs={6} md={3} p={1} borderRadius={1}>
          <CountPanel
            count={stats.profiles.count}
            label={t('pages.org-details.tabs.overview.total-individuals')}
          />
        </Grid>

        <Grid item xs={6} md={3} p={1} borderRadius={1}>
          <CountPanel
            count={stats.certificates.active.count}
            chip={{
              label: t('pages.org-details.tabs.overview.active'),
              color: 'success',
            }}
            label={t('pages.org-details.tabs.overview.currently-enrolled', {
              count: stats.certificates.active.enrolled,
            })}
          />
        </Grid>

        <Grid item xs={6} md={3} p={1} borderRadius={1}>
          <CountPanel
            count={stats.certificates.expiringSoon.count}
            chip={{
              label: t('pages.org-details.tabs.overview.expiring-soon'),
              color: 'warning',
            }}
            label={t('pages.org-details.tabs.overview.currently-enrolled', {
              count: stats.certificates.expiringSoon.enrolled,
            })}
          />
        </Grid>

        <Grid item xs={6} md={3} p={1} borderRadius={1}>
          <CountPanel
            count={stats.certificates.expired.count}
            chip={{
              label: t('pages.org-details.tabs.overview.expired'),
              color: 'error',
            }}
            label={t('pages.org-details.tabs.overview.currently-enrolled', {
              count: stats.certificates.expired.enrolled,
            })}
          />
        </Grid>

        <Grid item xs={12} md={8} p={1} mt={2}>
          <Typography variant="h4">
            {t('pages.org-details.tabs.overview.individuals-by-training-level')}
          </Typography>

          <TabContext
            value={
              userByLevelSelectedTab === undefined
                ? 'none'
                : userByLevelSelectedTab
            }
          >
            <TabList
              onChange={(_, value) => setUserByLevelSelectedTab(value)}
              sx={{ mt: 2 }}
            >
              {LEVELS_IN_ORDER.filter(level => profilesByLevel.get(level)).map(
                courseLevel => (
                  <Tab
                    key={courseLevel}
                    label={
                      courseLevel
                        ? t(`common.certificates.${courseLevel.toLowerCase()}`)
                        : t('common.certificates.no-certification')
                    }
                    value={courseLevel ?? 'none'}
                  />
                )
              )}
            </TabList>

            {LEVELS_IN_ORDER.filter(level => profilesByLevel.get(level)).map(
              courseLevel => (
                <TabPanel
                  value={courseLevel ?? 'none'}
                  key={courseLevel}
                  sx={{ p: 0 }}
                >
                  <IndividualsByLevelList
                    orgId={orgId}
                    courseLevel={courseLevel}
                  />
                </TabPanel>
              )
            )}
          </TabContext>
        </Grid>
      </Grid>
    </Container>
  )
}
