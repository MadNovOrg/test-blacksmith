import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { LoggedOutHeader } from '@app/components/LoggedOutHeader'

export const ContactedConfirmationPage = () => {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  console.log(email)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoggedOutHeader />

      <div>
        <div className="w-60 md:w-96">
          {email !== 'null' && email !== null ? (
            <p
              className="font-light text-center text-xs md:text-base"
              data-testid="will-contact-you"
            >
              We&apos;re aware you&apos;re having some issues, a member of our
              team will contact you at {email} as soon as possible
            </p>
          ) : (
            <p
              className="font-light text-center text-xs md:text-base"
              data-testid="will-contact-you"
            >
              We have received your contact request and will reply as soon as
              possible
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
