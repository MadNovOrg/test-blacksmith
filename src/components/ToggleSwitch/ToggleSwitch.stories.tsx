import React, { useState } from 'react'

import { ToggleSwitch } from '.'

export default {
  title: 'components/ToggleSwitch',
  component: ToggleSwitch,
}

export const Basic = () => {
  const [checked, setChecked] = useState(true)
  return (
    <ToggleSwitch
      label={checked ? 'On' : 'Off'}
      onChange={setChecked}
      checked={checked}
    />
  )
}

export const RichLabel = () => {
  const [checked, setChecked] = useState(false)
  return (
    <ToggleSwitch onChange={setChecked} checked={checked}>
      <b>{checked ? 'Enabled' : 'Disabled'}</b>
    </ToggleSwitch>
  )
}
