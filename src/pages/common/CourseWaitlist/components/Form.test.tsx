import React from 'react'

import { chance, render, screen, userEvent, waitFor } from '@test/index'

import { Form, FormInputs } from './Form'

describe('component: Waitlist/Form', () => {
  it('validates form', async () => {
    render(<Form onSuccess={jest.fn} saving={false} />)

    await userEvent.click(screen.getByText(/join waiting list/i))

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/surname is required/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter your email/i)).toBeInTheDocument()
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument()
      expect(
        screen.getByText(/organisation name is required/i)
      ).toBeInTheDocument()
    })

    await userEvent.type(screen.getByLabelText(/work email/i), 'invalid-email')

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
    })
  })

  it('calls callback when form is submitted', async () => {
    const submittedData: FormInputs = {
      firstName: chance.first(),
      surname: chance.last(),
      email: chance.email(),
      orgName: chance.name(),
      phone: '1111111',
    }
    const onSuccessMock = jest.fn()

    render(<Form onSuccess={onSuccessMock} saving={false} />)

    await userEvent.type(
      screen.getByLabelText(/first name/i),
      submittedData.firstName
    )
    await userEvent.type(
      screen.getByLabelText(/last name/i),
      submittedData.surname
    )
    await userEvent.type(
      screen.getByLabelText(/email/i),
      submittedData.email ?? ''
    )
    await userEvent.type(screen.getByLabelText(/phone/i), submittedData.phone)
    await userEvent.type(
      screen.getByLabelText(/organisation name/i),
      submittedData.orgName
    )

    await userEvent.click(screen.getByText(/join waiting list/i))

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledTimes(1)
      expect(onSuccessMock).toHaveBeenCalledWith({
        ...submittedData,
        phone: '+44 1111 111',
      })
    })
  })
})
