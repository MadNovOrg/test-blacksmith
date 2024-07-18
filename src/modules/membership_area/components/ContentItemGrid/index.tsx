import React from 'react'

import { ContentGrid, ContentGridItem } from '../../utils/layout'

type Props<T> = {
  data: T[]
  renderItem: (item: T) => React.ReactNode
}

export const ContentItemGrid = <T,>({ data, renderItem }: Props<T>) => (
  <ContentGrid>
    {data.map((item, index) => (
      <ContentGridItem key={index}>{renderItem(item)}</ContentGridItem>
    ))}
  </ContentGrid>
)
