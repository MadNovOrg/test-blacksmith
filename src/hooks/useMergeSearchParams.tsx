import { useCallback } from 'react'
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom'

type MergeFn = (obj: Record<string, string>) => void

export const useMergeSearchParams = (
  defaultInit?: URLSearchParamsInit
): [URLSearchParams, MergeFn] => {
  const [searchParams, setSearchParams] = useSearchParams(defaultInit)

  const mergeSearchParams = useCallback<MergeFn>(
    obj => {
      Object.keys(obj).forEach(k => searchParams.set(k, obj[k]))
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  return [searchParams, mergeSearchParams]
}
