import { Stack } from '@mui/material'
import React from 'react'

import { ResourceSummaryFragment } from '@app/generated/graphql'

import { ResourceItemCard } from './ResourceItemCard'

export type Props = {
  resources?: (ResourceSummaryFragment | null)[]
}

export const ResourcesList = ({ resources }: Props) => {
  return resources?.length ? (
    <Stack spacing={2}>
      {resources
        ?.sort((resourceA, resourceB) => {
          if (resourceA && resourceB && resourceA.title && resourceB.title) {
            return resourceA.title.localeCompare(resourceB.title)
          }
          return 0
        })
        .map(resource =>
          resource ? (
            <ResourceItemCard resource={resource} key={resource.id} />
          ) : null
        )}
    </Stack>
  ) : null
}

export default ResourcesList
