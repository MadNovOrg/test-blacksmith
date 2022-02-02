import React from 'react'
import { Story } from '@storybook/react'

export default {
  title: 'components/Form',
  component: () => <div />,
}

const FormTemplate: Story = () => (
  <div className="space-y-6 w-96">
    <div className="grid gap-6 grid-cols-2">
      <button className="btn primary">Primary</button>
      <button disabled className="btn primary">
        Disabled
      </button>
    </div>
    <div className="grid gap-6 grid-cols-2">
      <button className="btn secondary">Secondary</button>
      <button disabled className="btn secondary">
        Disabled
      </button>
    </div>
    <div className="grid gap-6 grid-cols-2">
      <button className="btn tertiary">Secondary</button>
      <button disabled className="btn tertiary">
        Disabled
      </button>
    </div>
    <div className="grid gap-6 grid-cols-2">
      <button className="tag primary">Secondary</button>
      <button disabled className="tag primary">
        Disabled
      </button>
    </div>
    <div className="grid gap-6 grid-cols-2">
      <button className="tag secondary">Secondary</button>
      <button disabled className="tag secondary">
        Disabled
      </button>
    </div>
    <div className="grid gap-6 grid-cols-2">
      <button className="tag tertiary">Secondary</button>
      <button disabled className="tag tertiary">
        Disabled
      </button>
    </div>
    <div className="grid gap-6 grid-cols-2">
      <label className="flex items-center space-x-3 cursor-pointer">
        <input type="checkbox" />
        <span>Checkbox label</span>
      </label>
    </div>
    <div className="grid gap-6 grid-cols-2">
      <label className="flex items-center space-x-3 cursor-pointer">
        <input type="radio" />
        <span>Option label</span>
      </label>
    </div>
  </div>
)

export const Form = FormTemplate.bind({})
