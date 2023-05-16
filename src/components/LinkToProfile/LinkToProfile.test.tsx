import React from 'react'

import { RoleName } from '@app/types'

import { render, screen } from '@test/index'

import { LinkToProfile } from './index'

describe('component: LinkToProfile', () => {
  const profileId = '123'
  const label = 'John Doe'

  it('displays the label', async () => {
    render(
      <LinkToProfile profileId={profileId} isProfileArchived={false}>
        {label}
      </LinkToProfile>
    )

    expect(screen.getByText(label)).toBeInTheDocument()
  })

  const canViewProfileRoles = [
    RoleName.TT_OPS,
    RoleName.TT_ADMIN,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
    RoleName.FINANCE,
    RoleName.LD,
    RoleName.TRAINER,
  ]
  const cannotViewProfileRoles = Object.values(RoleName).filter(
    r => !canViewProfileRoles.includes(r)
  )

  canViewProfileRoles.forEach(role => {
    it(`does display a link if the logged user is ${role} `, async () => {
      render(
        <LinkToProfile profileId={profileId} isProfileArchived={false}>
          {label}
        </LinkToProfile>,
        {
          auth: {
            activeRole: role,
          },
        }
      )

      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        `/profile/${profileId}`
      )
    })
  })

  cannotViewProfileRoles.forEach(role => {
    it(`does not display a link if the logged user is ${role} `, async () => {
      render(
        <LinkToProfile profileId={profileId} isProfileArchived={false}>
          {label}
        </LinkToProfile>,
        {
          auth: {
            activeRole: role,
          },
        }
      )

      expect(screen.getByText(label)).toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: label })
      ).not.toBeInTheDocument()
    })
  })

  const canViewArchivedProfileRoles = [
    RoleName.TT_OPS,
    RoleName.TT_ADMIN,
    RoleName.LD,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
  ].filter(r => canViewProfileRoles.includes(r))

  const cannotViewArchivedProfileRoles = Object.values(RoleName).filter(
    r => !canViewArchivedProfileRoles.includes(r)
  )

  canViewArchivedProfileRoles.forEach(role => {
    it(`does display a link if the attendee is archived and the logged user is ${role} `, async () => {
      render(
        <LinkToProfile profileId={profileId} isProfileArchived={true}>
          {label}
        </LinkToProfile>,
        {
          auth: {
            activeRole: role,
          },
        }
      )

      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        `/profile/${profileId}`
      )
    })
  })

  cannotViewArchivedProfileRoles.forEach(role => {
    it(`does not display a link if the attendee is archived and the logged user is ${role} `, async () => {
      render(
        <LinkToProfile profileId={profileId} isProfileArchived={true}>
          {label}
        </LinkToProfile>,
        {
          auth: {
            activeRole: role,
          },
        }
      )

      expect(screen.getByText(label)).toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: label })
      ).not.toBeInTheDocument()
    })
  })
})
