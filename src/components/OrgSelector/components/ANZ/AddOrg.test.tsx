import { useTranslation } from 'react-i18next'

import { render, screen, renderHook } from '@test/index'

import { AddOrg } from './AddOrg'
const option = {
  id: 'id',
  urn: 'urn',
  name: 'name',
}

describe('AddOrg component', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const labels = Object.values(
    t('components.add-organisation.fields', { returnObjects: true }),
  )
  it.each([
    t('components.add-organisation.component-title'),
    t('pages.create-organization.fields.addresses.postalAndZipCode'),
    ...labels.filter(
      label =>
        label !== t('components.add-organisation.fields.zipCode') &&
        label !== t('components.add-organisation.fields.postCode') &&
        label !==
          t('components.add-organisation.fields.organisation-specify-other') &&
        label !== t('components.add-organisation.fields.region') &&
        label !== t('components.add-organisation.fields.state') &&
        label !== t('components.add-organisation.fields.territory') &&
        label !== t('components.add-organisation.fields.organisation-phone'),
    ),
  ])('renders % field', async field => {
    render(
      <AddOrg
        orgName={option.name}
        countryCode={'AU'}
        onSuccess={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText(field)).toBeInTheDocument()
  })

  it.each([
    t('components.add-organisation.component-title'),
    t('pages.create-organization.fields.addresses.postalAndZipCode'),
    ...labels.filter(
      label =>
        label !== t('components.add-organisation.fields.postCode') &&
        label !== t('components.add-organisation.fields.zipCode') &&
        label !==
          t('components.add-organisation.fields.organisation-specify-other') &&
        label !== t('components.add-organisation.fields.stateTerritory') &&
        label !== t('components.add-organisation.fields.state') &&
        label !== t('components.add-organisation.fields.territory') &&
        label !== t('components.add-organisation.fields.organisation-phone'),
    ),
  ])('renders % field', async field => {
    render(
      <AddOrg
        orgName={option.name}
        countryCode={'NZ'}
        onSuccess={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText(field)).toBeInTheDocument()
  })
})
