import { useOrganizations } from '@app/hooks/useOrganizations'
import { LoadingStatus } from '@app/util'

import { render, screen, userEvent } from '@test/index'

import { InviteUserToOrganization } from './InviteUserToOrganization'

jest.mock('@app/hooks/useOrganizations', () => ({
  useOrganizations: jest.fn(),
}))

const useOrganizationsMock = jest.mocked(useOrganizations)

it('validates that at least one email has been entered', async () => {
  useOrganizationsMock.mockReturnValue({
    loading: false,
    orgs: [],
    status: LoadingStatus.SUCCESS,
    mutate: jest.fn(),
    error: undefined,
  })

  render(<InviteUserToOrganization />)

  await userEvent.click(screen.getByRole('button', { name: /invite user/i }))

  expect(screen.getByText(/work email is required/i)).toBeInTheDocument()
})

it('validates that entered email is valid', async () => {
  useOrganizationsMock.mockReturnValue({
    loading: false,
    orgs: [],
    status: LoadingStatus.SUCCESS,
    mutate: jest.fn(),
    error: undefined,
  })

  render(<InviteUserToOrganization />)

  await userEvent.type(screen.getByLabelText(/work email/i), 'email@email.com ')

  await userEvent.click(screen.getByRole('button', { name: /invite user/i }))

  expect(
    screen.getByText(/please enter a valid email address/i)
  ).toBeInTheDocument()
})
