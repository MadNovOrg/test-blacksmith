import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useCallback } from 'react'
import { useMutation, useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  InsertSubmissionOfSplashScreenMutation,
  InsertSubmissionOfSplashScreenMutationVariables,
  ProfileManagedOrganizationsQuery,
  ProfileManagedOrganizationsQueryVariables,
  Splash_Screens_Enum,
} from '@app/generated/graphql'
import { GET_PROFILE_MANAGED_ORGS } from '@app/queries/organizations/get-profile-managed-orgs'
import { INSERT_SUBMISSION_OF_SPLASH_SCREEN } from '@app/queries/submission_of_splash_screens/insert-submission-of-splash-screen'
import { RoleName } from '@app/types'

import { useIsProfileSplashScreenPassed } from '../useProfileSplashScreens/useIsProfileSplashScreensPassed'

export const useProfileInsightsReportSplashScreen = () => {
  const { acl, activeRole, managedOrgIds, profile, reloadCurrentProfile } =
    useAuth()

  const externalDashboardUrlEnabled = useFeatureFlagEnabled(
    'external-dashboard-url-enabled',
  )

  const isProfileSplashScreenPassed = useIsProfileSplashScreenPassed(
    Splash_Screens_Enum.OrganisationsInsightReports,
  )

  const isInsightsReportSplashScreenEnabled =
    acl.isUK() &&
    !isProfileSplashScreenPassed &&
    externalDashboardUrlEnabled &&
    profile?.id &&
    activeRole === RoleName.USER &&
    managedOrgIds?.length

  const [{ data: managedOrgs }] = useQuery<
    ProfileManagedOrganizationsQuery,
    ProfileManagedOrganizationsQueryVariables
  >({
    query: GET_PROFILE_MANAGED_ORGS,
    variables: {
      profileId: profile?.id ?? '',
    },
    pause: !isInsightsReportSplashScreenEnabled,
  })

  const [, insertSubmissionOfSplashScreen] = useMutation<
    InsertSubmissionOfSplashScreenMutation,
    InsertSubmissionOfSplashScreenMutationVariables
  >(INSERT_SUBMISSION_OF_SPLASH_SCREEN)

  const insertSubmissionOfInsightsReportSplashScreen = useCallback(async () => {
    if (!profile?.id) return

    await insertSubmissionOfSplashScreen({
      profileId: profile.id,
      splashScreen: Splash_Screens_Enum.OrganisationsInsightReports,
    })

    return reloadCurrentProfile()
  }, [insertSubmissionOfSplashScreen, profile?.id, reloadCurrentProfile])

  const managedOrgsWithDashboardUrls =
    managedOrgs?.organization_member
      .filter(orgMember =>
        Boolean(orgMember.organization.external_dashboard_url),
      )
      .map(orgMember => ({
        orgId: orgMember.organization.id,
        externalDashboardUrl: orgMember.organization.external_dashboard_url,
        name: orgMember.organization.name,
      })) ?? []

  return {
    insertSubmissionOfInsightsReportSplashScreen,
    managedOrgsWithDashboardUrls: isInsightsReportSplashScreenEnabled
      ? managedOrgsWithDashboardUrls
      : [],
  }
}
