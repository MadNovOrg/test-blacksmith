import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  CancelCourseInviteMutation,
  Course_Invite_Status_Enum,
  GetCourseInvitesQuery,
  SendCourseInvitesMutation,
} from '@app/generated/graphql'
import { buildCourse } from '@app/modules/course/pages/CourseBuilder/test-utils'
import { AwsRegions, Course, RoleName } from '@app/types'

import { chance, render, renderHook, screen, userEvent } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import { InvitesTab } from './InvitesTab'

describe.each([AwsRegions.Australia, AwsRegions.UK])(InvitesTab.name, () => {
  vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const allowedRoles = [
    RoleName.TT_ADMIN,
    RoleName.TT_OPS,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
  ]
  it('should render component with invites in it', () => {
    const inviteeEmail = chance.email()
    render(
      <InvitesTab
        course={{} as Course}
        inviteStatus={Course_Invite_Status_Enum.Accepted}
        invitesData={[
          {
            id: chance.guid(),
            email: inviteeEmail,
            expiresIn: chance.date(),
            status: Course_Invite_Status_Enum.Pending,
            createdAt: chance.date(),
          },
        ]}
      />,
    )
    expect(screen.getByText(inviteeEmail)).toBeInTheDocument()
  })
  it.each(allowedRoles)('should render action buttons for %s', role => {
    const invites = [
      {
        id: chance.guid(),
        email: chance.email(),
        expiresIn: chance.date(),
        status: Course_Invite_Status_Enum.Pending,
        createdAt: chance.date(),
      },
    ]
    const client = {
      executeQuery: () =>
        fromValue<GetCourseInvitesQuery>({
          courseInvites: [...invites],
          courseInvitesAggregate: {
            aggregate: {
              count: 1,
            },
          },
        }),
    } as unknown as Client

    const organization = buildOrganization({
      overrides: {
        name: 'My Org',
      },
    })
    const course = buildCourse({
      organization,
    })
    render(
      <Provider value={client}>
        <InvitesTab
          course={course as unknown as Course}
          inviteStatus={Course_Invite_Status_Enum.Accepted}
          invitesData={invites}
        />
      </Provider>,
      {
        auth: {
          activeRole: role,
        },
      },
    )
    expect(
      screen.getByText(t('pages.course-participants.cancel-invite')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(t('pages.course-participants.resend-invite')),
    ).toBeInTheDocument()
  })
  it.each(allowedRoles)('handles invitations resend as %s', async role => {
    const inviteId = chance.guid()
    const client = {
      executeQuery: vi.fn(),
      executeMutation: vi.fn(),
    }
    client.executeMutation.mockReturnValue(() => {
      fromValue<{ data: SendCourseInvitesMutation }>({
        data: {
          insert_course_invites: {
            returning: [
              {
                id: chance.guid(),
              },
            ],
          },
        },
      })
    })
    render(
      <Provider value={client as unknown as Client}>
        <InvitesTab
          course={buildCourse() as unknown as Course}
          inviteStatus={Course_Invite_Status_Enum.Accepted}
          invitesData={[
            {
              id: inviteId,
              email: chance.email(),
              expiresIn: chance.date(),
              status: Course_Invite_Status_Enum.Pending,
              createdAt: chance.date(),
            },
          ]}
        />
      </Provider>,
      {
        auth: {
          activeRole: role,
        },
      },
    )

    const resendButton = screen.getByTestId(
      `course-resend-invite-btn-${inviteId}`,
    )
    expect(resendButton).toBeInTheDocument()
    await userEvent.click(resendButton)
    expect(client.executeMutation).toHaveBeenCalledTimes(1)
  })
  it.each(allowedRoles)('handles invitations cancel as %s', async role => {
    const inviteId = chance.guid()
    const client = {
      executeQuery: vi.fn(),
      executeMutation: vi.fn(),
    }
    client.executeMutation.mockReturnValue(() => {
      fromValue<{ data: CancelCourseInviteMutation }>({
        data: {
          update_course_invites_by_pk: {
            id: chance.guid(),
          },
        },
      })
    })
    render(
      <Provider value={client as unknown as Client}>
        <InvitesTab
          course={buildCourse() as unknown as Course}
          inviteStatus={Course_Invite_Status_Enum.Accepted}
          invitesData={[
            {
              id: inviteId,
              email: chance.email(),
              expiresIn: chance.date(),
              status: Course_Invite_Status_Enum.Pending,
              createdAt: chance.date(),
            },
          ]}
        />
      </Provider>,
      {
        auth: {
          activeRole: role,
        },
      },
    )

    const cancelButton = screen.getByTestId(
      `course-cancel-invite-btn-${inviteId}`,
    )
    expect(cancelButton).toBeInTheDocument()
    await userEvent.click(cancelButton)
    expect(client.executeMutation).toHaveBeenCalledTimes(1)
  })
})
