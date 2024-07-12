// TODO: update tests to reflect the actual useCourseInvites functionality
import { renderHook } from '@testing-library/react'

import { chance } from '@test/index'

import useCourseInvites from './useCourseInvites'

vi.mock('useCourseInvites')

describe('useCourseInvites', () => {
  it('should throw when send is called with no emails', async () => {
    const courseId = chance.integer()
    const { result } = renderHook(() => useCourseInvites({ courseId }))
    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(send([])).rejects.toThrow(err)
  })

  it('should throw when send is called with invalid email', async () => {
    const courseId = chance.integer()
    const { result } = renderHook(() => useCourseInvites({ courseId }))
    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(send(['not an email'])).rejects.toThrow(err)
  })

  it('should throw when send is called with invalid emails', async () => {
    const courseId = chance.integer()
    const { result } = renderHook(() => useCourseInvites({ courseId }))
    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(send(['not an email', chance.email()])).rejects.toThrow(err)
  })
})
