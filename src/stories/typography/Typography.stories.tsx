import { Typography } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

const SampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

export default {
  title: 'Foundations / Typography',
  component: Typography,
} as Meta<typeof Typography>

type Story = StoryObj<typeof Typography>

export const H1: Story = {
  name: 'H1',
  args: {
    variant: 'h1',
    children: SampleText,
  },
}

export const H2: Story = {
  name: 'H2',
  args: {
    variant: 'h2',
    children: SampleText,
  },
}

export const H3: Story = {
  name: 'H3',
  args: {
    variant: 'h3',
    children: SampleText,
  },
}

export const H4: Story = {
  name: 'H4',
  args: {
    variant: 'h4',
    children: SampleText,
  },
}

export const H5: Story = {
  name: 'H5',
  args: {
    variant: 'h5',
    children: SampleText,
  },
}

export const H6: Story = {
  name: 'H6',
  args: {
    variant: 'h6',
    children: SampleText,
  },
}

export const Body1: Story = {
  name: 'Body1',
  args: {
    variant: 'body1',
    children: SampleText,
  },
}
