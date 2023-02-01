import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { OrgInvitesTable } from '@app/components/OrgInvitesTable/index'
import { useOrgInvites } from '@app/hooks/useOrgInvites'
import { InviteStatus } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render } from '@test/index'

jest.mock('@app/hooks/useOrgInvites')

const useOrgInvitesMock = jest.mocked(useOrgInvites)

describe('OrgInvitesTable', () => {
  useOrgInvitesMock.mockReturnValue({
    mutate: () => Promise.resolve(undefined),
    status: LoadingStatus.SUCCESS,
    loading: false,
    totalCount: 2,
    error: undefined,
    cancel: jest.fn(),
    resend: jest.fn(),
    invites: [
      {
        id: '1',
        createdAt: new Date('2022-04-10T10:00:00').toISOString(),
        updatedAt: new Date('2022-04-10T10:00:00').toISOString(),
        email: 'email1@org.com',
        status: InviteStatus.PENDING,
        organization: {
          id: 'org-1',
          name: 'org-1',
        },
        isAdmin: false,
      },
      {
        id: '2',
        createdAt: new Date('2022-04-10T10:00:00').toISOString(),
        updatedAt: new Date('2022-04-10T10:00:00').toISOString(),
        email: 'email2@org.com',
        status: InviteStatus.DECLINED,
        organization: {
          id: 'org-1',
          name: 'org-1',
        },
        isAdmin: true,
      },
    ],
  })

  it('matches snapshot', async () => {
    const view = render(
      <Routes>
        <Route path="/" element={<OrgInvitesTable orgId="1" />} />
      </Routes>,
      {},
      { initialEntries: ['/'] }
    )

    expect(view).toMatchSnapshot()
  })
})
