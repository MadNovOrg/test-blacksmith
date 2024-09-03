import { useTheme } from '@mui/material'
import { useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useAuth } from '@app/context/auth'
import {
  InsertOrgMutation,
  InsertOrgMutationVariables,
} from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { INSERT_ORGANISATION_MUTATION } from '@app/modules/organisation/queries/insert-org'
import { Address } from '@app/types'

import { OrganizationForm as ANZOrganisationForm } from '../../components/OrganizationForm/ANZ'
import { OrganizationForm as UKOrganisationForm } from '../../components/OrganizationForm/UK'
import { FormInputs as ANZFormInputs } from '../../utils/ANZ'
import { FormInputs as UKFormInputs } from '../../utils/UK'

export const CreateOrganization = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const { t } = useTranslation()
  const { acl } = useAuth()
  const isUKRegion = acl.isUK()
  const { isUKCountry } = useWorldCountries()

  const [{ fetching: loading, error }, executeMutation] = useMutation<
    InsertOrgMutation,
    InsertOrgMutationVariables
  >(INSERT_ORGANISATION_MUTATION)
  const [xeroId, setXeroId] = useState<string>()
  const [otherOrgType, setOtherOrgType] = useState<boolean>(false)

  const handleSubmitUKRegion = useCallback(
    async (data: UKFormInputs) => {
      const organisationDataObject = {
        name: data.name.trim(),
        sector: data.sector,
        organisationType: (!otherOrgType
          ? data.organisationType
          : data.orgTypeSpecifyOther) as string,
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
        } as Address,
        xeroId,
        invites: data.workEmail
          ? [
              {
                email: data.workEmail,
                isAdmin: true,
              },
            ]
          : [],
        dfeEstablishmentId: data.dfeId ?? undefined,
      }
      const response = await executeMutation(organisationDataObject)

      if (response.data) {
        navigate(`../${response.data.org?.id}`)
      }
    },
    [executeMutation, isUKCountry, navigate, otherOrgType, xeroId],
  )

  const handleSubmitANZRegion = useCallback(
    async (data: ANZFormInputs) => {
      const organisationDataObject = {
        name: data.name.trim(),
        sector: data.sector,
        mainOrgId: data.mainOrgId,
        organisationType: (!otherOrgType
          ? data.organisationType
          : data.orgTypeSpecifyOther) as string,
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
        } as Address,
        xeroId,
        invites: data.workEmail
          ? [
              {
                email: data.workEmail,
                isAdmin: true,
              },
            ]
          : [],
      }
      const response = await executeMutation(organisationDataObject)

      if (response.data) {
        navigate(`../${response.data.org?.id}`)
      }
    },
    [executeMutation, navigate, otherOrgType, xeroId],
  )

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Helmet>
        <title>
          {t('pages.browser-tab-titles.organisations.new-organisation')}
        </title>
      </Helmet>
      {isUKRegion ? (
        <UKOrganisationForm
          onSubmit={handleSubmitUKRegion}
          setXeroId={setXeroId}
          setOtherOrgType={setOtherOrgType}
          error={error}
          loading={loading}
        />
      ) : (
        <ANZOrganisationForm
          onSubmit={handleSubmitANZRegion}
          setXeroId={setXeroId}
          setOtherOrgType={setOtherOrgType}
          error={error}
          loading={loading}
        />
      )}
    </FullHeightPageLayout>
  )
}
