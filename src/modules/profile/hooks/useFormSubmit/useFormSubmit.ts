import { useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import {
  GetProfileDetailsQuery,
  Profile_Role_Insert_Input,
  Profile_Trainer_Role_Type_Insert_Input,
} from '@app/generated/graphql'
import { RoleName, TrainerRoleTypeName } from '@app/types'

import { EditProfileInputs } from '../../pages/EditProfile/utils'
import { EmployeeRoleName } from '../../utils'
import useRoles from '../useRoles'
import useTrainerRoleTypes from '../useTrainerRoleTypes'
import { useUpdateProfile } from '../useUpdateProfile'

export const useFormSubmit = () => {
  const {
    updateProfile,
    updateOrgMember,
    updateProfileRoles,
    updateProfileTrainerRoles,
  } = useUpdateProfile()
  const { roles: systemRoles } = useRoles()
  const { trainerRoleTypes: systemTrainerRoleTypes } = useTrainerRoleTypes()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const orgId = searchParams.get('orgId')

  const { acl, reloadCurrentProfile } = useAuth()
  const canEditNamesAndDOB =
    acl.isTTAdmin() || acl.isTTOps() || acl.isSalesAdmin()

  const canEditRoles = acl.isTTAdmin() || acl.isTTOps()

  const updateIsAdmin = useCallback(
    async (orgAdmin: {
      id: string
      member: {
        isAdmin: boolean
      }
    }) => {
      await updateOrgMember(orgAdmin)
      await reloadCurrentProfile()
    },
    [updateOrgMember, reloadCurrentProfile],
  )

  const onSubmit = async ({
    data,
    isManualFormError,
    profile,
    values,
  }: {
    data: EditProfileInputs
    isManualFormError: boolean
    profile: GetProfileDetailsQuery['profile']
    values: EditProfileInputs
  }) => {
    try {
      if (!profile || isManualFormError) return
      const navigateBackPath = orgId ? `../?orgId=${orgId}` : '..'

      await updateProfile({
        input: {
          profileId: profile.id,
          avatar: data.avatar,
          ...(canEditNamesAndDOB
            ? {
                givenName: data.firstName,
                familyName: data.surname,
                dob: data.dob?.toISOString(),
              }
            : null),
          phone: data.phone,
          orgId: data.organization.id,
          jobTitle:
            data.jobTitle === 'Other' ? data.otherJobTitle : data.jobTitle,
          disabilities: data.disabilities,
          dietaryRestrictions: data.dietaryRestrictions,
          country: data.country,
          countryCode: data.countryCode,
          phoneCountryCode: data.phoneCountryCode ?? '',
          canAccessKnowledgeHub: acl.canManageKnowledgeHubAccess()
            ? data.canAccessKnowledgeHub
            : undefined,
        },
      })

      if (values.org?.length) {
        await Promise.all(
          values?.org.map(({ isAdmin, id }) =>
            updateIsAdmin({
              id,
              member: {
                isAdmin,
              },
            }),
          ),
        )
      }

      if (canEditRoles) {
        const updatedRoles: string[] = []
        const updatedTrainerRoles: unknown[] = []
        data.roles.forEach(obj => {
          if (obj.userRole === RoleName.TRAINER) {
            updatedTrainerRoles.push(
              obj.trainerRoles.trainerRole,
              obj.trainerRoles.BILDRole,
              obj.trainerRoles.moderatorRole
                ? TrainerRoleTypeName.MODERATOR
                : undefined,
            )
          }

          updatedRoles.push(
            obj.userRole,
            ...(obj.employeeRoles as EmployeeRoleName[]),
            ...(obj.salesRoles as RoleName[]),
          )
        })
        const filteredRoles = systemRoles?.reduce(
          (filteredRoles, systemRole) => {
            if (updatedRoles.find(role => role === systemRole.name)) {
              filteredRoles.push({
                role_id: systemRole.id,
                profile_id: profile.id,
              })
            }

            return filteredRoles
          },
          [] as Profile_Role_Insert_Input[],
        )

        const profilesIndividualSubRoles = profile.roles?.filter(roleData =>
          [
            RoleName.BOOKING_CONTACT,
            RoleName.ORGANIZATION_KEY_CONTACT,
          ].includes(roleData.role.name as RoleName),
        )

        profilesIndividualSubRoles?.forEach(roleData => {
          filteredRoles?.push({
            role_id: roleData.role.id,
            profile_id: profile.id,
          })
        })

        const filteredTrainerRoleTypes = systemTrainerRoleTypes?.reduce(
          (filteredTrainerRoleTypes, systemTrainerRoleType) => {
            if (
              updatedTrainerRoles
                .flat()
                .find(role => role === systemTrainerRoleType.name)
            ) {
              filteredTrainerRoleTypes.push({
                trainer_role_type_id: systemTrainerRoleType.id,
                profile_id: profile.id,
              })
            }
            return filteredTrainerRoleTypes
          },
          [] as Profile_Trainer_Role_Type_Insert_Input[],
        )

        await updateProfileRoles({
          id: profile?.id,
          roles: filteredRoles ?? [],
        })

        await updateProfileTrainerRoles({
          id: profile?.id,
          trainerRoleTypes: filteredTrainerRoleTypes ?? [],
        })
      }

      await reloadCurrentProfile()
      navigate(navigateBackPath, { replace: true })
    } catch (err) {
      return err
    }
  }
  return {
    onSubmit,
  }
}
