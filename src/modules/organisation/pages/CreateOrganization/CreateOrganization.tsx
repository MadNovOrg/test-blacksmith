import { useTheme } from '@mui/material'
import { useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  InsertOrgMutation,
  InsertOrgMutationVariables,
} from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { MUTATION } from '@app/queries/organization/insert-org'
import { Address } from '@app/types'

import { OrganizationForm } from '../../components/OrganizationForm'
import { FormInputs } from '../../utils'

export const CreateOrganization = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const { t } = useTranslation()
  const { isUKCountry } = useWorldCountries()

  const [{ fetching: loading, error }, executeMutation] = useMutation<
    InsertOrgMutation,
    InsertOrgMutationVariables
  >(MUTATION)
  const [xeroId, setXeroId] = useState<string>()
  const [otherOrgType, setOtherOrgType] = useState<boolean>(false)

  const handleSubmit = useCallback(
    async (data: FormInputs) => {
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
      }
      const response = await executeMutation(organisationDataObject)

      if (response.data) {
        navigate(`../${response.data.org?.id}`)
      }
    },
    [executeMutation, isUKCountry, navigate, otherOrgType, xeroId]
  )

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Helmet>
        <title>
          {t('pages.browser-tab-titles.organisations.new-organisation')}
        </title>
      </Helmet>
      <OrganizationForm
        onSubmit={handleSubmit}
        setXeroId={setXeroId}
        setOtherOrgType={setOtherOrgType}
        error={error}
        loading={loading}
      />
    </FullHeightPageLayout>
  )
}
