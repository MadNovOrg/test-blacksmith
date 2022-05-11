import { useState, useCallback, useMemo } from 'react'

import { SortOrder } from '@app/types'

export type Sorting = ReturnType<typeof useTableSort>

/**
 * Utility hook to encapsulate table sort logic
 */
export const useTableSort = (
  defaultSortBy = '',
  defaultSortDir: SortOrder = 'asc'
) => {
  const [{ by, dir }, setSort] = useState({
    by: defaultSortBy,
    dir: defaultSortDir,
  })

  const onSort = useCallback((col: string) => {
    setSort(({ by, dir }) => ({
      by: col,
      dir: col !== by ? 'asc' : dir === 'asc' ? 'desc' : 'asc',
    }))
  }, [])

  return useMemo(
    () => ({
      by,
      dir,
      onSort,
    }),
    [by, dir, onSort]
  )
}
