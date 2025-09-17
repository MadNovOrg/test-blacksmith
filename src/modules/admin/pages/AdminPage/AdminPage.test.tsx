import { useTranslation } from 'react-i18next'

import { RoleName } from '@app/types'

import { _render, renderHook, screen } from '@test/index'

import { AdminPage } from './AdminPage'

describe(`${AdminPage.name}`, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('displays settings list', async () => {
    // Arrange
    const hubAdminLinks = Object.values(
      t(`pages.admin.connect-settings`, {
        returnObjects: true,
      }),
    )
      .slice(1)
      .map(
        (l: { title: string; description: string }) =>
          `${l.title}${l.description}`,
      )

    // Act
    _render(<AdminPage />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    // Assert
    expect(
      screen.getByText(t('pages.admin.connect-settings.title')),
    ).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(hubAdminLinks.length)
    links.map(l => expect(hubAdminLinks).toContain(l.textContent))
  })

  it(`should display Users, Organisations settings and Course exceptions log only for ${RoleName.LD}`, async () => {
    // Act
    _render(<AdminPage />, {
      auth: {
        activeRole: RoleName.LD,
      },
    })

    // Assert
    expect(
      screen.getByText(t('pages.admin.connect-settings.title')),
    ).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveTextContent(
      t(`pages.admin.connect-settings.users.title`),
    )
    expect(links[1]).toHaveTextContent(
      t(`pages.admin.connect-settings.organisations.title`),
    )
    expect(links[2]).toHaveTextContent(
      t(`pages.admin.connect-settings.course-exceptions-log.title`),
    )
  })
})
