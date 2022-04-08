import { CognitoUser, CodeDeliveryDetails } from 'amazon-cognito-identity-js'
import { Auth } from 'aws-amplify'
import React from 'react'

import {
  render,
  screen,
  chance,
  userEvent,
  waitForCalls,
  waitForText,
} from '@test/index'

import { SignUpForm } from './Form'

const defaultProps = {
  onSignUp: jest.fn(),
}

const AuthMock = jest.mocked(Auth)

describe('page: SignUpForm', () => {
  it('renders as expected', async () => {
    const props = { ...defaultProps }
    render(<SignUpForm {...props} />)

    expect(screen.getByTestId('signup-form-btn')).toBeInTheDocument()
    expect(AuthMock.signUp).not.toBeCalled()
  })

  it('shows error when fields are empty', async () => {
    const props = { ...defaultProps }
    render(<SignUpForm {...props} />)

    const submitBtn = screen.getByTestId('signup-form-btn')
    userEvent.click(submitBtn)

    await waitForText('Please enter your email')
    screen.getByText('Given name is required')
    screen.getByText('Family name is required')
    screen.getByText('Password must be at least 8 characters')
    screen.getByText('Confirm Password is required')
    screen.getByText('Accepting our T&C is required')

    expect(AuthMock.signUp).not.toBeCalled()
  })

  it('shows error when email is invalid', async () => {
    const props = { ...defaultProps }
    render(<SignUpForm {...props} />)

    const emailInput = screen.getByTestId('signup-email-input')
    userEvent.type(emailInput, 'not a valid email')

    const submitBtn = screen.getByTestId('signup-form-btn')
    userEvent.click(submitBtn)

    await waitForText('Please enter a valid email address')

    expect(AuthMock.signUp).not.toBeCalled()
  })

  describe('password validation', () => {
    it('shows error when password is less than 8 characters', async () => {
      const props = { ...defaultProps }
      render(<SignUpForm {...props} />)

      const input = screen.getByTestId('signup-pass-input')
      userEvent.type(input, 'abcde')

      const submitBtn = screen.getByTestId('signup-form-btn')
      userEvent.click(submitBtn)

      await waitForText('Password must be at least 8 characters')

      expect(AuthMock.signUp).not.toBeCalled()
    })

    it('shows error when password does not have uppercase letters', async () => {
      const props = { ...defaultProps }
      render(<SignUpForm {...props} />)

      const input = screen.getByTestId('signup-pass-input')
      userEvent.type(input, 'abcdefgh')

      const submitBtn = screen.getByTestId('signup-form-btn')
      userEvent.click(submitBtn)

      await waitForText('Password must contain at least 1 uppercase letter')

      expect(AuthMock.signUp).not.toBeCalled()
    })

    it('shows error when password does not have lowercase letters', async () => {
      const props = { ...defaultProps }
      render(<SignUpForm {...props} />)

      const input = screen.getByTestId('signup-pass-input')
      userEvent.type(input, 'ABCDEFGH')

      const submitBtn = screen.getByTestId('signup-form-btn')
      userEvent.click(submitBtn)

      await waitForText('Password must contain at least 1 lowercase letter')

      expect(AuthMock.signUp).not.toBeCalled()
    })

    it('shows error when password does not have numbers', async () => {
      const props = { ...defaultProps }
      render(<SignUpForm {...props} />)

      const input = screen.getByTestId('signup-pass-input')
      userEvent.type(input, 'AbCdEfGh')

      const submitBtn = screen.getByTestId('signup-form-btn')
      userEvent.click(submitBtn)

      await waitForText('Password must contain at least 1 number')

      expect(AuthMock.signUp).not.toBeCalled()
    })

    it('shows error when password does not have special characters', async () => {
      const props = { ...defaultProps }
      render(<SignUpForm {...props} />)

      const input = screen.getByTestId('signup-pass-input')
      userEvent.type(input, 'AbCdEfG1')

      const submitBtn = screen.getByTestId('signup-form-btn')
      userEvent.click(submitBtn)

      await waitForText('Password must contain at least 1 special character')

      expect(AuthMock.signUp).not.toBeCalled()
    })

    it('shows as valid when password meets criteria', async () => {
      const props = { ...defaultProps }
      render(<SignUpForm {...props} />)

      const pass = [
        chance.string({ length: 2, alpha: true, casing: 'upper' }),
        chance.string({ length: 2, alpha: true, casing: 'lower' }),
        chance.string({ length: 3, numeric: true }),
        chance.string({ length: 1, symbols: true, pool: '$!%&#£@' }),
      ].join('')

      const passInput = screen.getByTestId('signup-pass-input')
      userEvent.type(passInput, pass)

      const confInput = screen.getByTestId('signup-passconf-input')
      userEvent.type(confInput, 'no-match')

      const submitBtn = screen.getByTestId('signup-form-btn')
      userEvent.click(submitBtn)

      await waitForText('Confirm password must be same as password')

      expect(passInput.getAttribute('aria-invalid')).toBe('false')
      expect(AuthMock.signUp).not.toBeCalled()
    })
  })

  it('calls onSignUp on success response from Amplify', async () => {
    const userId = chance.guid()

    const props = { ...defaultProps }
    render(<SignUpForm {...props} />)

    const email = chance.email()
    const emailInput = screen.getByTestId('signup-email-input')
    userEvent.type(emailInput, email)

    const givenName = chance.first()
    const givenNameInput = screen.getByTestId('signup-givenName-input')
    userEvent.type(givenNameInput, givenName)

    const familyName = chance.last()
    const familyNameInput = screen.getByTestId('signup-familyName-input')
    userEvent.type(familyNameInput, familyName)

    const pass = [
      chance.string({ length: 2, alpha: true, casing: 'upper' }),
      chance.string({ length: 2, alpha: true, casing: 'lower' }),
      chance.string({ length: 3, numeric: true }),
      chance.string({ length: 1, symbols: true, pool: '$!%&#£@' }),
    ].join('')

    const passInput = screen.getByTestId('signup-pass-input')
    userEvent.type(passInput, pass)

    const confInput = screen.getByTestId('signup-passconf-input')
    userEvent.type(confInput, pass)

    const tcsCheck = screen.getByLabelText(`T&Cs`)
    userEvent.click(tcsCheck)

    const submitBtn = screen.getByTestId('signup-form-btn')

    // Simulate a failure
    AuthMock.signUp.mockRejectedValueOnce({ code: 'SOME_ERROR' })
    userEvent.click(submitBtn)
    await waitForCalls(AuthMock.signUp)
    await waitForText('An error occurred. Please try again.')

    // Simulate a success
    AuthMock.signUp.mockResolvedValue({
      userSub: userId,
      userConfirmed: true,
      user: {} as CognitoUser, // not used
      codeDeliveryDetails: {} as CodeDeliveryDetails, // not used
    })

    userEvent.click(submitBtn)
    await waitForCalls(AuthMock.signUp)

    expect(AuthMock.signUp).toBeCalledWith({
      username: email,
      password: pass,
      attributes: {
        email,
        given_name: givenName,
        family_name: familyName,
        'custom:accept_marketing': '0',
        'custom:accept_tcs': '1',
      },
    })

    expect(props.onSignUp).toBeCalledWith({
      username: email,
      userSub: userId,
      confirmed: true,
    })
  })
})
