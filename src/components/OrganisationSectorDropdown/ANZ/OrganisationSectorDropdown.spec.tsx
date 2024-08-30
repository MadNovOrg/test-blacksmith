import { useForm } from 'react-hook-form'

import { render, renderHook, screen, userEvent } from '@test/index'

import {
  OrganisationSectorDropdown,
  sectors,
} from './OrganisationSectorDropdown'

describe(OrganisationSectorDropdown.name, () => {
  const {
    result: {
      current: { register },
    },
  } = renderHook(() => useForm())
  it('renders the component', () => {
    const testLabel = 'TEST'
    render(
      <OrganisationSectorDropdown
        register={{ ...register('sector') }}
        label={testLabel}
        value={''}
      />,
    )
    expect(screen.getByText(testLabel)).toBeInTheDocument()
  })
  it.each([...Object.keys(sectors)])('renders %s option', async option => {
    const sectorOption = sectors[option as keyof typeof sectors]
    render(
      <OrganisationSectorDropdown
        register={{ ...register('sector') }}
        value={''}
      />,
    )
    expect(screen.queryByText(sectorOption)).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText(sectorOption)).toBeInTheDocument()
  })
})
