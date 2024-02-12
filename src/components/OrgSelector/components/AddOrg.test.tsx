import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useTranslation } from 'react-i18next'

import { render, screen, fireEvent, renderHook } from '@test/index'

import { AddOrg } from './AddOrg'
const option = {
  id: 'id',
  urn: 'urn',
  name: 'name',
}
vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn().mockResolvedValue(true),
}))

describe('AddOrg component', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const labels = Object.values(
    t('components.add-organisation.fields', { returnObjects: true })
  )
  it.each([
    t('components.add-organisation.component-title'),
    ...labels.filter(
      label =>
        label !== t('components.add-organisation.fields.zipCode') &&
        label !==
          t('components.add-organisation.fields.organisation-specify-other')
    ),
  ])('renders % field', async field => {
    useFeatureFlagEnabled('add-organization-country')
    render(
      <AddOrg
        option={option}
        countryCode={'GB-ENG'}
        onSuccess={vi.fn()}
        onClose={vi.fn()}
      />
    )
    expect(screen.getByText(field)).toBeInTheDocument()
  })

  it.each([
    t('components.add-organisation.component-title'),
    ...labels.filter(
      label =>
        label !== t('components.add-organisation.fields.postCode') &&
        label !==
          t('components.add-organisation.fields.organisation-specify-other')
    ),
  ])('renders % field', async field => {
    useFeatureFlagEnabled('add-organization-country')
    render(
      <AddOrg
        option={option}
        countryCode={'RO'}
        onSuccess={vi.fn()}
        onClose={vi.fn()}
      />
    )
    expect(screen.getByText(field)).toBeInTheDocument()
  })

  it('should display the Postcode tooltip message on hover', async () => {
    render(
      <AddOrg
        option={option}
        countryCode={'GB-ENG'}
        onSuccess={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expect(screen.getByText('Add Organisation')).toBeInTheDocument()

    const tooltipElement = screen.getByTestId('post-code-tooltip')

    fireEvent.mouseOver(tooltipElement)
    const tooltipMessage = await screen.findByText(
      t('common.post-code-tooltip')
    )
    expect(tooltipMessage).toBeInTheDocument()
  })
})
