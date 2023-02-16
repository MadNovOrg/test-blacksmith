import React from 'react'
import { useTranslation } from 'react-i18next'

import { WebinarSummaryFragment } from '@app/generated/graphql'

import {
  FeaturedContentItem,
  Props as FeaturedContentItemProps,
} from '../FeaturedContentItem'

export const FeaturedWebinar: React.FC<
  React.PropsWithChildren<{
    webinar: WebinarSummaryFragment | null
  }>
> = ({ webinar }) => {
  const { t } = useTranslation()

  if (!webinar) {
    return null
  }

  const data: FeaturedContentItemProps['data'] = {
    id: webinar.id,
    title: webinar.title,
    excerpt: webinar.excerpt,
    imageSrcSet: webinar.featuredImage?.node?.srcSet,
    imageUrl: webinar.featuredImage?.node?.mediaItemUrl,
    youtube: {
      url: webinar.youtube?.url,
      duration: webinar.youtube?.duration,
    },
  }

  return (
    <FeaturedContentItem
      data-testid="featured-webinar"
      mb={5}
      data={data}
      linkTo={`./webinars/${webinar.id}`}
      chipLabel={t('pages.membership.webinars.featured-label')}
    />
  )
}
