import React from 'react'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import { AllResourceCategoriesQuery } from '@app/generated/graphql'

import { render, screen } from '@test/index'
import { buildEntities, buildResourceCategory } from '@test/mock-data-utils'

import { ResourceAreas } from './ResourceAreas'

describe('page: ResourcesList', () => {
  it('displays skeleton loading while fetching Resources', async () => {
    const client = {
      executeQuery: () => never,
    }
    render(
      <Provider value={client as unknown as Client}>
        <ResourceAreas />
      </Provider>
    )

    expect(screen.getByTestId('resources-list-skeleton')).toBeInTheDocument()
  })

  it('displays items', async () => {
    const resourceListBasic = buildEntities(2, buildResourceCategory('basic'))
    const resourceListAdditional = buildEntities(
      2,
      buildResourceCategory('additional')
    )
    const resourceList = [...resourceListBasic, ...resourceListAdditional]

    const client = {
      executeQuery: () =>
        fromValue<{ data: AllResourceCategoriesQuery }>({
          data: {
            content: {
              resourceCategories: {
                nodes: resourceList,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <ResourceAreas />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    for (const item of resourceList) {
      expect(screen.getByText(item.name ?? '')).toBeInTheDocument()

      expect(screen.getByText(item.description ?? '')).toBeInTheDocument()
    }
  })
})
