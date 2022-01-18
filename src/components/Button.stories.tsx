import React from 'react'

import { PrimaryButton, SecondaryButton, TertiaryButton } from './Button'

export default {
  title: 'components/Button',
  component: PrimaryButton,
}

export const Primary = () => <PrimaryButton>Primary Button</PrimaryButton>

export const Secondary = () => (
  <SecondaryButton>Secondary Button</SecondaryButton>
)

export const Tertiary = () => <TertiaryButton>Tertiary Button</TertiaryButton>
