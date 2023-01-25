import { useCallback, useMemo } from 'react'

import { SortOrder } from '@app/types'

import { useMergeSearchParams } from './useMergeSearchParams'

export type Sorting = ReturnType<typeof useTableSort>

/**
 * Utility hook to encapsulate table sort logic
 */
export const useTableSort = (
  defaultSortBy = '',
  defaultSortDir: SortOrder = 'asc',
  id = 'tbl'
) => {
  const [searchParams, mergeSearchParams] = useMergeSearchParams({
    by: defaultSortBy,
    dir: defaultSortDir,
  })

  const currentBy = searchParams.get(`${id}-by`) ?? defaultSortBy
  const currentDir = (searchParams.get(`${id}-dir`) ??
    defaultSortDir) as SortOrder

  const onSort = useCallback(
    (col: string) => {
      mergeSearchParams({
        [`${id}-by`]: col,
        [`${id}-dir`]:
          col !== currentBy ? 'asc' : currentDir === 'asc' ? 'desc' : 'asc',
      })
    },
    [mergeSearchParams, currentBy, currentDir, id]
  )

  return useMemo(
    () => ({ by: currentBy, dir: currentDir, onSort }),
    [currentBy, currentDir, onSort]
  )
}
