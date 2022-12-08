import LaunchIcon from '@mui/icons-material/Launch'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SlideshowIcon from '@mui/icons-material/Slideshow'
import { Card, Box, Typography, Link } from '@mui/material'
import React, { ReactNode } from 'react'

import { ResourceSummaryFragment } from '@app/generated/graphql'

export type Props = {
  resource: ResourceSummaryFragment
}

const iconsByResourceType: Record<string, ReactNode> = {
  pdf: <PictureAsPdfIcon color="success" fontSize="small" />,
  video: <SlideshowIcon color="warning" fontSize="small" />,
}

export const ResourceItemCard = ({ resource }: Props) => {
  const resourceType = resource.resourceAttachment?.resourcetype
  const attachmentURL =
    resourceType === 'video'
      ? resource.resourceAttachment?.videourl
      : resource.resourceAttachment?.file?.mediaItemUrl

  return (
    <Card sx={{ boxShadow: 'none', p: 1 }}>
      <Box display="flex" alignItems="center">
        {resourceType && iconsByResourceType[resourceType]}
        <Typography
          fontWeight={600}
          sx={{ flexGrow: 1, mx: 2 }}
          lineHeight="28px"
        >
          {resource.title}
        </Typography>
        <Link target="_blank" component={'a'} href={attachmentURL ?? ''}>
          <LaunchIcon fontSize="small" />
        </Link>
      </Box>
    </Card>
  )
}

export default ResourceItemCard
