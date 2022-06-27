import React from 'react'
import { useTranslation } from 'react-i18next'

import { VideoItemSummaryFragment } from '@app/generated/graphql'

import {
  FeaturedContentItem,
  Props as FeaturedContentItemProps,
} from '../FeaturedContentItem'

export const FeaturedVideoItem: React.FC<{
  videoItem: VideoItemSummaryFragment | null
}> = ({ videoItem }) => {
  const { t } = useTranslation()

  if (!videoItem) {
    return null
  }

  const data: FeaturedContentItemProps['data'] = {
    id: videoItem.id,
    title: videoItem.title,
    excerpt: videoItem.excerpt,
    imageSrcSet: videoItem.featuredImage?.node?.srcSet,
    imageUrl: videoItem.featuredImage?.node?.mediaItemUrl,
    youtube: {
      url: videoItem.youtube?.url,
      duration: videoItem.youtube?.duration,
    },
  }

  return (
    <FeaturedContentItem
      data-testid="featured-webinar"
      mb={5}
      data={data}
      linkTo={`./video-series/${videoItem.id}`}
      chipLabel={t('pages.membership.video-series.featured-label')}
    />
  )
}
