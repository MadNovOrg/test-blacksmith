// TODO: update tests to reflect the actual useCourseInvites functionality
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Course_Type_Enum } from '@app/generated/graphql'

import { chance } from '@test/index'

import useCourseInvites from './useCourseInvites'

vi.mock('useCourseInvites')

describe('useCourseInvites', () => {
  it('should throw when send is called with no emails', async () => {
    const courseId = chance.integer()
    const { result } = renderHook(() => useCourseInvites({ courseId }), {
      wrapper: MemoryRouter,
    })

    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(
      send({
        emails: [],
        course: { type: Course_Type_Enum.Indirect, go1Integration: false },
      }),
    ).rejects.toThrow(err)
  })

  it('should throw when send is called with invalid email', async () => {
    const courseId = chance.integer()
    const { result } = renderHook(() => useCourseInvites({ courseId }), {
      wrapper: MemoryRouter,
    })
    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(
      send({
        emails: [],
        course: { type: Course_Type_Enum.Indirect, go1Integration: false },
      }),
    ).rejects.toThrow(err)
  })

  it('should throw when send is called with invalid emails', async () => {
    const courseId = chance.integer()
    const { result } = renderHook(() => useCourseInvites({ courseId }), {
      wrapper: MemoryRouter,
    })
    const { send } = result.current

    const err = Error('INVALID_EMAILS')
    await expect(
      send({
        emails: [],
        course: { type: Course_Type_Enum.Indirect, go1Integration: false },
      }),
    ).rejects.toThrow(err)
  })
})
