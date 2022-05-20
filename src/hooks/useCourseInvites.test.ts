import { renderHook } from '@testing-library/react-hooks'
import useSWR from 'swr'

import { chance } from '@test/index'

import useCourseInvites from './useCourseInvites'

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)
const useSWRMockDefaults = {
  data: undefined,
  mutate: jest.fn(),
  isValidating: false,
}

const mockFetcher = jest.fn()
jest.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: () => mockFetcher,
}))

const mockMatchMutate = jest.fn()
jest.mock('@app/hooks/useMatchMutate', () => ({
  useMatchMutate: () => mockMatchMutate,
}))

describe('useCourseInvites', () => {
  it('should not call SWR when courseId is not provided', async () => {
    useSWRMock.mockReturnValue(useSWRMockDefaults)

    const { result } = renderHook(() => useCourseInvites())
    const { data } = result.current

    expect(data).toStrictEqual([])
    expect(useSWRMock).toBeCalledWith(null)
  })

  it('should call SWR when courseId is provided', async () => {
    useSWRMock.mockReturnValue(useSWRMockDefaults)

    const courseId = chance.guid()
    const { result } = renderHook(() => useCourseInvites(courseId))
    const { data } = result.current

    expect(data).toStrictEqual([])
    expect(useSWRMock).toBeCalledWith([
      expect.any(String),
      expect.objectContaining({
        courseId,
      }),
    ])
  })

  it('should mutate when invalidateCache is called', async () => {
    useSWRMock.mockReturnValue(useSWRMockDefaults)

    const courseId = chance.guid()
    const { result } = renderHook(() => useCourseInvites(courseId))

    await result.current.invalidateCache()

    expect(mockMatchMutate).toBeCalledWith(expect.any(RegExp))
  })

  it('should throw when send is called with no emails', async () => {
    useSWRMock.mockReturnValue(useSWRMockDefaults)

    const courseId = chance.guid()
    const { result } = renderHook(() => useCourseInvites(courseId))
    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(send([])).rejects.toThrow(err)
    expect(mockFetcher).not.toBeCalled()
  })

  it('should throw when send is called with invalid email', async () => {
    useSWRMock.mockReturnValue(useSWRMockDefaults)

    const courseId = chance.guid()
    const { result } = renderHook(() => useCourseInvites(courseId))
    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(send(['not an email'])).rejects.toThrow(err)
    expect(mockFetcher).not.toBeCalled()
  })

  it('should throw when send is called with invalid emails', async () => {
    useSWRMock.mockReturnValue(useSWRMockDefaults)

    const courseId = chance.guid()
    const { result } = renderHook(() => useCourseInvites(courseId))
    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(send(['not an email', chance.email()])).rejects.toThrow(err)
    expect(mockFetcher).not.toBeCalled()
  })

  it('should call fetcher when send is called with valid emails', async () => {
    useSWRMock.mockReturnValue(useSWRMockDefaults)

    const courseId = chance.guid()
    const { result } = renderHook(() => useCourseInvites(courseId))
    const { send } = result.current

    const emails = [chance.email(), chance.email()]
    await send(emails)

    const invites = emails.map(email => ({ course_id: courseId, email }))
    expect(mockFetcher).toBeCalledWith(expect.anything(), { invites })
  })

  it('should call fetcher with only not yet invited emails', async () => {
    const courseInvites = [{ email: chance.email() }, { email: chance.email() }]
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { courseInvites },
    })

    const courseId = chance.guid()
    const { result } = renderHook(() => useCourseInvites(courseId))
    const { send } = result.current

    const emails = [courseInvites[0].email, chance.email()]
    await send(emails)

    const invites = [{ course_id: courseId, email: emails[1] }]
    expect(mockFetcher).toBeCalledWith(expect.anything(), { invites })
  })

  it('should throw when send is called with all emails already invited', async () => {
    const courseInvites = [{ email: chance.email() }, { email: chance.email() }]
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { courseInvites },
    })

    const courseId = chance.guid()
    const { result } = renderHook(() => useCourseInvites(courseId))
    const { send } = result.current

    const emails = courseInvites.map(i => i.email)
    const err = Error('EMAILS_ALREADY_INVITED')
    await expect(send(emails)).rejects.toThrow(err)
    expect(mockFetcher).not.toBeCalled()
  })
})
