import React, { useState } from 'react'
import * as EmailValidator from 'email-validator'
import { Link } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Input } from '@app/components/Input'
import { LoggedOutHeader } from '@app/components/LoggedOutHeader'

type E = {
  code: number
  message: string
}

type SpecificErrorCodeToMessage = {
  emailMessage: string
}
interface Map {
  [key: string]: SpecificErrorCodeToMessage | undefined
}

const errorCodeToMessageMapping: Map = {
  UserNotFoundException: {
    emailMessage: 'user-does-not-exist',
  },
}

type ForgotPasswordFormProps = {
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errorMessage: string
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  onChange,
  errorMessage,
}) => {
  const { t } = useTranslation()
  return (
    <>
      <div className="ml-2 md:ml-6 mb-12 w-2/5 text-center flex flex-col items-center justify-center">
        <p className=" text-xs font-light md:text-sm">
          {t('pages.forgot-password.title')}
        </p>
      </div>

      <div className="w-60 md:w-96">
        <form onSubmit={onSubmit}>
          <div className="mb-5">
            <Input
              onChange={onChange}
              className="pl-0"
              type="text"
              error={errorMessage}
              name="email"
              placeholder={t('pages.forgot-password.email-placeholder')}
              title="email"
              label={t('pages.forgot-password.email-address')}
            ></Input>
          </div>

          <div className="text-center">
            <button type="submit" className="btn primary w-40 mt-12">
              <p className="text-base ml-8 mr-8">{t('common.submit')}</p>
            </button>
          </div>
        </form>

        <div className="mt-12 flex justify-center">
          <Link to="/login" className="text-xs font-light underline">
            {t('common.cancel')}
          </Link>
        </div>
      </div>
    </>
  )
}

type loadingStateProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

const LoadingState: React.FC<loadingStateProps> = ({ onClick }) => {
  const { t } = useTranslation()
  return (
    <>
      <div className="loader"></div>
      <div className="text center mb-6 mt-12">
        <p className="text-xs md:text-base">
          {t('pages.forgot-password.loading-state-part-one')}
          <span className="underline cursor-pointer" onClick={onClick}>
            {t('pages.forgot-password.loading-state-part-two')}
          </span>
        </p>
      </div>
    </>
  )
}

export const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!EmailValidator.validate(email)) {
      setErrorMessage(t('pages.forgot-password.generic-email-error'))
      return
    }

    setIsLoading(true)

    try {
      // tell cognito to send either email or sms with pw reset code and link to reset form
      await Auth.forgotPassword(email)

      navigate({
        pathname: '/reset-password',
        search: `?${createSearchParams({
          email: email,
        })}`,
      })
    } catch (err: unknown) {
      setIsLoading(false)
      const error = err as E
      setErrorMessage(
        t(
          `pages.reset-password.${
            errorCodeToMessageMapping[error?.code || '']?.emailMessage
          }`
        ) || t('pages.forgot-password.generic-error')
      )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoggedOutHeader />

      {isLoading ? (
        <LoadingState
          onClick={() => {
            navigate({
              pathname: '/contacted-confirmation',
              search: `?${createSearchParams({
                email: email,
              })}`,
            })
          }}
        />
      ) : (
        <ForgotPasswordForm
          onChange={e => {
            setEmail(e.target.value)
            setErrorMessage('')
          }}
          onSubmit={onSubmit}
          errorMessage={errorMessage}
        />
      )}
    </div>
  )
}
