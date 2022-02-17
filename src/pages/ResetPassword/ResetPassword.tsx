import React, {
  useEffect,
  useState,
  FocusEvent,
  KeyboardEvent,
  ChangeEvent,
} from 'react'
import { Auth } from 'aws-amplify'
import {
  createSearchParams,
  useSearchParams,
  useNavigate,
} from 'react-router-dom'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { Input } from '@app/components/Input'
import { LoggedOutHeader } from '@app/components/LoggedOutHeader'

type VerificationCodeState = {
  [key: string]: string
}

type E = {
  code: string
  message: string
}

type ErrorState = {
  emailErrorMessage: string
  passwordErrorMessage: string
  codeErrorMessage: string
}

type SpecificErrorCodeToMessage = {
  passwordErrorMessage: string
  emailErrorMessage: string
  codeErrorMessage: string
}
interface Map {
  [key: string]: SpecificErrorCodeToMessage | undefined
}

const errorCodeToMessageMapping: Map = {
  NotAuthorizedException: {
    passwordErrorMessage: 'incorrect-username-or-password',
    emailErrorMessage: 'incorrect-username-or-password',
    codeErrorMessage: '',
  },
  UserNotFoundException: {
    passwordErrorMessage: '',
    emailErrorMessage: 'user-does-not-exist',
    codeErrorMessage: '',
  },
  InvalidParameterException: {
    passwordErrorMessage: 'enter-password',
    emailErrorMessage: '',
    codeErrorMessage: '',
  },
  InvalidPasswordException: {
    passwordErrorMessage: 'invalid-password',
    emailErrorMessage: '',
    codeErrorMessage: '',
  },
  CodeMismatchException: {
    passwordErrorMessage: '',
    emailErrorMessage: '',
    codeErrorMessage: 'incorrect-passcode',
  },
}

const otpNumFields = 6

const useVerificationInputFields = () => {
  const [verificationCodeValues, setVerificationCodeValues] =
    React.useState<VerificationCodeState>({
      '0': '',
      '1': '',
      '2': '',
      '3': '',
      '4': '',
      '5': '',
    })

  return {
    verificationCodeValues,
    setVerificationCodeValues,
    handleFocus: (e: FocusEvent<HTMLInputElement>) => {
      const { name } = e.target
      const fieldIndex = name.split('-')[1]
      setVerificationCodeValues(s => ({
        ...s,
        [fieldIndex]: '',
      }))
    },
    handleBackSpace: (e: KeyboardEvent<HTMLInputElement>) => {
      const { maxLength, value, name } = e.target as HTMLInputElement
      const fieldIndex = name.split('-')[1]

      // Check if they hit the max character length
      if (value.length <= maxLength) {
        // Check if first character
        if (parseInt(fieldIndex, 10) !== 0) {
          // Get the previous input field
          const prevSibling = document.querySelector(
            `input[name=code-${parseInt(fieldIndex, 10) - 1}]`
          )

          // If found, focus the previous field
          if (prevSibling !== null) {
            ;(prevSibling as HTMLElement).focus()
          }
        }
      }

      setVerificationCodeValues(s => ({
        ...s,
        [fieldIndex.toString()]: '',
      }))
    },
    handleChange: (e: ChangeEvent<HTMLInputElement>) => {
      const { maxLength, value, name } = e.target
      const fieldIndex = name.split('-')[1]

      // Check if they hit the max character length
      if (value.length >= maxLength) {
        // Check if it's not the last input field
        if (parseInt(fieldIndex, 10) < otpNumFields) {
          // Get the next input field
          const nextSibling = document.querySelector(
            `input[name=code-${parseInt(fieldIndex, 10) + 1}]`
          )

          // If found, focus the next field
          if (nextSibling !== null) {
            ;(nextSibling as HTMLElement).focus()
          }
        }
      }

      setVerificationCodeValues(s => ({
        ...s,
        [fieldIndex]: value,
      }))
    },
  }
}

