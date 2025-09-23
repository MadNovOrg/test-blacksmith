import { useCallback } from 'react'
import { useMutation, useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  GetProfileOrgsWithDashboardLinkQuery,
  GetProfileOrgsWithDashboardLinkQueryVariables,
  InsertSubmissionOfSplashScreenMutation,
  InsertSubmissionOfSplashScreenMutationVariables,
  Splash_Screens_Enum,
} from '@app/generated/graphql'
import { GET_PROFILE_ORGS_WITH_DASHBOARD_LINK } from '@app/queries/organizations/get-profile-orgs-with-dashboard-link'
import { INSERT_SUBMISSION_OF_SPLASH_SCREEN } from '@app/queries/submission_of_splash_screens/insert-submission-of-splash-screen'
import { RoleName } from '@app/types'

import { useIsProfileSplashScreenPassed } from '../useProfileSplashScreens/useIsProfileSplashScreensPassed'

export const useProfileOrgAdminNominationSplashScreen = () => {
  const { acl, activeRole, profile } = useAuth()

  const isProfileSplashScreenPassed = useIsProfileSplashScreenPassed(
    Splash_Screens_Enum.OrganisationAdminNomination,
  )

  const isOrgAdminNominationSplashScreenEnabled = Boolean(
    acl.isUK() &&
      !isProfileSplashScreenPassed &&
      profile?.id &&
      activeRole &&
      [RoleName.BOOKING_CONTACT, RoleName.ORGANIZATION_KEY_CONTACT].includes(
        activeRole,
      ) &&
      profile.organizations.length,
  )

  const [{ data: orgs }] = useQuery<
    GetProfileOrgsWithDashboardLinkQuery,
    GetProfileOrgsWithDashboardLinkQueryVariables
  >({
    query: GET_PROFILE_ORGS_WITH_DASHBOARD_LINK,
    variables: {
      profileId: profile?.id ?? '',
    },
    pause: !isOrgAdminNominationSplashScreenEnabled,
  })

  const [, insertSubmissionOfSplashScreen] = useMutation<
    InsertSubmissionOfSplashScreenMutation,
    InsertSubmissionOfSplashScreenMutationVariables
  >(INSERT_SUBMISSION_OF_SPLASH_SCREEN)

  const insertSubmissionOfOrgAdminNominationSplashScreen =
    useCallback(async () => {
      if (!profile?.id) return

      return insertSubmissionOfSplashScreen({
        profileId: profile.id,
        splashScreen: Splash_Screens_Enum.OrganisationAdminNomination,
      })
    }, [insertSubmissionOfSplashScreen, profile?.id])

  return {
    isOrgAdminNominationSplashScreenEnabled:
      isOrgAdminNominationSplashScreenEnabled &&
      orgs?.organization_member.some(member =>
        Boolean(member.organization.external_dashboard_url),
      ),
    insertSubmissionOfOrgAdminNominationSplashScreen,
  }
}
