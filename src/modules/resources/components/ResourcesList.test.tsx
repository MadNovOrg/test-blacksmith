import { ResourceSummaryFragment } from '@app/generated/graphql'

import { chance, _render, screen } from '@test/index'

import ResourcesList from './ResourcesList'

vi.mock('./ResourceItemCard', () => ({
  ResourceItemCard: ({ resource }: { resource: ResourceSummaryFragment }) => (
    <div>
      <h1>{resource.title}</h1>
    </div>
  ),
}))

describe('ResourcesList', () => {
  const mockResources: ResourceSummaryFragment[] = [
    { id: chance.guid(), title: '3. Introduction' },
    { id: chance.guid(), title: '1. Getting Started' },
    { id: chance.guid(), title: '2a. Basics' },
    { id: chance.guid(), title: '10. Advanced' },
    { id: chance.guid(), title: 'Appendix' },
    { id: chance.guid(), title: '2b. Intermediate' },
    { id: chance.guid(), title: null },
  ]

  it('renders nothing when no resources are provided', () => {
    const { container } = _render(<ResourcesList resources={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('sorts resources correctly by numbered titles', () => {
    _render(<ResourcesList resources={mockResources} />)

    const renderedTitles = screen
      .getAllByRole('heading')
      .map(el => el.textContent)

    expect(renderedTitles).toEqual([
      '1. Getting Started',
      '2a. Basics',
      '2b. Intermediate',
      '3. Introduction',
      '10. Advanced',
      '',
      'Appendix',
    ])
  })

  it('sorts alphabetically when numbers are equal', () => {
    const mockResourcesWithSameNumber = [
      { id: chance.guid(), title: '2. Banana' },
      { id: chance.guid(), title: '2. Apple' },
      { id: chance.guid(), title: '2. Cherry' },
    ]

    _render(<ResourcesList resources={mockResourcesWithSameNumber} />)

    const renderedTitles = screen
      .getAllByRole('heading')
      .map(el => el.textContent)
    expect(renderedTitles).toEqual(['2. Apple', '2. Banana', '2. Cherry'])
  })
})
