import React from 'react'
import { Route, Routes } from 'react-router-dom'

import useOrg, { ProfileType } from '@app/hooks/useOrg'
import { OrgDetailsTab } from '@app/pages/admin/components/Organizations/tabs/OrgDetailsTab'
import { Address, CourseLevel, OfstedRating } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render } from '@test/index'

jest.mock('@app/hooks/useOrg')

const useOrgMock = jest.mocked(useOrg)

describe('OrgDetailsTab', () => {
  useOrgMock.mockReturnValue({
    error: undefined,
    profilesByLevel: new Map<CourseLevel | null, []>(),
    mutate: () => Promise.resolve(undefined),
    status: LoadingStatus.SUCCESS,
    loading: false,
    data: [
      {
        id: '1',
        createdAt: new Date('2020-01-01 00:00:00').toISOString(),
        updatedAt: new Date('2020-01-01 00:00:00').toISOString(),
        name: 'test org',
        tags: [],
        contactDetails: [],
        preferences: {},
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
        trustName: 'test trust',
      },
    ],
    stats: {
      '1': {
        profiles: {
          count: 0,
        },
        certificates: {
          active: { count: 0, enrolled: 0 },
          expiringSoon: { count: 0, enrolled: 0 },
          expired: { count: 0, enrolled: 0 },
        },
        pendingInvites: {
          count: 0,
        },
      },
    },
    profiles: [],
    profilesByOrg: new Map<string, ProfileType[]>(),
  })

  it('matches snapshot', async () => {
    const view = render(
      <Routes>
        <Route path="/" element={<OrgDetailsTab orgId="1" />} />
      </Routes>,
      {},
      { initialEntries: ['/'] }
    )

    expect(view).toMatchSnapshot()
  })
})
