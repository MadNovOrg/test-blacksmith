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
    const roles = [{ role: { name: RoleName.USER } }]

    render(
      <MemoryRouter>
        <TrainerBasePage />
      </MemoryRouter>,
      { auth: { profile: { roles } } }
    )

    expect(mockNavigate).toBeCalledWith({ to: '/my-training' })
  })

  it('renders TrainerBaser if ACL passes', async () => {
    const roles = [
      { role: { name: RoleName.USER } },
      { role: { name: RoleName.TRAINER } },
    ]

    render(
      <MemoryRouter>
        <TrainerBasePage />
      </MemoryRouter>,
      { auth: { profile: { roles } } }
    )

    expect(mockNavigate).not.toBeCalled()
    expect(screen.getByTestId('trainer-base-wrap')).toBeInTheDocument()
  })
})
