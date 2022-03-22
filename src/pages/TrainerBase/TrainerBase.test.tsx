import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { TrainerBasePage } from './TrainerBase'

import { render, screen } from '@test/index'
import { RoleName } from '@app/types'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: (props: unknown) => {
    mockNavigate(props)
    return null
  },
}))

describe('page: TrainerBase', () => {
  it('redirects to my-training if ACL fails', async () => {
    const allowedRoles = new Set([RoleName.USER])

    render(
      <MemoryRouter>
        <TrainerBasePage />
      </MemoryRouter>,
      { auth: { profile: { allowedRoles } } }
    )

    expect(mockNavigate).toBeCalledWith({ to: '/my-training' })
  })

  it('renders TrainerBaser if ACL passes', async () => {
    const allowedRoles = new Set([RoleName.USER, RoleName.TRAINER])

    render(
      <MemoryRouter>
        <TrainerBasePage />
      </MemoryRouter>,
      { auth: { profile: { allowedRoles } } }
    )

    expect(mockNavigate).not.toBeCalled()
    expect(screen.getByTestId('trainer-base-wrap')).toBeInTheDocument()
  })
})
