import userEvent from '@testing-library/user-event'
import { useTranslation } from 'react-i18next'

import { _render, renderHook, screen } from '@test/index'

import { AttendeeOrganizationDropdown } from './AtendeeOrganizationDropdown'

const options = ['Team Teach', 'NearForm', 'Amdaris']

describe(AttendeeOrganizationDropdown.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  it('renders the component', () => {
    _render(
      <AttendeeOrganizationDropdown
        options={options}
        selectedOrganization={''}
        onChange={() => {
          vi.fn()
        }}
      />,
    )
    expect(
      screen.getByLabelText(t('components.organization-dropdown.title')),
    ).toBeInTheDocument()
  })
  it.each(options)('renders %s option', async option => {
    _render(
      <AttendeeOrganizationDropdown
        options={options}
        selectedOrganization={''}
        onChange={() => {
          vi.fn()
        }}
      />,
    )
    expect(screen.queryByText(option)).not.toBeInTheDocument()
    await userEvent.click(
      screen.getByLabelText(t('components.organization-dropdown.title')),
    )
    expect(screen.getByText(option)).toBeInTheDocument()
  })
})
