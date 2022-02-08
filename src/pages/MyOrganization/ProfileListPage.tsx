/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { Icon } from '@app/components/Icon'

import { Profile } from '@app/types'

type ProfileListPageProps = unknown

export const ProfileListPage: React.FC<ProfileListPageProps> = () => {
  const { t } = useTranslation()

  const mockData = {
    'level-one': new Array<Profile>(),
    'level-two': new Array<Profile>(),
    advanced: new Array<Profile>(),
    'bild-act-certified': new Array<Profile>(),
  }
  for (const [, arr] of Object.entries(mockData)) {
    Array.from({ length: 10 }).forEach((_, i) => {
      // @ts-ignore
      arr.push({
        createdAt: '',
        updatedAt: '',
        title: '',
        id: `${i}`,
        givenName: 'User',
        familyName: 'Name',
      })
    })
  }

  return (
    <div>
      <div className="pb-8 font-light text-2xl sm:text-4xl">
        {t('pages.my-organization.profiles.title')}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-4xl">
        {Object.entries(mockData).map(([certificateType, profiles]) => (
          <div key={certificateType} className="grid grid-row">
            <div className="font-bold">
              {t(`common.certificates.${certificateType}`)}:
            </div>
            {profiles.map(profile => (
              <NavLink
                to={`/my-organization/profiles/${profile.id}`}
                key={profile.id}
                className="w-full py-3 border-b border-grey-200 flex place-content-between hover:border-black hover:font-bold"
              >
                <span>
                  {profile.givenName} {profile.familyName}
                </span>
                <Icon name="keyboard-arrow-right" className="mr-2" />
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
