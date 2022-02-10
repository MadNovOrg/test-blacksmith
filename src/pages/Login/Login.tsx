import React, { useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as EmailValidator from 'email-validator'

import { Input } from '@app/components/Input'
import { LoggedOutHeader } from '@app/components/LoggedOutHeader'

import { useAuth } from '@app/context/auth'

type SpecificErrorCodeToMessage = {
  passwordMessage: string
  emailMessage: string
}
interface Map {
  [key: string]: SpecificErrorCodeToMessage | undefined
}

const errorCodeToMesaageMapping: Map = {
  NotAuthorizedException: {
    passwordMessage: 'Incorrect username or password',
    emailMessage: 'Incorrect username or password',
  },
  UserNotFoundException: {
    passwordMessage: '',
    emailMessage: 'User does not exist',
  },
  InvalidParameterException: {
    passwordMessage: 'Please enter a password',
    emailMessage: '',
  },
  '401': {
    passwordMessage: 'New password required',
    emailMessage: '',
  },
}

type LocationState = {
  from: {
    pathname: string
  }
}

type ErrorState = {
  emailErrorMessage: string
  passwordErrorMessage: string
}

export const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  const [errorState, setErrorState] = useState<ErrorState>({
    emailErrorMessage: '',
    passwordErrorMessage: '',
  })

  const [email, setEmail] = useState(searchParams.get('email'))
  const [password, setPassword] = useState('')
  const showResetPasswordMessage =
    searchParams.get('email') &&
    searchParams.get('justResetPassword') === 'true'

  const from = (location.state as LocationState)?.from?.pathname || '/'

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!EmailValidator.validate(email as string)) {
      setErrorState(s => ({
        ...s,
        emailErrorMessage: 'Please enter a valid email address',
      }))
    } else {
      setErrorState(s => ({
        ...s,
        emailErrorMessage: '',
      }))

      const loginResult = await auth.login(email as string, password)

      // if successdfully logged in; redirect, otherwise render error message(s)
      if (loginResult.error === undefined) {
        navigate(from, { replace: true })
      } else {
        if (
          errorCodeToMesaageMapping[loginResult.error?.code || '']?.emailMessage
        ) {
          setErrorState(s => ({
            ...s,
            emailErrorMessage:
              errorCodeToMesaageMapping[loginResult.error?.code || '']
                ?.emailMessage ||
              'An error occurred. Please contact your administrator',
          }))
        }

        if (
          errorCodeToMesaageMapping[loginResult.error?.code || '']
            ?.passwordMessage
        ) {
          setErrorState(s => ({
            ...s,
            passwordErrorMessage:
              errorCodeToMesaageMapping[loginResult.error?.code || '']
                ?.passwordMessage ||
              'An error occurred. Please contact your administrator',
          }))
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoggedOutHeader />

      {showResetPasswordMessage && (
        <p className="mb-8 text-sm md:text-base">
          Please login with your new password
        </p>
      )}

      <div className="w-60 md:w-96">
        <form onSubmit={handleSubmit}>
          <section className="space-y-6 mb-16">
            <Input
              onChange={e => setEmail(e.target.value)}
              error={errorState.emailErrorMessage}
              placeholder="Please enter your email address"
              name="email"
              title="email"
              label="Email Address"
              value={email || ''}
            ></Input>

            <Input
              onChange={e => setPassword(e.target.value)}
              error={errorState.passwordErrorMessage}
              placeholder="Please enter your password"
              isPassword={true}
              name="password"
              title="password"
              label="Password"
              type="password"
            ></Input>
          </section>

          <div className="text-center">
            <button type="submit" className="btn primary w-40">
              Sign In
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12">
        <Link to="/forgot-password" className="text-xs font-light underline">
          Forgotten your password?
        </Link>
      </div>
    </div>
  )
}
