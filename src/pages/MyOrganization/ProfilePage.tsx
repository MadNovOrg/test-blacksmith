import React from 'react'

import { CertificationDetails } from '@app/pages/components/CertificationDetails'

type ProfilePageProps = unknown

export const ProfilePage: React.FC<ProfilePageProps> = () => {
  const profile = {
    fullName: 'User Name',
  }

  const certification = {
    title: 'Positive Behaviour Training: Level One',
    passDate: new Date(2020, 4, 17),
    expirationDate: new Date(2023, 4, 17),
    modules: Array.from({ length: 10 }, (_, i) => ({
      module: {
        name: `Positive Behaviour Theory Module ${i}`,
      },
    })),
  }

  return (
    <div className="px-8">
      <div className="pb-8 font-light text-2xl sm:text-4xl">
        {profile.fullName}
      </div>

      <CertificationDetails certification={certification} />
    </div>
  )
}
