import { useContext } from 'react'

import { ImportContext } from '.'

export function useImportContext() {
  const value = useContext(ImportContext)

  if (value === undefined) {
    throw new Error('useImportContext must be used within a ImportProvider')
  }

  return value
}
