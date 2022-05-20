import { useSWRConfig } from 'swr'

export const useMatchMutate = () => {
  const { cache, mutate } = useSWRConfig()
  return (matcher: RegExp) => {
    if (!(cache instanceof Map)) {
      throw new Error(
        'matchMutate requires the cache provider to be a Map instance'
      )
    }

    return Promise.all(
      Array.from(cache.keys())
        .filter(key => matcher.test(key))
        .map(key => mutate(key))
    )
  }
}
