import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'

type MyOrganizationPageProps = unknown

export const MyOrganizationPage: React.FC<MyOrganizationPageProps> = () => {
  const { t } = useTranslation()

  const menu = useMemo(
    () => [
      {
        to: '/my-organization/overview',
        title: t('pages.my-organization.overview.title'),
      },
      {
        to: '/my-organization/profiles',
        title: t('pages.my-organization.profiles.title'),
      },
    ],
    [t]
  )

  return (
    <div className="flex">
      <div className="hidden sm:flex sm:flex-col sm:pt-8">
        <div className="flex flex-col">
          {menu.map(m => (
            <div key={m.to} className="text-sm py-3 px-6">
              <NavLink
                to={m.to}
                className={({ isActive }) =>
                  isActive ? 'border-b border-lime-500 font-bold' : ''
                }
              >
                {m.title}
              </NavLink>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 py-2 sm:pt-8 px-8">
        <Outlet />
      </div>
    </div>
  )
}
