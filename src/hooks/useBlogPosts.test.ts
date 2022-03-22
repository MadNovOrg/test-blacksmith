import { renderHook } from '@testing-library/react-hooks'
import useSWR from 'swr'

import { useBlogPost, useBlogPostList } from './useBlogPosts'

import { BlogPost } from '@app/types'

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)
const useSWRMockDefaults = (data: BlogPost | BlogPost[]) => {
  return {
    data,
    mutate: jest.fn(),
    isValidating: false,
  }
}

describe('useBlogPostList', () => {
  beforeEach(() => {
    useSWRMock.mockReturnValue(
      useSWRMockDefaults([
        {
          id: 1,
          title: 'This is the title',
          content: 'Some content',
          excerpt: 'Some excerpt',
          date: 'Some date',
        },
      ])
    )
  })

  it('should have blog posts and no longer loading, the second time', async () => {
    const { result } = renderHook(() => useBlogPostList())

    expect(result.current[0].length).toBe(1)
    expect(result.current[0][0]).toEqual({
      id: 1,
      title: 'This is the title',
      content: 'Some content',
      excerpt: 'Some excerpt',
      date: 'Some date',
    })
    expect(result.current[2]).toBe(false)
  })
})

describe('useBlogPost', () => {
  beforeEach(() => {
    useSWRMock.mockReturnValue(
      useSWRMockDefaults({
        id: 1,
        title: 'This is the title',
        content: 'Some content',
        excerpt: 'Some excerpt',
        date: 'Some date',
      })
    )
  })

  it('should have blog posts and no longer loading, the second time', async () => {
    const { result } = renderHook(() => useBlogPost('1'))

    expect(result.current[0]).not.toBeUndefined()
    expect(result.current[0]).toEqual({
      id: 1,
      title: 'This is the title',
      content: 'Some content',
      excerpt: 'Some excerpt',
      date: 'Some date',
    })
    expect(result.current[1]).toBe(false)
  })
})
