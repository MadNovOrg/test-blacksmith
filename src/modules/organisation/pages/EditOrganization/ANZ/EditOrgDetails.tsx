import { Box } from '@mui/material'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  UpdateOrgMutation,
  UpdateOrgMutationVariables,
} from '@app/generated/graphql'
import { OrganizationForm } from '@app/modules/organisation/components/OrganizationForm/ANZ'
import useOrgV2 from '@app/modules/organisation/hooks/ANZ/useOrgV2'
import { UPDATE_ORG_MUTATION } from '@app/modules/organisation/queries/update-org'
import { FormInputs } from '@app/modules/organisation/utils/ANZ'

export const EditOrgDetails: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { profile, acl } = useAuth()

  const [{}, updateOrganisation] = useMutation<
    UpdateOrgMutation,
    UpdateOrgMutationVariables
  >(UPDATE_ORG_MUTATION)
  const { id } = useParams()
  const navigate = useNavigate()
  const { data } = useOrgV2({
    orgId: id ?? '',
    profileId: profile?.id,
    showAll: acl.canViewAllOrganizations(),
    withAffiliatedOrganisationsCount: true,
  })

  const org = data?.orgs.length
    ? Object.values(data.orgs).map(orgDetail => ({
        name: orgDetail.name,
        sector: orgDetail.sector,
        orgPhone: orgDetail.attributes.phone,
        organisationType: orgDetail.organisationType as string,
        orgEmail: orgDetail.attributes.email,
        website: orgDetail.attributes.website,
        addressLine1: orgDetail.address.line1,
        addressLine2: orgDetail.address.line2,
        city: orgDetail.address.city,
        postcode: orgDetail.address.postCode,
        country: orgDetail.address.country,
        countryCode: orgDetail.address.countryCode,
        headFirstName: orgDetail.attributes.headFirstName,
        headSurname:
          orgDetail.attributes.headSurname ?? orgDetail.attributes.headLastName,
        headEmailAddress: orgDetail.attributes.headEmailAddress,
        settingName:
          orgDetail.attributes.settingName ??
          orgDetail.attributes.headPreferredJobTitle,
        main_organisation_id: orgDetail.main_organisation?.id,
        affiliatedOrgCount:
          orgDetail.affiliated_organisations_aggregate?.aggregate?.count,
        mainOrgName: orgDetail?.main_organisation?.name,
        region: orgDetail.address.region,
      }))[0]
    : null

  const onSubmit = useCallback(
    async (data: FormInputs) => {
      if (!id) return
      const orgDataToBeUpdated = {
        id,
        org: {
          name: data.name.trim(),
          sector: data.sector,
          main_organisation_id: data.mainOrgId,
          organisationType:
            data.organisationType?.toLocaleLowerCase() === 'other'
              ? data.orgTypeSpecifyOther
              : data.organisationType,
          attributes: {
            email: data.orgEmail.toLowerCase(),
            phone: data.orgPhone,
            headFirstName: data.headFirstName,
            headSurname: data.headSurname,
            headEmailAddress: data.headEmailAddress,
            settingName: data.settingName,
            website: data.website,
          },
          address: {
            line1: data.addressLine1,
            line2: data.addressLine2,
            city: data.city,
            country: data.country,
            countryCode: data.countryCode,
            postCode: data.postcode,
            region: data.region,
          },
        },
      }
      await updateOrganisation(orgDataToBeUpdated)
      navigate('..?tab=DETAILS')
    },
    [id, navigate, updateOrganisation],
  )

  if (!org) return null

  return (
    <Box bgcolor="grey.100" pb={6} pt={3}>
      <OrganizationForm onSubmit={onSubmit} isEditMode editOrgData={org} />
    </Box>
  )
}
