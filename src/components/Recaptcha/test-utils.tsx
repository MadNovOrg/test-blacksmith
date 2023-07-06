import React, { ComponentProps } from 'react'

import { Recaptcha } from '.'

export function createRecaptchaComp() {
  // eslint-disable-next-line react/display-name
  return ({ onSuccess, onExpired }: ComponentProps<typeof Recaptcha>) => {
    return (
      <>
        <button
          data-testid="recaptcha-success"
          onClick={() => onSuccess('token')}
        >
          Recaptcha
        </button>

        <button
          data-testid="recaptcha-expired"
          onClick={() => (onExpired ? onExpired() : undefined)}
        >
          Expire
        </button>
      </>
    )
  }
}
