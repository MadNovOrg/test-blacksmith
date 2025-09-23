import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined'
import React from 'react'

import { _render, screen } from '@test/index'

import { ResourceCard } from './ResourceCard'

describe('component: ResourceCard', () => {
  it('renders ResourceCard', async () => {
    _render(
      <ResourceCard
        title="foo"
        description="bar"
        icon={<TopicOutlinedIcon />}
      />,
    )

    expect(screen.getByText('foo')).toBeInTheDocument()
    expect(screen.getByText('bar')).toBeInTheDocument()
    expect(screen.getByTestId('TopicOutlinedIcon')).toBeInTheDocument()
  })
})
