import React from 'react'
import { useTranslation } from 'react-i18next'

import { Course_Level_Enum, Grade_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { render, renderHook, screen } from '@test/index'

import { NavLinks } from './NavLinks'

describe('component: NavLinks', () => {
  const { result } = renderHook(() => useTranslation())
  const {
    current: { t },
  } = result

  it('renders USER role links', async () => {
    render(<NavLinks />, {
      auth: {
        profile: {
          courses: [
            {
              grade: Grade_Enum.Pass,
              course: {
                level: Course_Level_Enum.AdvancedTrainer,
                start: '2024-01-10',
                end: '2024-01-11',
              },
            },
          ],
        },
        activeRole: RoleName.USER,
        allowedRoles: new Set([RoleName.USER]),
        activeCertificates: [Course_Level_Enum.Level_1],
        certificates: [
          {
            courseLevel: Course_Level_Enum.Level_1,
            expiryDate: '2030-12-31',
          },
        ],
      },
    })

    const coursesLink = screen.getByRole('link', {
      name: t('common.my-courses'),
    })
    expect(coursesLink).toBeInTheDocument()

    const resourcesLink = screen.getByRole('link', {
      name: t('common.resources'),
    })
    expect(resourcesLink).toBeInTheDocument()

    const usersLink = screen.queryByRole('link', { name: t('common.users') })
    expect(usersLink).not.toBeInTheDocument()

    const knowledgeHubLink = screen.queryByRole('link', {
      name: t('common.knowledge-hub'),
    })
    expect(knowledgeHubLink).toBeInTheDocument()

    const eventsLink = screen.queryByRole('link', { name: t('common.events') })
    expect(eventsLink).toBeInTheDocument()

    const supportLink = screen.queryByRole('link', {
      name: t('common.support'),
    })
    expect(supportLink).toBeInTheDocument()
  })

  it("does not render resource and membership if user doesn't have a valid certificate", async () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.USER,
        allowedRoles: new Set([RoleName.USER]),
        activeCertificates: [],
      },
    })

    const coursesLink = screen.getByRole('link', {
      name: t('common.my-courses'),
    })
    expect(coursesLink).toBeInTheDocument()

    const membershipLink = screen.queryByRole('link', { name: 'Membership' })
    expect(membershipLink).not.toBeInTheDocument()

    const resourcesLink = screen.queryByRole('link', {
      name: t('common.resources'),
    })
    expect(resourcesLink).not.toBeInTheDocument()

    const usersLink = screen.queryByRole('link', { name: t('common.users') })
    expect(usersLink).not.toBeInTheDocument()

    const knowledgeHubLink = screen.queryByRole('link', {
      name: t('common.knowledge-hub'),
    })
    expect(knowledgeHubLink).toBeInTheDocument()

    const eventsLink = screen.queryByRole('link', { name: t('common.events') })
    expect(eventsLink).toBeInTheDocument()

    const supportLink = screen.queryByRole('link', {
      name: t('common.support'),
    })
    expect(supportLink).toBeInTheDocument()
  })

  it("doesn't render resources link if a trainer doesn't have a valid certificate", () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.TRAINER,
        activeCertificates: [],
      },
    })

    expect(
      screen.queryByRole('link', { name: t('common.resources') }),
    ).not.toBeInTheDocument()
  })

  it('renders resources link if a trainer has a valid certificate', () => {
    render(<NavLinks />, {
      auth: {
        profile: {
          courses: [
            {
              grade: Grade_Enum.Pass,
              course: {
                level: Course_Level_Enum.AdvancedTrainer,
                start: '2024-01-10',
                end: '2024-01-11',
              },
            },
          ],
        },
        activeRole: RoleName.TRAINER,
        activeCertificates: [Course_Level_Enum.AdvancedTrainer],
        certificates: [
          {
            courseLevel: Course_Level_Enum.Level_1,
            expiryDate: '2030-12-31',
          },
        ],
      },
    })

    expect(
      screen.getByRole('link', { name: t('common.resources') }),
    ).toBeInTheDocument()

    const knowledgeHubLink = screen.queryByRole('link', {
      name: t('common.knowledge-hub'),
    })
    expect(knowledgeHubLink).toBeInTheDocument()

    const eventsLink = screen.queryByRole('link', { name: t('common.events') })
    expect(eventsLink).toBeInTheDocument()

    const supportLink = screen.queryByRole('link', {
      name: t('common.support'),
    })
    expect(supportLink).toBeInTheDocument()
  })

  it("doesn't render resources link if a user is organisation admin and doesn't have a valid certificate", () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.USER,
        isOrgAdmin: true,
        activeCertificates: [],
      },
    })

    expect(
      screen.queryByRole('link', { name: t('common.resources') }),
    ).not.toBeInTheDocument()
  })

  it('renders SALES ADMIN role links', async () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.SALES_ADMIN,
        allowedRoles: new Set([RoleName.SALES_ADMIN]),
      },
    })

    const coursesLink = screen.getByRole('link', {
      name: t('common.manage-courses'),
    })
    expect(coursesLink).toBeInTheDocument()
    const usersLink = screen.getByRole('link', {
      name: t('common.users'),
    })
    expect(usersLink).toBeInTheDocument()
    const organisationsLink = screen.getByRole('link', {
      name: t('common.organizations'),
    })
    expect(organisationsLink).toBeInTheDocument()
    const certificationsLink = screen.getByRole('link', {
      name: t('common.certifications'),
    })
    expect(certificationsLink).toBeInTheDocument()
    const ordersLink = screen.getByRole('link', { name: t('common.orders') })
    expect(ordersLink).toBeInTheDocument()
  })

  it('renders TT ADMIN role links', async () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
        allowedRoles: new Set([RoleName.TT_ADMIN]),
      },
    })

    const coursesLink = screen.getByRole('link', {
      name: t('common.manage-courses'),
    })
    expect(coursesLink).toBeInTheDocument()
    const usersLink = screen.getByRole('link', {
      name: t('common.users'),
    })
    expect(usersLink).toBeInTheDocument()
    const organisationsLink = screen.getByRole('link', {
      name: t('common.organizations'),
    })
    expect(organisationsLink).toBeInTheDocument()
    const certificationsLink = screen.getByRole('link', {
      name: t('common.certifications'),
    })
    expect(certificationsLink).toBeInTheDocument()
    const ordersLink = screen.getByRole('link', { name: t('common.orders') })
    expect(ordersLink).toBeInTheDocument()
    const resourcesLink = screen.getByRole('link', {
      name: t('common.resources'),
    })
    expect(resourcesLink).toBeInTheDocument()

    const knowledgeHubLink = screen.queryByRole('link', {
      name: t('common.knowledge-hub'),
    })
    expect(knowledgeHubLink).not.toBeInTheDocument()

    const eventsLink = screen.queryByRole('link', { name: t('common.events') })
    expect(eventsLink).not.toBeInTheDocument()

    const supportLink = screen.queryByRole('link', {
      name: t('common.support'),
    })
    expect(supportLink).not.toBeInTheDocument()
  })

  it('renders TT OPS role links', async () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.TT_OPS,
        allowedRoles: new Set([RoleName.TT_OPS]),
      },
    })

    const usersLink = screen.getByRole('link', {
      name: t('common.users'),
    })
    expect(usersLink).toBeInTheDocument()

    const organisationsLink = screen.getByRole('link', {
      name: t('common.organizations'),
    })
    expect(organisationsLink).toBeInTheDocument()

    const certificationsLink = screen.getByRole('link', {
      name: t('common.certifications'),
    })
    expect(certificationsLink).toBeInTheDocument()

    const ordersLink = screen.getByRole('link', { name: t('common.orders') })
    expect(ordersLink).toBeInTheDocument()

    const knowledgeHubLink = screen.queryByRole('link', {
      name: t('common.knowledge-hub'),
    })
    expect(knowledgeHubLink).not.toBeInTheDocument()

    const eventsLink = screen.queryByRole('link', { name: t('common.events') })
    expect(eventsLink).not.toBeInTheDocument()

    const supportLink = screen.queryByRole('link', {
      name: t('common.support'),
    })
    expect(supportLink).not.toBeInTheDocument()
  })

  it('renders TRAINER role links', async () => {
    render(<NavLinks />, {
      auth: {
        activeRole: RoleName.TRAINER,
        allowedRoles: new Set([RoleName.TRAINER]),
      },
    })

    const coursesLink = screen.getByRole('link', {
      name: t('common.my-courses'),
    })
    expect(coursesLink).toBeInTheDocument()
    const usersLink = screen.queryByRole('link', { name: t('common.users') })
    expect(usersLink).not.toBeInTheDocument()
  })
})
