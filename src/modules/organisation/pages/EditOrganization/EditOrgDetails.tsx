import { Box } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  UpdateOrgMutation,
  UpdateOrgMutationVariables,
} from '@app/generated/graphql'
import useOrgV2 from '@app/modules/organisation/hooks/useOrgV2'
import { MUTATION as UPDATE_ORG_MUTATION } from '@app/queries/organization/update-org'

import { OrganizationForm } from '../../components/OrganizationForm'
import { FormInputs } from '../../utils'

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
        headFirstName: orgDetail.attributes.headFirstName,
        headSurname: orgDetail.attributes.headSurname,
        headEmailAddress: orgDetail.attributes.headEmailAddress,
        settingName: orgDetail.attributes.settingName,
        localAuthority: orgDetail.attributes.localAuthority,
        ofstedRating: orgDetail.attributes.ofstedRating,
        ofstedLastInspection: orgDetail.attributes.ofstedLastInspection
          ? new Date(orgDetail?.attributes.ofstedLastInspection)
          : null,
      }))[0]
    : null

  const onSubmit = async (data: FormInputs) => {
    if (!id) return
    const orgDataToBeUpdated = {
      id,
      org: {
        name: data.name.trim(),
        sector: data.sector,
        organisationType:
          data.organisationType?.toLocaleLowerCase() === 'other'
            ? data.orgTypeSpecifyOther
            : data.organisationType,
        attributes: {
          email: data.orgEmail.toLowerCase(),
          phone: data.orgPhone,
          localAuthority: data.localAuthority,
          ofstedRating: data.ofstedRating,
          ofstedLastInspection: data.ofstedLastInspection
            ? data.ofstedLastInspection.toISOString()
            : null,
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
          postCode: data.postcode,
        },
      },
    }
    await updateOrganisation(orgDataToBeUpdated)
    navigate('..?tab=DETAILS')
  }

  if (!org) return null

  return (
    <Box bgcolor="grey.100" pb={6} pt={3}>
      <OrganizationForm onSubmit={onSubmit} isEditMode editOrgData={org} />
    </Box>
  )
}
