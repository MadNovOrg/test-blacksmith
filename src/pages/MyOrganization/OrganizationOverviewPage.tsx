import React from 'react'
import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import { CircularProgress } from '@mui/material'

import { useAuth } from '@app/context/auth'

import { Address, ContactDetail } from '@app/types'
import { getOrganizationWithKeyContacts } from '@app/queries/organization'

type OrganizationOverviewPageProps = unknown

export const OrganizationOverviewPage: React.FC<
  OrganizationOverviewPageProps
> = () => {
  const auth = useAuth()
  const { t } = useTranslation()

  const orgs =
    auth.claims &&
    JSON.parse(
      '[' +
        auth.claims['x-hasura-tt-organizations'].slice(
          1,
          auth.claims['x-hasura-tt-organizations'].length - 1
        ) +
        ']'
    )
  console.log(orgs)

  const { data, error } = useSWR(
    auth?.claims ? [getOrganizationWithKeyContacts, { id: orgs[0] }] : null
  )

  const renderLocation = (org: { addresses: [Address] }) => {
    const physical = org.addresses.find(address => address.type === 'physical')
    return physical
      ? [
          physical.line1,
          physical.line2,
          physical.city,
          physical.state,
          physical.postCode,
          physical.country,
        ]
          .filter(Boolean)
          .join(', ')
      : ''
  }

  return (
    <div className="px-8">
      <div className="pb-8 font-light text-2xl sm:text-4xl">
        {t('pages.my-organization.overview.title')}
      </div>
      {error && (
        <div className="border-red/20 border rounded bg-red/10 text-red/80 font-bold p-2">
          {t('internal-error')}
        </div>
      )}
      {data &&
        !data.organization &&
        t('pages.my-organization.overview.no-org-assigned')}
      {data?.organization && (
        <div className="grid grid-rows-5 grid-flow-col gap-4">
          <div>
            <div className="font-bold text-sm">
              {t('pages.my-organization.overview.organization-name')}:
            </div>
            <div>{data.organization.name}</div>
          </div>
          <div>
            <div className="font-bold text-sm">
              {t('pages.my-organization.overview.location')}:
            </div>
            <div>{renderLocation(data.organization)}</div>
          </div>
          <div>
            <div className="font-bold text-sm">
              {t('pages.my-organization.overview.contact-name')}:
            </div>
            <div>{data.organization.members[0]?.profile.fullName}</div>
          </div>
          <div>
            <div className="font-bold text-sm">
              {t('pages.my-organization.overview.contact-email')}:
            </div>
            <div>
              {
                data.organization.members[0]?.profile.contactDetails.find(
                  (contactDetail: ContactDetail) =>
                    contactDetail.type === 'email'
                )?.value
              }
            </div>
          </div>
          <div>
            <div className="font-bold text-sm">
              {t('pages.my-organization.overview.contact-number')}:
            </div>
            <div>
              {
                data.organization.members[0]?.profile.contactDetails.find(
                  (contactDetail: ContactDetail) =>
                    contactDetail.type === 'phone'
                )?.value
              }
            </div>
          </div>
        </div>
      )}
      {!data && !error && (
        <div className="w-full h-full">
          <CircularProgress />
        </div>
      )}
    </div>
  )
}
