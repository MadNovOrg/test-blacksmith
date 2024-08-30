import { Box } from '@mui/material'
import { isValid } from 'date-fns'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useAuth } from '@app/context/auth'
import {
  UpdateOrgMutation,
  UpdateOrgMutationVariables,
} from '@app/generated/graphql'
import useOrgV2 from '@app/modules/organisation/hooks/useOrgV2'
import { UPDATE_ORG_MUTATION } from '@app/modules/organisation/queries/update-org'

import { OrganizationForm as ANZOrganisationForm } from '../../components/OrganizationForm/ANZ'
import { OrganizationForm as UKOrganisationForm } from '../../components/OrganizationForm/UK'
import { FormInputs as ANZFormInputs } from '../../utils/ANZ'
import { FormInputs as UKFormInputs } from '../../utils/UK'

export const EditOrgDetails: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { profile, acl } = useAuth()
  const { isUKCountry } = useWorldCountries()
  const isUKRegion = acl.isUK()

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
    withDfEEstablishment: isUKRegion,
  })

  const org = data?.orgs.length
    ? Object.values(data.orgs).map(orgDetail => ({
        dfeEstablishment: orgDetail.dfeEstablishment,
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
        localAuthority: orgDetail.attributes.localAuthority,
        ofstedRating: orgDetail.attributes.ofstedRating,
        ofstedLastInspection:
          orgDetail.attributes.ofstedLastInspection &&
          isValid(new Date(orgDetail.attributes.ofstedLastInspection))
            ? new Date(orgDetail?.attributes.ofstedLastInspection)
            : null,
        mainOrgId: orgDetail.main_organisation_id,
        mainOrgName: orgDetail?.main_organisation?.name,
        region: orgDetail.region,
      }))[0]
    : null

  const onSubmitUK = useCallback(
    async (data: UKFormInputs) => {
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
            headFirstName: data.headFirstName,
            headSurname: data.headSurname,
            headEmailAddress: data.headEmailAddress,
            settingName: data.settingName,
            website: data.website,
            ...(isUKCountry(data.countryCode)
              ? {
                  localAuthority: data.localAuthority,
                  ofstedRating: data.ofstedRating,
                  ofstedLastInspection: data.ofstedLastInspection
                    ? data.ofstedLastInspection.toISOString()
                    : null,
                }
              : {}),
          },
          address: {
            line1: data.addressLine1,
            line2: data.addressLine2,
            city: data.city,
            country: data.country,
            countryCode: data.countryCode,
            postCode: data.postcode,
          },
        },
      }
      await updateOrganisation(orgDataToBeUpdated)
      navigate('..?tab=DETAILS')
    },
    [id, isUKCountry, navigate, updateOrganisation],
  )

  const onSubmitANZ = useCallback(
    async (data: ANZFormInputs) => {
      if (!id) return
      const orgDataToBeUpdated = {
        id,
        org: {
          name: data.name.trim(),
          sector: data.sector,
          region: data.region,
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
      {isUKRegion ? (
        <UKOrganisationForm
          onSubmit={onSubmitUK}
          isEditMode
          editOrgData={org}
        />
      ) : (
        <ANZOrganisationForm
          onSubmit={onSubmitANZ}
          isEditMode
          editOrgData={org}
        />
      )}
    </Box>
  )
}
