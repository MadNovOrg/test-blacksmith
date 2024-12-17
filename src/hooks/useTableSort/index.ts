import { useCallback, useMemo } from 'react'
import { StringParam, useQueryParam, withDefault } from 'use-query-params'

import { SortOrder } from '@app/types'

export type Sorting = ReturnType<typeof useTableSort>

/**
 * Utility hook to encapsulate table sort logic
 */
export const useTableSort = (
  defaultSortBy = '',
  defaultSortDir: SortOrder = 'asc',
  id = 'tbl',
) => {
  const [by, setSortBy] = useQueryParam(
    `${id}-by`,
    withDefault(StringParam, defaultSortBy),
  )
  const [dir, setSortDir] = useQueryParam(
    `${id}-dir`,
    withDefault(StringParam, defaultSortDir),
  )

  const onSort = useCallback(
    (col: string) => {
      setSortDir(dir => {
        if (col !== by) {
          return 'asc'
        }
        return dir === 'asc' ? 'desc' : 'asc'
      })
      setSortBy(col)
    },
    [setSortBy, setSortDir, by],
  )

  return useMemo(
    () => ({ by, dir: dir as SortOrder, onSort }),
    [by, dir, onSort],
  )
}
