import { useTranslation } from 'react-i18next'

import { render, screen, fireEvent, renderHook } from '@test/index'

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
  it.each([
    t('components.add-organisation.component-title'),
    ...Object.values(
      t('components.add-organisation.fields', { returnObjects: true })
    ),
  ])('renders % field', async field => {
    render(<AddOrg option={option} onSuccess={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText(field)).toBeInTheDocument()
  })

  it('should display the Postcode tooltip message on hover', async () => {
    render(<AddOrg option={option} onSuccess={vi.fn()} onClose={vi.fn()} />)

    expect(screen.getByText('Add Organisation')).toBeInTheDocument()

    const tooltipElement = screen.getByTestId('post-code-tooltip')

    fireEvent.mouseOver(tooltipElement)
    const tooltipMessage = await screen.findByText(
      t('common.post-code-tooltip')
    )
    expect(tooltipMessage).toBeInTheDocument()
  })
})
