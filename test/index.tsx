import { waitFor, render as _render, screen } from '@testing-library/react'
import React from 'react'
import { deepmerge } from 'deepmerge-ts'
import { DeepPartial } from 'ts-essentials'
import Chance from 'chance'
import '@app/i18n/config'
import { ThemeProvider } from '@mui/material'

import { AuthContext } from '@app/context/auth'
import { injectACL } from '@app/context/auth/permissions'

import { defaultProviders, Providers } from './providers'

import theme from '@app/theme'

const chance = new Chance()

function render(
  ui: React.ReactElement,
  providers: DeepPartial<Providers> = {}
) {
  const context = deepmerge(defaultProviders, providers) as Providers

  const wrapper: React.FC = ({ children }) => {
    return (
      <AuthContext.Provider value={injectACL(context.auth)}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </AuthContext.Provider>
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

// Re-export everything
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export {
  render,
  defaultProviders as providers,
  waitForCalls,
  chance,
  waitForText,
}
