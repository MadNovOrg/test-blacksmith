import React, { useState } from 'react'

import { ToggleSwitch } from './ToggleSwitch'

export default {
  title: 'components/ToggleSwitch',
  component: ToggleSwitch,
}

export const Basic = () => {
  const [enabled, setEnabled] = useState(false)
  return (
    <ToggleSwitch
      label={enabled ? 'On' : 'Off'}
      onChange={setEnabled}
      defaultValue={false}
    />
  )
}

export const RichLabel = () => {
  const [enabled, setEnabled] = useState(true)
  return (
    <ToggleSwitch onChange={setEnabled}>
      <b>{enabled ? 'Enabled' : 'Disabled'}</b>
    </ToggleSwitch>
  )
}
