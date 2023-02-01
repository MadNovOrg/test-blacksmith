import { ThemeProvider } from '@mui/material/styles'
import { waitFor, render as _render, screen } from '@testing-library/react'
import Chance from 'chance'
import { deepmerge } from 'deepmerge-ts'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { DeepPartial } from 'ts-essentials'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import '@app/i18n/config'

import { AuthContext } from '@app/context/auth'
import { injectACL } from '@app/context/auth/permissions'
import { SnackbarProvider } from '@app/context/snackbar'
import theme from '@app/theme'

import { defaultProviders, Providers } from './providers'

const chance = new Chance()

export const VALID_PHONE_NUMBER = '2011111111'

type TestRouterProps = { initialEntries?: string[] }

export const TestMemoryRouter: React.FC<TestRouterProps> = ({
  children,
  initialEntries,
}) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <QueryParamProvider
        adapter={ReactRouter6Adapter}
        options={{ updateType: 'replaceIn' }}
      >
        {children}
      </QueryParamProvider>
    </MemoryRouter>
  )
}

function render(
  ui: React.ReactElement,
  providers: DeepPartial<Providers> = {},
  router: TestRouterProps = {}
) {
  const context = deepmerge(defaultProviders, providers) as Providers

  const wrapper: React.FC = ({ children }) => {
    return (
      <TestMemoryRouter {...router}>
        <AuthContext.Provider value={injectACL(context.auth)}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>{children}</SnackbarProvider>
          </ThemeProvider>
        </AuthContext.Provider>
      </TestMemoryRouter>
    )
  }

  return {
    ..._render(ui, { wrapper }),
    context,
  }
}

function waitForCalls<T extends (...args: unknown[]) => unknown>(
  target: jest.MockedFunction<T> | jest.SpyInstance,
  calls = 1,
  timeout?: number
): Promise<void> {
  return waitFor(() => expect(target).toHaveBeenCalledTimes(calls), {
    timeout,
  })
}

function waitForText(text: string, timeout?: number): Promise<void> {
  return waitFor(() => expect(screen.queryByText(text)).toBeInTheDocument(), {
    timeout,
  })
}

const currencyFormatter = Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
})

function formatCurrency(amount: number) {
  return currencyFormatter.format(amount)
}

// Re-export everything
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export * from './mockCognitoToProfile'
export {
  render,
  defaultProviders as providers,
  waitForCalls,
  chance,
  waitForText,
  formatCurrency,
}
