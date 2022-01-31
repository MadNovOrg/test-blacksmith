import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppMenu } from '.'

export default {
  title: 'components/AppMenu',
  component: AppMenu,
}

export const Basic = () => (
  <BrowserRouter>
    <div className="flex justify-end">
      <AppMenu />
    </div>
  </BrowserRouter>
)
