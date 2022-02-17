import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as EmailValidator from 'email-validator'
import { useTranslation } from 'react-i18next'

import { Input } from '@app/components/Input'
import { LoggedOutHeader } from '@app/components/LoggedOutHeader'

import { useAuth } from '@app/context/auth'

type LocationState = { from: { pathname: string } }
type ErrorState = { emailMessage: string; passMessage: string }
const NO_ERROR: ErrorState = { emailMessage: '', passMessage: '' }

export const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState(NO_ERROR)

  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [password, setPassword] = useState('')

  const showResetPassMessage =
    searchParams.get('email') &&
    searchParams.get('justResetPassword') === 'true'

  const from = (location.state as LocationState)?.from?.pathname || '/'

  const errorCodeToMsg: Record<string, ErrorState> = useMemo(() => {
    return t(`pages.login.errorMessages`, { returnObjects: true })
  }, [t])

  const handleSubmit = useCallback(
    async (event: React.ChangeEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!EmailValidator.validate(email)) {
        setErrorState(s => ({ ...s, ...errorCodeToMsg.InvalidEmail }))
        return
      }

      setIsLoading(true)
      setErrorState(s => ({ ...s, ...NO_ERROR }))

      const { error } = await auth.login(email as string, password)

      if (!error) {
        return navigate(from, { replace: true })
      }

      setIsLoading(false)
      const msgs = errorCodeToMsg[error.code] ?? errorCodeToMsg.UnknownError
      setErrorState(s => ({ ...s, ...msgs }))
    },
    [auth, email, password, from, navigate, errorCodeToMsg]
  )

  const loader = useMemo(() => {
    if (!isLoading) return null

    // Wrapping div covers the form to prevent UI "jumps"
    return (
      <div
        className="absolute z-10 inset-0 bg-white text-center"
        data-testid="LoginLoader"
      >
        <div className="loader"></div>
        <p className="pt-12">
          {t('pages.login.loading-state-part-one')}
          <Link to="/contacted-confirmation" className="underline">
            {t('pages.login.loading-state-part-two')}
          </Link>
        </p>
      </div>
    )
  }, [t, isLoading])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoggedOutHeader />

      <div className="w-60 md:w-96 relative">
        {loader}

        {showResetPassMessage ? (
          <p className="mb-8 text-sm md:text-base">
            {t('pages.login.reset-pass')}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} data-testid="LoginForm">
          <section className="relative space-y-6 mb-16">
            <Input
              name="email"
              value={email}
              label={t('pages.login.email-label')}
              placeholder={t('pages.login.email-placeholder')}
              title={t('pages.login.email-title')}
              onChange={e => setEmail(e.target.value)}
              error={errorState.emailMessage}
            ></Input>

            <Input
              type="password"
              name="password"
              isPassword={true}
              label={t('pages.login.pass-label')}
              placeholder={t('pages.login.pass-placeholder')}
              title={t('pages.login.pass-title')}
              onChange={e => setPassword(e.target.value)}
              error={errorState.passMessage}
            ></Input>
          </section>

          <div className="text-center">
            <button
              type="submit"
              className="btn primary w-40"
              data-testid="LoginSubmit"
            >
              {t('pages.login.submit-label')}
            </button>
          </div>
        </form>

        <div className="text-center mt-12">
          <Link to="/forgot-password" className="text-xs font-light underline">
            {t('pages.login.forgot-label')}
          </Link>
        </div>
      </div>
    </div>
  )
}
