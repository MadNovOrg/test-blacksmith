import { Chip, ChipProps, Link, Skeleton, SkeletonProps } from '@mui/material'
import React from 'react'

import { getTagLink } from '@app/modules/membership_area/utils'

type Props = {
  tag: {
    id: string
    name: string
  }
} & ChipProps

export const TagChip: React.FC<React.PropsWithChildren<Props>> = ({
  tag,
  ...rest
}) => (
  <Chip
    key={tag.id}
    label={<Link href={getTagLink(tag.id)}>{tag.name}</Link>}
    size="small"
    {...rest}
  />
)

export const TagChipSkeleton: React.FC<
  React.PropsWithChildren<SkeletonProps>
> = ({ sx, ...rest }) => (
  <Skeleton width={50} sx={{ ...sx, display: 'inline-block' }} {...rest} />
)
