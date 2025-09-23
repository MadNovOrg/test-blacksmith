import { useTranslation } from 'react-i18next'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import {
  CancelCourseInviteMutation,
  Course_Invite_Status_Enum,
  Course_Status_Enum,
  Course_Type_Enum,
  GetCourseInvitesQuery,
  SendCourseInvitesMutation,
} from '@app/generated/graphql'
import { buildCourse } from '@app/modules/course/pages/CourseBuilder/test-utils'
import { AwsRegions, Course, RoleName } from '@app/types'

import { chance, _render, renderHook, screen, userEvent } from '@test/index'
import { buildOrganization, buildProfile } from '@test/mock-data-utils'

import {
  CANCEL_COURSE_INVITE,
  SEND_COURSE_INVITES,
} from '../../hooks/useCourseInvites/useCourseInvites'

import { InvitesTab } from './InvitesTab'

describe.each([AwsRegions.Australia, AwsRegions.UK])(
  InvitesTab.name,
  region => {
    vi.stubEnv('VITE_AWS_REGION', region)
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
    it('should _render component with invites in it', () => {
      const inviteeEmail = chance.email()
      _render(
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
    it.each(allowedRoles)('should _render action buttons for %s', role => {
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
      _render(
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
      _render(
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
      _render(
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

    it('shows component to org key contact', async () => {
      const inviteeEmail = chance.email()
      const inviteId = chance.guid()
      const currentUser = buildProfile()
      currentUser.roles = [
        {
          role: {
            id: chance.guid(),
            name: RoleName.ORGANIZATION_KEY_CONTACT,
          },
        },
      ]
      const invites = [
        {
          id: inviteId,
          email: inviteeEmail,
          expiresIn: chance.date(),
          status: Course_Invite_Status_Enum.Pending,
          createdAt: chance.date(),
        },
      ]
      const client = {
        executeQuery: () => {
          fromValue<GetCourseInvitesQuery>({
            courseInvites: [...invites],
            courseInvitesAggregate: {
              aggregate: {
                count: 1,
              },
            },
          })
        },
        executeMutation: vi.fn(),
      }

      client.executeMutation.mockReturnValue(
        ({ mutation }: { mutation: TypedDocumentNode }) => {
          if (mutation === SEND_COURSE_INVITES) {
            return fromValue<{ data: SendCourseInvitesMutation }>({
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
          } else if (mutation === CANCEL_COURSE_INVITE) {
            return fromValue<{ data: CancelCourseInviteMutation }>({
              data: {
                update_course_invites_by_pk: {
                  id: chance.guid(),
                },
              },
            })
          }
        },
      )

      const organization = buildOrganization({
        overrides: {
          name: 'My Org',
        },
      })
      const course = buildCourse({
        organization,
        type: Course_Type_Enum.Indirect,
      }) as unknown as Course
      course.organizationKeyContactProfileId = currentUser.id
      _render(
        <Provider value={client as unknown as Client}>
          <InvitesTab
            course={course as unknown as Course}
            inviteStatus={Course_Invite_Status_Enum.Accepted}
            invitesData={invites}
          />
        </Provider>,
        {
          auth: {
            activeRole: RoleName.ORGANIZATION_KEY_CONTACT,
            profile: currentUser,
            allowedRoles: new Set([
              RoleName.ORGANIZATION_KEY_CONTACT,
              RoleName.BOOKING_CONTACT,
            ]),
          },
        },
      )
      // Check component is displayed correctly
      expect(screen.getByText(inviteeEmail)).toBeInTheDocument()
      expect(
        screen.getByText(t('pages.course-participants.cancel-invite')),
      ).toBeInTheDocument()
      expect(
        screen.getByText(t('pages.course-participants.resend-invite')),
      ).toBeInTheDocument()

      // Check resend button work
      const resendButton = screen.getByTestId(
        `course-resend-invite-btn-${inviteId}`,
      )
      expect(resendButton).toBeInTheDocument()
      await userEvent.click(resendButton)
      expect(client.executeMutation).toHaveBeenCalledTimes(1)

      // Check cancel button work
      const cancelButton = screen.getByTestId(
        `course-cancel-invite-btn-${inviteId}`,
      )
      expect(cancelButton).toBeInTheDocument()
      await userEvent.click(cancelButton)
      expect(client.executeMutation).toHaveBeenCalledTimes(2) // 1 for resend and 1 for cancel
    })

    it('shows component to booking contact', async () => {
      const inviteeEmail = chance.email()
      const inviteId = chance.guid()
      const currentUser = buildProfile()
      currentUser.roles = [
        {
          role: {
            id: chance.guid(),
            name: RoleName.BOOKING_CONTACT,
          },
        },
      ]
      const invites = [
        {
          id: inviteId,
          email: inviteeEmail,
          expiresIn: chance.date(),
          status: Course_Invite_Status_Enum.Pending,
          createdAt: chance.date(),
        },
      ]
      const client = {
        executeQuery: () => {
          fromValue<GetCourseInvitesQuery>({
            courseInvites: [...invites],
            courseInvitesAggregate: {
              aggregate: {
                count: 1,
              },
            },
          })
        },
        executeMutation: vi.fn(),
      }

      client.executeMutation.mockReturnValue(
        ({ mutation }: { mutation: TypedDocumentNode }) => {
          if (mutation === SEND_COURSE_INVITES) {
            return fromValue<{ data: SendCourseInvitesMutation }>({
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
          } else if (mutation === CANCEL_COURSE_INVITE) {
            return fromValue<{ data: CancelCourseInviteMutation }>({
              data: {
                update_course_invites_by_pk: {
                  id: chance.guid(),
                },
              },
            })
          }
        },
      )

      const organization = buildOrganization({
        overrides: {
          name: 'My Org',
        },
      })
      const course = buildCourse({
        organization,
        type: Course_Type_Enum.Closed,
      }) as unknown as Course
      course.bookingContactProfileId = currentUser.id
      course.status = Course_Status_Enum.Scheduled
      _render(
        <Provider value={client as unknown as Client}>
          <InvitesTab
            course={course as unknown as Course}
            inviteStatus={Course_Invite_Status_Enum.Accepted}
            invitesData={invites}
          />
        </Provider>,
        {
          auth: {
            activeRole: RoleName.BOOKING_CONTACT,
            profile: currentUser,
            allowedRoles: new Set([
              RoleName.BOOKING_CONTACT,
              RoleName.ORGANIZATION_KEY_CONTACT,
            ]),
          },
        },
      )
      // Check component is displayed correctly
      expect(screen.getByText(inviteeEmail)).toBeInTheDocument()
      expect(
        screen.getByText(t('pages.course-participants.cancel-invite')),
      ).toBeInTheDocument()
      expect(
        screen.getByText(t('pages.course-participants.resend-invite')),
      ).toBeInTheDocument()

      // Check resend button work
      const resendButton = screen.getByTestId(
        `course-resend-invite-btn-${inviteId}`,
      )
      expect(resendButton).toBeInTheDocument()
      await userEvent.click(resendButton)
      expect(client.executeMutation).toHaveBeenCalledTimes(1)

      // Check cancel button work
      const cancelButton = screen.getByTestId(
        `course-cancel-invite-btn-${inviteId}`,
      )
      expect(cancelButton).toBeInTheDocument()
      await userEvent.click(cancelButton)
      expect(client.executeMutation).toHaveBeenCalledTimes(2) // 1 for resend and 1 for cancel
    })
  },
)
