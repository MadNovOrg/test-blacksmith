import { useTranslation } from 'react-i18next'

import { GetProfileDetailsQuery } from '@app/generated/graphql'

import { _render, renderHook, screen } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { OrganisationsTable } from './OrganisationsTable'

describe(OrganisationsTable.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const profile = buildProfile()
  beforeEach(() =>
    _render(
      <OrganisationsTable
        profile={profile as unknown as GetProfileDetailsQuery['profile']}
      />,
    ),
  )
  it('should _render the component', () => {
    expect(screen.getByTestId('organisations-table')).toBeInTheDocument()
  })
  it.each([t('organization'), t('permissions')])(
    'it should _render cell: %s',
    cell => {
      expect(screen.getByText(cell)).toBeInTheDocument()
    },
  )
  describe.each(profile.organizations)(
    'should _render each organisation`s details',
    org => {
      it.each([org.organization.name])('it should _render: %s', value => {
        expect(screen.getByText(value as string)).toBeInTheDocument()
      })
    },
  )
})
