import AttachFileIcon from '@mui/icons-material/AttachFile'
import LaunchIcon from '@mui/icons-material/Launch'
import LinkIcon from '@mui/icons-material/Link'
import SlideshowIcon from '@mui/icons-material/Slideshow'
import { Card, Box, Typography, Link } from '@mui/material'
import React, { ReactNode, useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ResourceSummaryFragment } from '@app/generated/graphql'

export type Props = {
  resource: ResourceSummaryFragment
}

type ResourceType = 'file' | 'video' | 'link'

function getIconByResourceType(type: ResourceType | string): ReactNode {
  switch (type) {
    case 'file':
      return <AttachFileIcon color="success" fontSize="small" />
    case 'video':
      return <SlideshowIcon color="warning" fontSize="small" />
    case 'link':
      return <LinkIcon color="success" fontSize="small" />
    default: {
      return <AttachFileIcon color="success" fontSize="small" />
    }
  }
}

interface IResourceTypeItem {
  id: string | number
  title?: string | null
  type: string
  url?: string | null
}

export const ResourceItemCard = ({ resource }: Props) => {
  const { t } = useTranslation()

  const [resourceItem, setResourceItem] = useState<IResourceTypeItem | null>(
    null,
  )

  const resourceType = resource.resourceAttachment?.resourcetype
  const isVideoResource = resourceType === 'video'
  const isLinkResource = resourceType === 'link'

  const extractResourceItemURL = useCallback(() => {
    const resourceData: IResourceTypeItem = {
      id: resource.id,
      title: resource.title,
      type: '',
      url: '',
    }
    if (isVideoResource) {
      resourceData.type = 'video'
      resourceData.url = resource.resourceAttachment?.videourl
    } else if (isLinkResource) {
      resourceData.type = 'link'
      resourceData.url = resource.resourceAttachment?.link?.url
    } else {
      resourceData.type = 'file'
      resourceData.url = resource.resourceAttachment?.file?.mediaItemUrl
    }
    setResourceItem(resourceData)
  }, [
    resource.id,
    resource.title,
    resource.resourceAttachment?.videourl,
    resource.resourceAttachment?.link?.url,
    resource.resourceAttachment?.file?.mediaItemUrl,
    isVideoResource,
    isLinkResource,
  ])

  useEffect(() => {
    extractResourceItemURL()
  }, [extractResourceItemURL])

  const resourceIcon = resourceType ? getIconByResourceType(resourceType) : null

  return (
    <Card sx={{ boxShadow: 'none', p: 1 }}>
      <Link
        target="_blank"
        component={'a'}
        href={
          resourceItem?.type === 'video'
            ? `/resources/video-resource/${resourceItem.title}/${resourceItem?.url}/${resourceItem?.id}`
            : resourceItem?.url ?? ''
        }
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
