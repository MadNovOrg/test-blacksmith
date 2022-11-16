import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { OrgUsersTable } from '@app/components/OrgUsersTable/index'
import { useOrgUsers } from '@app/hooks/useOrgUsers'
import { Organization } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render } from '@test/index'

jest.mock('@app/hooks/useOrgUsers')

const useOrgUsersMock = jest.mocked(useOrgUsers)

describe('OrgUsersTable', () => {
  useOrgUsersMock.mockReturnValue({
    mutate: () => Promise.resolve(undefined),
    status: LoadingStatus.SUCCESS,
    loading: false,
    totalCount: 2,
    error: undefined,
    users: [
      {
        id: '1',
        isAdmin: false,
        createdAt: new Date('2022-04-10T10:00:00').toISOString(),
        updatedAt: new Date('2022-04-10T10:00:00').toISOString(),
        profile: {
          id: '1',
          createdAt: new Date('2022-04-10T10:00:00').toISOString(),
          givenName: 'Given name 1',
          familyName: 'Family name 1',
          fullName: 'Given name 1 Family name 1',
          title: 'Title 1',
          addresses: [],
          attributes: [],
          contactDetails: [],
          email: 'profile1@org.com',
          avatar: 'avatar 1',
          phone: 'phone 1',
          dob: '2000-01-01',
          jobTitle: 'title 1',
          tags: null,
          preferences: [],
          roles: [],
          trainer_role_types: [],
          organizations: [],
          dietaryRestrictions: null,
          disabilities: null,
          lastActivity: new Date('2022-04-10T10:00:00'),
          activeCertificates: {
            aggregate: {
              count: 0,
            },
          },
        },
        organization: {} as Organization,
      },
      {
        id: '2',
        isAdmin: true,
        createdAt: new Date('2022-04-10T10:00:00').toISOString(),
        updatedAt: new Date('2022-04-10T10:00:00').toISOString(),
        profile: {
          id: '2',
          createdAt: new Date('2022-04-10T10:00:00').toISOString(),
          givenName: 'Given name 2',
          familyName: 'Family name 2',
          fullName: 'Given name 2 Family name 2',
          title: 'Title 2',
          addresses: [],
          attributes: [],
          contactDetails: [],
          email: 'profile2@org.com',
          avatar: 'avatar 2',
          phone: 'phone 2',
          dob: '2000-01-01',
          jobTitle: 'title 2',
          tags: null,
          preferences: [],
          roles: [],
          trainer_role_types: [],
          organizations: [],
          dietaryRestrictions: null,
          disabilities: null,
          lastActivity: new Date('2022-04-10T10:00:00'),
          activeCertificates: {
            aggregate: {
              count: 1,
            },
          },
        },
        organization: {} as Organization,
      },
    ],
  })

  it('matches snapshot', async () => {
    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<OrgUsersTable orgId="1" />} />
        </Routes>
      </MemoryRouter>
    )

    expect(view).toMatchSnapshot()
  })
})
