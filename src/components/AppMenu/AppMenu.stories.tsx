import React from 'react'

import { AppMenu } from '.'

export default {
  title: 'components/AppMenu',
  component: AppMenu,
}

export const Basic = () => (
  <div className="flex justify-end">
    <AppMenu />
  </div>
)
