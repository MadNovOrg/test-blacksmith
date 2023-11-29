import { useTheme } from '@mui/material'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import {
  InsertOrgMutation,
  InsertOrgMutationVariables,
} from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { MUTATION } from '@app/queries/organization/insert-org'
import { Address } from '@app/types'

import { OrganizationForm } from './OrganizationForm'
import { FormInputs } from './shared'

export const CreateOrganization = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [
    { data: organisationData, fetching: loading, error },
    executeMutation,
  ] = useMutation<InsertOrgMutation, InsertOrgMutationVariables>(MUTATION)
  const [xeroId, setXeroId] = useState<string>()

  const handleSubmit = async (data: FormInputs) => {
    const organisationDataObject = {
      name: data.name,
      sector: data.sector,
      organisationType: data.organisationType as string,
      attributes: {
        email: data.orgEmail,
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
    await executeMutation(organisationDataObject).finally(() =>
      navigate(`../${organisationData?.org?.id}`)
    )
  }
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
        error={error}
        loading={loading}
      />
    </FullHeightPageLayout>
  )
}
