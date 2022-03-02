import React, { useState } from 'react'
import useSWR from 'swr'
import { CircularProgress } from '@mui/material'

import { getProfileWithCriteria } from '@app/queries/users'
import { Profile } from '@app/types'

function Trainers() {
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
  })
  const { data } = useSWR<{
    profiles: Profile[]
    profile_aggregate: {
      aggregate: {
        count: number
      }
    }
  }>([
    getProfileWithCriteria,
    {
      ...pagination,
      where: {
        roles: {
          role: {
            name: { _eq: 'Presenter' },
          },
        },
      },
    },
  ])

  if (!data) {
    return (
      <div className="w-full h-full">
        <CircularProgress />
      </div>
    )
  }

  console.log(data)

  return (
    <>
      <div className="bg-white pb-4 border-b border-gray-100">
        <div className="flex justify-between flex-wrap sm:flex-nowrap">
          <div className="">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Trainers
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are{' '}
              {new Intl.NumberFormat().format(
                data.profile_aggregate.aggregate.count
              )}{' '}
              trainers
            </p>
          </div>
          <div className="flex-shrink-0">
            <button type="button" className="btn primary">
              Create new organization
            </button>
          </div>
        </div>
      </div>
      <div className="pb-4 flex-1 overflow-hidden">
        <div className="overflow-scroll space-y-4 pt-2 divide-y divide-gray-100">
          {data.profiles.map(profile => (
            <div key={profile.id} className="flex pt-4">
              <div className="flex-1">
                <h4>
                  {profile.givenName} {profile.familyName}
                </h4>
              </div>
              <div>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                    {profile.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <nav
        className="bg-white py-3 flex items-center justify-between border-t border-gray-200"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{pagination.offset + 1}</span>{' '}
            to <span className="font-medium">{pagination.limit}</span> of{' '}
            <span className="font-medium">
              {new Intl.NumberFormat().format(
                data.profile_aggregate.aggregate.count
              )}
            </span>{' '}
            results
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <button
            type="button"
            className="btn tertiary"
            disabled={pagination.offset === 0}
            onClick={() =>
              setPagination({
                ...pagination,
                offset: pagination.offset - pagination.limit,
              })
            }
          >
            Previous
          </button>
          <button
            type="button"
            className="btn tertiary ml-3"
            onClick={() =>
              setPagination({
                ...pagination,
                offset: pagination.offset + pagination.limit,
              })
            }
          >
            Next
          </button>
        </div>
      </nav>
    </>
  )
}

export default Trainers