export const ResetPasswordPage = () => {
  const {
    handleChange,
    handleFocus,
    handleBackSpace,
    verificationCodeValues,
    setVerificationCodeValues,
  } = useVerificationInputFields()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const email = searchParams.get('email')
  const code = searchParams.get('confirmation_code')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>('')
  const [alreadyResent, setAlreadyResent] = useState(false)
  const [confirmationNewPassword, setConfirmationNewPassword] =
    useState<string>('')

  const [errorState, setErrorState] = useState<ErrorState>({
    emailErrorMessage: '',
    passwordErrorMessage: '',
    codeErrorMessage: '',
  })

  useEffect(() => {
    if (code !== null) {
      for (let i = 0; i < (code as string).length; i++) {
        setVerificationCodeValues(s => ({
          ...s,
          [i]: (code as string)[i],
        }))
      }
    }
  }, [code, setVerificationCodeValues])

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()

    let error = false

    if (newPassword !== confirmationNewPassword) {
      error = true
      setErrorState(s => ({
        ...s,
        passwordErrorMessage: t('pages.reset-password.passwords-must-match'),
      }))
    }

    if (newPassword === '' && confirmationNewPassword === '') {
      error = true
      setErrorState(s => ({
        ...s,
        passwordErrorMessage: t('pages.reset-password.empty-password'),
      }))
    }

    let codeInputted = ''
    for (let i = 0; i < otpNumFields; i++) {
      codeInputted += verificationCodeValues[i.toString()]
    }
    const codeToSubmit = code || codeInputted

    if (codeToSubmit === null || codeToSubmit.length != otpNumFields) {
      error = true
      setErrorState(s => ({
        ...s,
        codeErrorMessage: t(
          'pages.reset-password.verification-code-six-digits'
        ),
      }))
    }

    if (error) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      await Auth.forgotPasswordSubmit(
        email as string,
        codeToSubmit,
        newPassword
      )
      navigate({
        pathname: 'login',
        search: `?${createSearchParams({
          email: email as string,
          justResetPassword: 'true',
        })}`,
      })
    } catch (err: unknown) {
      setIsLoading(false)
      const error = err as E
      setErrorState({
        emailErrorMessage: t(
          `pages.reset-password.${
            errorCodeToMessageMapping[error?.code || '']?.emailErrorMessage
          }`
        ),
        passwordErrorMessage: t(
          `pages.reset-password.${
            errorCodeToMessageMapping[error?.code || '']?.passwordErrorMessage
          }`
        ),
        codeErrorMessage: t(
          `pages.reset-password.${
            errorCodeToMessageMapping[error?.code || '']?.codeErrorMessage
          }`
        ),
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoggedOutHeader />

      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <div className="w-60 md:w-96">
          <p className="mb-6 text-sm	font-light">
            {t('pages.reset-password.title')}
          </p>

          {!alreadyResent ? (
            <p className="mb-8 text-sm font-light">
              {t('pages.reset-password.not-recieved-email')}
              <span
                className="underline cursor-pointer"
                onClick={async () => {
                  setAlreadyResent(true)

                  // tell cognito again to send either email or sms with pw
                  // reset code and link to reset form
                  await Auth.forgotPassword(email as string)
                }}
              >
                {t('pages.reset-password.can-resend-code')}
              </span>
            </p>
          ) : (
            <p className="mb-8 text-sm font-light">
              {t('pages.reset-password.not-recieved-email')}
              <span
                className="underline cursor-pointer"
                onClick={() =>
                  navigate({
                    pathname: '/contacted-confirmation',
                    search: `?${createSearchParams({
                      email: email as string,
                    })}`,
                  })
                }
              >
                {t('pages.reset-password.please-contact')}
              </span>
            </p>
          )}

          <p className="mb-8 text-sm font-light">
            {t('pages.reset-password.changing-password-text')}: <br></br>
            <span className="mt-4 text-base text-center font-medium">
              {email}
            </span>
          </p>

          <form onSubmit={onSubmit}>
            <div className="mb-10">
              <Input
                onChange={e => {
                  setErrorState(s => ({
                    ...s,
                    passwordErrorMessage: '',
                  }))
                  setNewPassword(e.target.value)
                }}
                error={errorState.passwordErrorMessage}
                placeholder={t('pages.reset-password.password-placeholder')}
                isPassword={true}
                name="password"
                title="password"
                label={t('pages.reset-password.new-password-label')}
                type="password"
              ></Input>
            </div>

            <div className="mb-10">
              <Input
                onChange={e => {
                  setErrorState(s => ({
                    ...s,
                    passwordErrorMessage: '',
                  }))
                  setConfirmationNewPassword(e.target.value)
                }}
                error={errorState.passwordErrorMessage}
                placeholder={t('pages.reset-password.password-placeholder')}
                isPassword={true}
                name="passwordConfirm"
                title="password"
                label={t('pages.reset-password.confirm-new-password-label')}
                type="password"
              ></Input>
            </div>

            <div className="-ml-4">
              <div
                className={clsx(
                  { 'text-red': errorState.codeErrorMessage.length > 0 },
                  'text-xs ml-4 mb-4'
                )}
              >
                {t('pages.reset-password.enter-passcode')}
              </div>
              {Object.keys(verificationCodeValues).map(key => {
                return (
                  <input
                    onPaste={e => {
                      e.clipboardData.items[0].getAsString(text => {
                        for (let i = 0; i < otpNumFields; i++) {
                          setVerificationCodeValues(s => ({
                            ...s,
                            [i]: text[i],
                          }))
                        }
                      })
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace') {
                        handleBackSpace(e)
                      }
                    }}
                    value={verificationCodeValues[key]}
                    placeholder={'#'}
                    key={key}
                    maxLength={1}
                    type="text"
                    name={`code-${key}`}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    className={clsx(
                      {
                        'border-red': errorState.codeErrorMessage.length > 0,
                        'border-gray-300':
                          errorState.codeErrorMessage.length === 0,
                      },
                      'outline-0 border-b-2 border-l-0 border-r-0 border-t-0 focus:ring-0 placeholder-gray-400 placeholder:text-3xl text-3xl font-thin ml-4 w-12'
                    )}
                  ></input>
                )
              })}
            </div>

            <div className="-ml-4">
              <div className="text-xs ml-4 mb-4 mt-2 text-red">
                {errorState.codeErrorMessage}
              </div>
            </div>

            <div className="text-center mt-14">
              <button type="submit" className="btn primary w-60">
                <p className="text-base ml-10 mr-8 text-center">
                  {t('pages.reset-password.reset')}
                </p>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
