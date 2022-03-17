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
          id: '1',
          title: {
            rendered: 'This is the title',
          },
          content: {
            rendered: 'Some content',
          },
        },
      ])
    )
  })

  it('should have blog posts and no longer loading, the second time', async () => {
    const { result } = renderHook(() => useBlogPostList())

    expect(result.current[0].length).toBe(1)
    expect(result.current[0][0]?.id).toEqual('1')
    expect(result.current[0][0]?.title?.rendered).toEqual('This is the title')
    expect(result.current[0][0]?.content?.rendered).toEqual('Some content')
    expect(result.current[1]).toBe(false)
  })
})

describe('useBlogPost', () => {
  beforeEach(() => {
    useSWRMock.mockReturnValue(
      useSWRMockDefaults({
        id: '1',
        title: {
          rendered: 'This is the title',
        },
        content: {
          rendered: 'Some content',
        },
      })
    )
  })

  it('should have blog posts and no longer loading, the second time', async () => {
    const { result } = renderHook(() => useBlogPost('1'))

    expect(result.current[0]).not.toBeUndefined()
    expect(result.current[0]?.id).toEqual('1')
    expect(result.current[0]?.title?.rendered).toEqual('This is the title')
    expect(result.current[0]?.content?.rendered).toEqual('Some content')
    expect(result.current[1]).toBe(false)
  })
})
