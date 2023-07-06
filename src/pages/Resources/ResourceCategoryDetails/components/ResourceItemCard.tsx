import AttachFileIcon from '@mui/icons-material/AttachFile'
import LaunchIcon from '@mui/icons-material/Launch'
import SlideshowIcon from '@mui/icons-material/Slideshow'
import { Card, Box, Typography, Link } from '@mui/material'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { ResourceSummaryFragment } from '@app/generated/graphql'

export type Props = {
  resource: ResourceSummaryFragment
}

type ResourceType = 'file' | 'video'

function getIconByResourceType(type: ResourceType | string): ReactNode {
  switch (type) {
    case 'file':
      return <AttachFileIcon color="success" fontSize="small" />
    case 'video':
      return <SlideshowIcon color="warning" fontSize="small" />
    default: {
      return <AttachFileIcon color="success" fontSize="small" />
    }
  }
}

export const ResourceItemCard = ({ resource }: Props) => {
  const { t } = useTranslation()

  const resourceType = resource.resourceAttachment?.resourcetype
  const attachmentURL =
    resourceType === 'video'
      ? resource.resourceAttachment?.videourl
      : resource.resourceAttachment?.file?.mediaItemUrl

  const resourceIcon = resourceType ? getIconByResourceType(resourceType) : null

  return (
    <Card sx={{ boxShadow: 'none', p: 1 }}>
      <Link
        target="_blank"
        component={'a'}
        href={attachmentURL ?? ''}
        aria-label={`${resource.title} (${t('opens-new-window')})`}
      >
        <Box display="flex" alignItems="center">
          {resourceIcon ? resourceIcon : null}
          <Typography
            fontWeight={600}
            sx={{ flexGrow: 1, mx: 2 }}
            lineHeight="28px"
          >
            {resource.title}
          </Typography>
          <LaunchIcon fontSize="small" />
        </Box>
      </Link>
    </Card>
  )
}

export default ResourceItemCard
