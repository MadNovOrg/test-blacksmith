import { Auth } from 'aws-amplify'
import React from 'react'

import { gqlRequest } from '@app/lib/gql-request'

import { render, screen, waitFor, userEvent } from '@test/index'

import { Form } from './Form'

jest.mock('@app/hooks/use-fetcher')
jest.mock('@app/lib/gql-request')

const gqlRequestMocked = jest.mocked(gqlRequest)
const authRequestMocked = jest.mocked(Auth)

const defaultProps = {
  onSignUp: jest.fn(),
  courseId: 123,
  quantity: 2,
}

describe('Form', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('displays error message if first name not provided', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    userEvent.type(screen.getByTestId('input-phone'), '0000000000')
    userEvent.click(screen.getByLabelText('T&Cs'))
    await waitFor(() => userEvent.click(screen.getByTestId('signup-form-btn')))
    expect(screen.getByText(/First Name is required/)).toBeInTheDocument()
  })

  it('displays error message if surname not provided', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    userEvent.type(screen.getByTestId('input-phone'), '0000000000')
    userEvent.click(screen.getByLabelText('T&Cs'))
    await waitFor(() => userEvent.click(screen.getByTestId('signup-form-btn')))
    expect(screen.getByText(/Surname is required/)).toBeInTheDocument()
  })

  it('displays error message if password not provided', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    userEvent.type(screen.getByTestId('input-phone'), '0000000000')
    userEvent.click(screen.getByLabelText('T&Cs'))
    await waitFor(() => userEvent.click(screen.getByTestId('signup-form-btn')))
    expect(
      screen.getByText(/Password must be at least 8 characters/)
    ).toBeInTheDocument()
  })

  it('displays error message if phone number not provided', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    userEvent.click(screen.getByLabelText('T&Cs'))
    await waitFor(() => userEvent.click(screen.getByTestId('signup-form-btn')))
    expect(screen.getByText(/Phone is required/)).toBeInTheDocument()
  })

  it('displays error message if date of birth is not provided', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    userEvent.type(screen.getByTestId('input-phone'), '0000000000')

    userEvent.click(screen.getByLabelText('T&Cs'))
    await waitFor(() => userEvent.click(screen.getByTestId('signup-form-btn')))
    expect(screen.getByText(/Please enter a valid date/)).toBeInTheDocument()
  })

  it('displays error message if T&Cs not accepted', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    userEvent.type(screen.getByTestId('input-phone'), '0000000000')
    await waitFor(() => userEvent.click(screen.getByTestId('signup-form-btn')))
    expect(
      screen.getByText(/Accepting our T&C is required/)
    ).toBeInTheDocument()
  })

  it('displays error message if unknown error occurs on signup', async () => {
    gqlRequestMocked.mockImplementation(() => {
      throw new Error()
    })
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    userEvent.type(screen.getByTestId('input-phone'), '0000000000')

    // Selects your default value of the date field
    userEvent.type(screen.getByLabelText(/date of birth/i), '20/03/1990')

    userEvent.click(screen.getByLabelText('T&Cs'))
    await waitFor(() => userEvent.click(screen.getByTestId('signup-form-btn')))
    const errorMessageField = screen.getByTestId('signup-form-error')
    expect(errorMessageField).toBeInTheDocument()
    expect(errorMessageField).toHaveTextContent(
      'An error occurred. Please try again.'
    )
  })

  it('displays error message if email already exists', async () => {
    gqlRequestMocked.mockResolvedValue({})
    authRequestMocked.signUp.mockImplementation(() => {
      const error = new Error() as Error & { code: string }
      error.code = 'UsernameExistsException'
      throw error
    })
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    userEvent.type(screen.getByTestId('input-phone'), '0000000000')

    // Selects your default value of the date field
    userEvent.type(screen.getByLabelText(/date of birth/i), '20/03/1990')

    userEvent.click(screen.getByLabelText('T&Cs'))
    await waitFor(() => userEvent.click(screen.getByTestId('signup-form-btn')))

    const errorMessageField = screen.getByTestId('signup-form-error')
    expect(errorMessageField).toBeInTheDocument()
    expect(errorMessageField).toHaveTextContent(
      'An account with the given email already exists.'
    )
  })
})
