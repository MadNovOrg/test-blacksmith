import React from 'react'

import {
  MUTATION as LinkGo1Profile,
  ResponseType as LinkGo1ProfileResponseType,
} from '@app/queries/user/link-go1-profile'
import { useFetcher } from '@app/hooks/use-fetcher'

type MyProfilePageProps = unknown

export const MyProfilePage: React.FC<MyProfilePageProps> = () => {
  const fetcher = useFetcher()

  const linkGo1 = async () => {
    const data = await fetcher<LinkGo1ProfileResponseType>(LinkGo1Profile)
    console.log(data.linkGo1)
  }

  return (
    <div>
      <p className="font-light text-3xl">My Profile</p>

      <div className="mt-4 flex">
        <button onClick={linkGo1} className="btn primary">
          Link Go1 Profile
        </button>
      </div>
    </div>
  )
}
