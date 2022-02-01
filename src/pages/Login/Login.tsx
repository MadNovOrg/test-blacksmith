import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import * as EmailValidator from 'email-validator'

import { Icon } from '@app/components/Icon'
import { Button } from '@app/components/Button'
import { Typography } from '@app/components/Typography'
import { CustomLink } from '@app/components/Link'
import { Input } from '@app/components/Input'

import { useSession } from '@app/auth'

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
  const navigate = useNavigate()
  const location = useLocation()
  const session = useSession()

  const [errorState, setErrorState] = useState<ErrorState>({
    emailErrorMessage: '',
    passwordErrorMessage: '',
  })

  const from = (location.state as LocationState)?.from?.pathname || '/'

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!EmailValidator.validate(email)) {
      setErrorState(s => ({
        ...s,
        emailErrorMessage: 'Please enter a valid email address',
      }))
    } else {
      setErrorState(s => ({
        ...s,
        emailErrorMessage: '',
      }))

      const userSession = await session.login(email, password)

      // if successdfully logged in; redirect, otherwise render error message(s)
      if (userSession.error === undefined) {
        navigate(from, { replace: true })
      } else {
        setErrorState(() => ({
          emailErrorMessage:
            errorCodeToMesaageMapping[userSession.error?.code || '']
              ?.emailMessage ||
            'A problem occurred. Please contact your administrator',
          passwordErrorMessage:
            errorCodeToMesaageMapping[userSession.error?.code || '']
              ?.passwordMessage ||
            'A problem occurred. Please contact your administrator',
        }))
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex mb-12">
        <div className="inline-block">
          <Icon
            name="logo-color"
            aria-hidden="true"
            className="w-10 h-10 sm:w-20 sm:h-20"
          />
        </div>

        <div className="ml-2 md:ml-6">
          <Typography variant="lighth4">Team Teach Hub</Typography>
        </div>
      </div>

      <div className="w-60 md:w-96">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <Input
              error={errorState.emailErrorMessage}
              placeholder="Please enter your email address"
              name="email"
              title="email"
              label="Email Address"
            ></Input>
          </div>

          <div className="mb-10">
            <Input
              error={errorState.passwordErrorMessage}
              placeholder="Please enter your password"
              isPassword={true}
              name="password"
              title="password"
              label="Password"
              type="password"
            ></Input>
          </div>

          <div className="text-center">
            <Button variant="primary" type="submit" className="w-40">
              <Typography className="ml-8 mr-8">Sign In</Typography>
            </Button>
          </div>
        </form>
      </div>

      <div>
        <CustomLink to="/login" className="mt-12">
          Forgotten your password?
        </CustomLink>
      </div>
    </div>
  )
}
