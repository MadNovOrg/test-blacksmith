import { useTranslation } from 'react-i18next'

import { AwsRegions, RoleName } from '@app/types'

import { render, renderHook, waitFor, findByTestId } from '@test/index'

import { CreateOrganization } from './CreateOrganization'

describe('Page: CreateOrganization UK', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })
  const roles = [
    RoleName.TT_ADMIN,
    RoleName.TT_OPS,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
  ]
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const setup = (role: RoleName) => {
    render(<CreateOrganization />, {
      auth: {
        activeRole: role,
        acl: {
          isUK: vi.fn().mockReturnValue(true),
        },
      },
    })
  }

  roles.forEach(role => {
    it(`renders the Create organization page for ${role} with UK form`, async () => {
      setup(role)
      await waitFor(() => {
        expect(document.title).toContain(
          t('pages.browser-tab-titles.organisations.new-organisation'),
        )
      })
    })

    it(`Renders the UK Organization form for ${role}`, async () => {
      setup(role)
      const form = await findByTestId(document.body, 'uk-organization-form')
      expect(form).toBeInTheDocument()
    })
  })
})

describe('Page: CreateOrganization ANZ', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  })
  const roles = [
    RoleName.TT_ADMIN,
    RoleName.TT_OPS,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
  ]
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const setup = (role: RoleName) => {
    render(<CreateOrganization />, {
      auth: {
        activeRole: role,
      },
    })
  }

  roles.forEach(role => {
    it(`renders the Create organization page for ${role} with ANZ form`, async () => {
      setup(role)
      await waitFor(() => {
        expect(document.title).toContain(
          t('pages.browser-tab-titles.organisations.new-organisation'),
        )
      })
    })

    it(`Renders the ANZ Organization form for ${role}`, async () => {
      setup(role)
      const form = await findByTestId(document.body, 'anz-organization-form')
      expect(form).toBeInTheDocument()
    })
  })
})
