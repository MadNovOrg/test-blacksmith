import { uniqueId } from 'lodash-es'
import React, { useRef } from 'react'
import { useMount } from 'react-use'

type Props = {
  action: RecaptchaActions
  onSuccess: (token: string) => void
  onExpired?: () => void
  onError?: () => void
}

export enum RecaptchaActions {
  JOIN_WAITLIST,
  REGISTRATION,
}

export const Recaptcha: React.FC<Props> = ({
  action,
  onSuccess,
  onExpired,
  onError,
}) => {
  const id = useRef(uniqueId())
  const widgetId = useRef<number>()

  useMount(() => {
    window.grecaptcha.enterprise.ready(async () => {
      if (typeof widgetId.current !== 'undefined') {
        return
      }

      widgetId.current = window.grecaptcha.enterprise.render(id.current, {
        sitekey: import.meta.env.VITE_RECAPTCHA_KEY,
        callback: token => {
          console.log(token)
          onSuccess(token)
        },
        'expired-callback': onExpired,
        'error-callback': onError,
        action: String(action),
      })
    })
  })

  return <div id={id.current} />
}
