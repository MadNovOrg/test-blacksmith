// TODO: update tests to reflect the actual useCourseInvites functionality
import { renderHook } from '@testing-library/react'
import { DocumentNode } from 'graphql'
import { MemoryRouter } from 'react-router-dom'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Type_Enum,
  GetCourseInvitesQuery,
  ValidateAndDispatchInvitesForIndirectCourseError,
  ValidateAndDispatchInvitesForIndirectCourseMutation,
} from '@app/generated/graphql'

import { chance } from '@test/index'

import useCourseInvites, {
  GET_COURSE_INVITES,
  VALIDATE_AND_DISPATCH_INVITES_FOR_INDIRECT_COURSE,
} from './useCourseInvites'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

vi.mock('useCourseInvites')

describe('useCourseInvites', () => {
  it('should throw when send is called with no emails', async () => {
    const courseId = chance.integer()
    const { result } = renderHook(
      () => useCourseInvites({ courseId, inviter: null }),
      {
        wrapper: MemoryRouter,
      },
    )

    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(
      send({
        emails: [],
        course: {
          go1Integration: true,
          resourcePackType: null,
          type: Course_Type_Enum.Indirect,
        },
      }),
    ).rejects.toThrow(err)
  })

  it('should throw when send is called with invalid email', async () => {
    const courseId = chance.integer()
    const { result } = renderHook(
      () => useCourseInvites({ courseId, inviter: null }),
      {
        wrapper: MemoryRouter,
      },
    )
    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(
      send({
        emails: [],
        course: {
          go1Integration: true,
          resourcePackType: null,
          type: Course_Type_Enum.Indirect,
        },
      }),
    ).rejects.toThrow(err)
  })

  it('should throw when send is called with invalid emails', async () => {
    const courseId = chance.integer()
    const { result } = renderHook(
      () => useCourseInvites({ courseId, inviter: null }),
      {
        wrapper: MemoryRouter,
      },
    )
    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(
      send({
        emails: [],
        course: {
          go1Integration: true,
          resourcePackType: null,
          type: Course_Type_Enum.Indirect,
        },
      }),
    ).rejects.toThrow(err)
  })

  it('navigates to the review order page when additional licenses are required for new invites', async () => {
    const courseId = chance.natural()

    const executeMutationMock = vi.fn(
      ({ query }: { query: TypedDocumentNode }) => {
        if (query === VALIDATE_AND_DISPATCH_INVITES_FOR_INDIRECT_COURSE) {
          return fromValue<{
            data: ValidateAndDispatchInvitesForIndirectCourseMutation
          }>({
            data: {
              validateAndDispatchInvitesForIndirectCourse: {
                error:
                  ValidateAndDispatchInvitesForIndirectCourseError.InsufficientNumberOfResources,
                extraLicensesRequiredToBuy: 1,
                success: false,
              },
            },
          })
        }
        return fromValue({ data: {} })
      },
    )

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === GET_COURSE_INVITES) {
          return fromValue<{ data: GetCourseInvitesQuery }>({
            data: {
              courseInvites: [],
              courseInvitesAggregate: { aggregate: { count: 0 } },
            },
          })
        }
        return never
      },
      executeMutation: executeMutationMock,
    } as unknown as Client

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <Provider value={client}>{children}</Provider>
      </MemoryRouter>
    )

    const { result } = renderHook(
      () => useCourseInvites({ courseId, inviter: null }),
      {
        wrapper,
      },
    )
    const { send } = result.current

    const email = chance.email()

    await send({
      emails: [email],
      course: {
        go1Integration: true,
        resourcePackType: null,
        type: Course_Type_Enum.Indirect,
      },
    })

    const firstCallArgs = executeMutationMock.mock.calls[0][0]

    expect(firstCallArgs).toEqual(
      expect.objectContaining({
        query: VALIDATE_AND_DISPATCH_INVITES_FOR_INDIRECT_COURSE,
        variables: {
          input: {
            courseId,
            invites: [
              {
                email,
                invitedAfterCourseHasEnded: false,
                inviter_id: null,
              },
            ],
          },
        },
      }),
    )

    expect(mockNavigate).toHaveBeenCalledWith(
      `/courses/edit/${courseId}/review-licenses-order`,
      {
        state: {
          extraResourcePacksRequiredToBuy: undefined,
          insufficientNumberOfLicenses: 1,
          invitees: [
            {
              email,
              invitedAfterCourseHasEnded: false,
              inviter_id: null,
            },
          ],
        },
      },
    )
  })

  it('navigates to the review order page when additional resource packs are required for new invites', async () => {
    const courseId = chance.natural()

    const executeMutationMock = vi.fn(
      ({ query }: { query: TypedDocumentNode }) => {
        if (query === VALIDATE_AND_DISPATCH_INVITES_FOR_INDIRECT_COURSE) {
          return fromValue<{
            data: ValidateAndDispatchInvitesForIndirectCourseMutation
          }>({
            data: {
              validateAndDispatchInvitesForIndirectCourse: {
                error:
                  ValidateAndDispatchInvitesForIndirectCourseError.InsufficientNumberOfResources,
                extraLicensesRequiredToBuy: 0,
                extraResourcePacksRequiredToBuy: 1,
                success: false,
              },
            },
          })
        }
        return fromValue({ data: {} })
      },
    )

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === GET_COURSE_INVITES) {
          return fromValue<{ data: GetCourseInvitesQuery }>({
            data: {
              courseInvites: [],
              courseInvitesAggregate: { aggregate: { count: 0 } },
            },
          })
        }
        return never
      },
      executeMutation: executeMutationMock,
    } as unknown as Client

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <Provider value={client}>{children}</Provider>
      </MemoryRouter>
    )

    const { result } = renderHook(
      () => useCourseInvites({ courseId, inviter: null }),
      {
        wrapper,
      },
    )
    const { send } = result.current

    const email = chance.email()

    await send({
      emails: [email],
      course: {
        go1Integration: true,
        resourcePackType: null,
        type: Course_Type_Enum.Indirect,
      },
    })

    const firstCallArgs = executeMutationMock.mock.calls[0][0]

    expect(firstCallArgs).toEqual(
      expect.objectContaining({
        query: VALIDATE_AND_DISPATCH_INVITES_FOR_INDIRECT_COURSE,
        variables: {
          input: {
            courseId,
            invites: [
              {
                email,
                invitedAfterCourseHasEnded: false,
                inviter_id: null,
              },
            ],
          },
        },
      }),
    )

    expect(mockNavigate).toHaveBeenCalledWith(
      `/courses/edit/${courseId}/review-licenses-order`,
      {
        state: {
          extraResourcePacksRequiredToBuy: 1,
          insufficientNumberOfLicenses: 0,
          invitees: [
            {
              email,
              invitedAfterCourseHasEnded: false,
              inviter_id: null,
            },
          ],
        },
      },
    )
  })
})
