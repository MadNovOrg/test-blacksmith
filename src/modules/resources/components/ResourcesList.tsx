import { Stack } from '@mui/material'
import React, { useMemo } from 'react'

import { ResourceSummaryFragment } from '@app/generated/graphql'

import { ResourceItemCard } from './ResourceItemCard'

export type Props = {
  resources?: (ResourceSummaryFragment | null)[]
}

const getNumber = (title: ResourceSummaryFragment['title']) => {
  if (!title) return Infinity

  const match = /^(\d+[a-z]?\.?)\s/.exec(title)

  if (!match) return Infinity

  return parseInt(match[1].replace(/[a-z.]/g, ''), 10)
}

export const ResourcesList = ({ resources }: Props) => {
  const sortedResources = useMemo(() => {
    return resources?.sort((resourceA, resourceB) => {
      const numA = getNumber(resourceA?.title)
      const numB = getNumber(resourceB?.title)

      if (numA === numB) {
        return (resourceA?.title ?? '').localeCompare(resourceB?.title ?? '')
      }

      return numA - numB
    })
  }, [resources])

  return resources?.length ? (
    <Stack spacing={2}>
      {sortedResources?.map(resource =>
        resource ? (
          <ResourceItemCard resource={resource} key={resource.id} />
        ) : null,
      )}
    </Stack>
  ) : null
}

export default ResourcesList
