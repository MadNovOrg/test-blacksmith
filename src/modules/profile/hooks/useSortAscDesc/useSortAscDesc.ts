import { useState } from 'react'

type orderDirection = 'asc' | 'desc'

export const useSortAscDesc = (
  defaultOrderDirection: orderDirection = 'desc',
) => {
  const [sortOrder, setSortOrder] = useState<orderDirection>(
    defaultOrderDirection,
  )

  const handleSortToggle = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'))
  }

  return { sortOrder, handleSortToggle }
}
