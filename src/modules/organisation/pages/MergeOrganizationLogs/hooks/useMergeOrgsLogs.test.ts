import { useQuery } from 'urql'
import { DebouncedState, useDebounce } from 'use-debounce'

import {
  GetMergeOrgsLogsQuery,
  GetOrgsByIdsQuery,
} from '@app/generated/graphql'

import { chance, renderHook, waitFor } from '@test/index'

import { useMergeOrgsLogs } from './useMergeOrgsLogs'

vi.mock('urql', async () => ({
  ...(await vi.importActual('urql')),
  useQuery: vi.fn(),
}))

vi.mock('use-debounce', () => ({
  useDebounce: vi.fn(value => [value]),
}))

const mockUseQuery = vi.mocked(useQuery)
const mockUseDebounce = vi.mocked(useDebounce)

describe('useMergeOrgsLogs', () => {
  const primaryOrganizationId = chance.guid()
  const mockMergeLogsData: GetMergeOrgsLogsQuery = {
    logs: [
      {
        id: chance.guid(),
        actionedById: chance.guid(),
        createdAt: new Date().toISOString(),
        primaryOrganizationId,
        primaryOrganizationName: chance.string(),
        actionedBy: {
          fullName: chance.name(),
        },
        mergedOrganizations: [
          {
            id: chance.guid(),
            organizationId: chance.guid(),
            organizationName: chance.string(),
          },
        ],
      },
    ],
    aggregate: {
      aggregate: {
        count: 1,
      },
    },
  }

  const mockOrgsByIdsData: GetOrgsByIdsQuery = {
    organization: [
      {
        id: primaryOrganizationId,
        name: chance.company(),
      },
    ],
  }

  beforeEach(() => {
    mockUseQuery.mockReset()
    mockUseDebounce.mockImplementation(value => [
      value,
      vi.fn() as unknown as DebouncedState<(value: unknown) => void>,
    ])
  })

  it('should fetch logs without search', async () => {
    mockUseQuery
      .mockReturnValueOnce([
        { data: mockMergeLogsData, fetching: false, stale: false },
        vi.fn(),
      ])
      .mockReturnValueOnce([
        { data: mockOrgsByIdsData, fetching: false, stale: false },
        vi.fn(),
      ])

    const { result } = renderHook(() =>
      useMergeOrgsLogs({ limit: 10, offset: 0 }),
    )

    await waitFor(() => {
      expect(result.current.fetching).toBe(false)
      expect(result.current.logs).toEqual([
        {
          ...mockMergeLogsData.logs[0],
          primaryOrganization: mockOrgsByIdsData.organization[0],
        },
      ])
      expect(result.current.total).toBe(1)
    })
  })

  it('should handle search with UUID', async () => {
    const uuid = chance.guid()
    mockUseQuery
      .mockReturnValueOnce([
        { data: mockMergeLogsData, fetching: false, stale: false },
        vi.fn(),
      ])
      .mockReturnValueOnce([
        { data: mockOrgsByIdsData, fetching: false, stale: false },
        vi.fn(),
      ])

    renderHook(() => useMergeOrgsLogs({ limit: 10, offset: 0, search: uuid }))

    await waitFor(() => {
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            limit: 10,
            offset: 0,
            where: {
              _or: [
                {
                  mergedOrganizations: {
                    organizationId: {
                      _eq: uuid,
                    },
                  },
                },
              ],
            },
          },
        }),
      )
    })
  })

  it('should handle search with text', async () => {
    const searchText = 'Primary Org'
    mockUseQuery
      .mockReturnValueOnce([
        { data: mockMergeLogsData, fetching: false, stale: false },
        vi.fn(),
      ])
      .mockReturnValueOnce([
        { data: mockOrgsByIdsData, fetching: false, stale: false },
        vi.fn(),
      ])

    renderHook(() =>
      useMergeOrgsLogs({ limit: 10, offset: 0, search: searchText }),
    )

    await waitFor(() => {
      expect(mockUseQuery).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          variables: {
            limit: 10,
            offset: 0,
            where: {
              _or: [
                {
                  primaryOrganizationName: {
                    _ilike: `%Primary%Org%`,
                  },
                },
                {
                  mergedOrganizations: {
                    _or: [
                      {
                        organizationName: {
                          _ilike: `%Primary%Org%`,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        }),
      )
    })
  })

  it('should handle search with dfe urn', async () => {
    const searchText = '100000'
    mockUseQuery
      .mockReturnValueOnce([
        { data: mockMergeLogsData, fetching: false, stale: false },
        vi.fn(),
      ])
      .mockReturnValueOnce([
        { data: mockOrgsByIdsData, fetching: false, stale: false },
        vi.fn(),
      ])

    renderHook(() =>
      useMergeOrgsLogs({ limit: 10, offset: 0, search: searchText }),
    )

    await waitFor(() => {
      expect(mockUseQuery).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          variables: {
            limit: 10,
            offset: 0,
            where: {
              _or: [
                {
                  primaryOrganizationName: {
                    _ilike: `%100000%`,
                  },
                },
                {
                  mergedOrganizations: {
                    _or: [
                      {
                        organizationName: {
                          _ilike: `%100000%`,
                        },
                      },
                    ],
                  },
                },
                { primaryOrganizationUrn: { _eq: '100000' } },
                {
                  mergedOrganizations: {
                    dfeUrn: {
                      _eq: '100000',
                    },
                  },
                },
              ],
            },
          },
        }),
      )
    })
  })

  it('should handle loading states', async () => {
    mockUseQuery
      .mockReturnValueOnce([
        { data: undefined, fetching: true, stale: false },
        vi.fn(),
      ])
      .mockReturnValueOnce([
        { data: undefined, fetching: false, stale: false },
        vi.fn(),
      ])

    const { result } = renderHook(() =>
      useMergeOrgsLogs({ limit: 10, offset: 0 }),
    )

    expect(result.current.fetching).toBe(true)
    expect(result.current.logs).toEqual([])
  })

  it('should handle empty primary organizations response', async () => {
    vi.mocked(mockUseQuery)
      .mockReturnValueOnce([
        { data: mockMergeLogsData, fetching: false, stale: false },
        vi.fn(),
      ])
      .mockReturnValueOnce([
        { data: undefined, fetching: false, stale: false },
        vi.fn(),
      ])

    const { result } = renderHook(() =>
      useMergeOrgsLogs({ limit: 10, offset: 0 }),
    )

    await waitFor(() => {
      expect(result.current.fetching).toBe(false)
      expect(result.current.logs).toEqual([
        {
          ...mockMergeLogsData.logs[0],
          primaryOrganization: undefined,
        },
      ])
      expect(result.current.total).toBe(1)
    })
  })
})
