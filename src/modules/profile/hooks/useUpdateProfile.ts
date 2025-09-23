import { useMutation } from 'urql'

import {
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  UpdateProfileRolesMutation,
  UpdateProfileRolesMutationVariables,
  UpdateTrainerRoleTypeMutation,
  UpdateTrainerRoleTypeMutationVariables,
  UpdateOrgMemberMutation,
  UpdateOrgMemberMutationVariables,
  RemoveOrgMemberMutation,
  RemoveOrgMemberMutationVariables,
  UpdateTrainerAgreementTypesMutation,
  UpdateTrainerAgreementTypesMutationVariables,
} from '@app/generated/graphql'

import { REMOVE_ORG_MEMBER_MUTATION } from '../queries/remove-org-member'
import { UPDATE_ORG_MEMBER_MUTATION } from '../queries/update-org-member'
import { UPDATE_PROFILE_MUTATION } from '../queries/update-profile'
import { UPDATE_PROFILE_ROLES_MUTATION } from '../queries/update-profile-roles'
import { UPDATE_PROFILE_TRAINER_AGREEMENT_TYPES } from '../queries/update-trainer-agreement-types'
import { UPDATE_PROFILE_TRAINER_ROLE_TYPES } from '../queries/update-trainer-role-types'

export const useUpdateProfile = () => {
  const [{ fetching: updateProfileFetching }, updateProfile] = useMutation<
    UpdateProfileMutation,
    UpdateProfileMutationVariables
  >(UPDATE_PROFILE_MUTATION)
  const [{ fetching: updateProfileRolesFetching }, updateProfileRoles] =
    useMutation<
      UpdateProfileRolesMutation,
      UpdateProfileRolesMutationVariables
    >(UPDATE_PROFILE_ROLES_MUTATION)
  const [{ fetching: updateTrainerRolesFetching }, updateProfileTrainerRoles] =
    useMutation<
      UpdateTrainerRoleTypeMutation,
      UpdateTrainerRoleTypeMutationVariables
    >(UPDATE_PROFILE_TRAINER_ROLE_TYPES)
  const [{ fetching: updateOrgMemberFetching }, updateOrgMember] = useMutation<
    UpdateOrgMemberMutation,
    UpdateOrgMemberMutationVariables
  >(UPDATE_ORG_MEMBER_MUTATION)
  const [{ fetching: removeOrgMemberFetching }, removeOrgMember] = useMutation<
    RemoveOrgMemberMutation,
    RemoveOrgMemberMutationVariables
  >(REMOVE_ORG_MEMBER_MUTATION)
  const [
    { fetching: updateTrainerAgreementTypesFetching },
    updateTrainerAgreementTypes,
  ] = useMutation<
    UpdateTrainerAgreementTypesMutation,
    UpdateTrainerAgreementTypesMutationVariables
  >(UPDATE_PROFILE_TRAINER_AGREEMENT_TYPES)

  return {
    updateProfile,
    updateProfileRoles,
    updateProfileTrainerRoles,
    updateOrgMember,
    removeOrgMember,
    updateTrainerAgreementTypes,
    updateProfileFetching,
    updateProfileRolesFetching,
    updateTrainerRolesFetching,
    updateOrgMemberFetching,
    removeOrgMemberFetching,
    updateTrainerAgreementTypesFetching,
  }
}
