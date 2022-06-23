import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import useOrg from '@app/hooks/useOrg'
import { EditOrgDetails } from '@app/pages/admin/components/Organizations/EditOrgDetails'
import { Address, OfstedRating, TrustType } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render } from '@test/index'

jest.mock('@app/hooks/useOrg')

const useOrgMock = jest.mocked(useOrg)

describe('EditOrgDetails', () => {
  useOrgMock.mockReturnValue({
    mutate: () => Promise.resolve(undefined),
    status: LoadingStatus.SUCCESS,
    data: {
      id: '1',
      createdAt: new Date('2020-01-01 00:00:00').toISOString(),
      updatedAt: new Date('2020-01-01 00:00:00').toISOString(),
      name: 'test org',
      tags: [],
      contactDetails: [],
      members_aggregate: {},
      preferences: {},
      region: '',
      address: {
        line1: 'line 1',
        line2: 'line 2',
        city: 'test city',
        state: 'test state',
        postCode: 'some postcode',
        country: 'test country',
      } as Address,
      attributes: {
        email: 'test@email.com',
        ofstedRating: OfstedRating.INADEQUATE,
        ofstedLastInspection: new Date('2022-01-01 00:00:00').toISOString(),
        localAuthority: 'test authority',
        headFirstName: 'test first name',
        headLastName: 'test last name',
        headTitle: 'test title',
        headPreferredJobTitle: 'test job title',
        website: 'whatever.com',
      },
      sector: 'test sector',
      trustType: TrustType.SINGLE_ACADEMY_TRUST,
      trustName: 'test trust',
      usersCount: {
        aggregate: {
          count: 20,
        },
      },
      invitesCount: {
        aggregate: {
          count: 0,
        },
      },
    },
  })

  it('matches snapshot', async () => {
    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<EditOrgDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(view).toMatchSnapshot()
  })
})
