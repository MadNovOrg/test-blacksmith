import { gql } from 'graphql-request'
import { useCallback } from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'

import type { Trainer } from './types'

import { RoleName } from '@app/types'

const getTrainers = gql`
  query ($limit: Int = 20, $offset: Int = 0, $where: profile_bool_exp) {
    trainers: profile(limit: $limit, offset: $offset, where: $where) {
      id
      fullName
    }
    profile_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`

export const useQueryTrainers = () => {
  const fetcher = useFetcher()

  const search = useCallback(
    async (query: string): Promise<{ trainers: Trainer[] }> => {
      const like = { _ilike: `${query}%` }
      const where = {
        roles: { role: { name: { _eq: RoleName.TRAINER } } },
        _or: [{ givenName: like }, { familyName: like }],
      }

      try {
        const { trainers } = await fetcher(getTrainers, { where })
        return { trainers }
      } catch (error) {
        console.error('useQueryTrainers', error)
        return { trainers: [] }
      }
    },
    [fetcher]
  )

  return { search }
}
