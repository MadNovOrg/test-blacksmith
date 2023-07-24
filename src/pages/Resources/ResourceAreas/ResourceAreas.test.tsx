import React from 'react'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import { AllResourceCategoriesQuery } from '@app/generated/graphql'
import { CourseLevel } from '@app/types'

import { render, screen } from '@test/index'
import { buildResourceCategory } from '@test/mock-data-utils'

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
    const resourceListBasic = [
      buildResourceCategory({
        overrides: {
          resourceArea: { resourcearea: 'basic' },
          resourcePermissions: { certificateLevels: [CourseLevel.Level_1] },
        },
      }),
      buildResourceCategory({
        overrides: {
          resourceArea: { resourcearea: 'basic' },
          resourcePermissions: { certificateLevels: [CourseLevel.Level_1] },
        },
      }),
    ]

    const resourceListAdditional = [
      buildResourceCategory({
        overrides: {
          resourceArea: { resourcearea: 'additional' },
          resourcePermissions: { certificateLevels: [CourseLevel.Level_1] },
        },
      }),
      buildResourceCategory({
        overrides: {
          resourceArea: { resourcearea: 'additional' },
          resourcePermissions: { certificateLevels: [CourseLevel.Level_1] },
        },
      }),
    ]

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
      { auth: { activeCertificates: [CourseLevel.Level_1] } }
    )

    for (const item of resourceList) {
      expect(
        screen.getByText(item.name ?? 'should not pass')
      ).toBeInTheDocument()

      expect(
        screen.getByText(item.description ?? 'should not pass')
      ).toBeInTheDocument()
    }
  })

  it("doesn't display categories that don't match the user's certificate level", () => {
    const level1Category = buildResourceCategory({
      overrides: {
        resourceArea: { resourcearea: 'basic' },
        resourcePermissions: { certificateLevels: [CourseLevel.Level_1] },
      },
    })

    const level2Category = buildResourceCategory({
      overrides: {
        resourceArea: { resourcearea: 'basic' },
        resourcePermissions: { certificateLevels: [CourseLevel.Level_2] },
      },
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: AllResourceCategoriesQuery }>({
          data: {
            content: {
              resourceCategories: {
                nodes: [level1Category, level2Category],
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <ResourceAreas />
      </Provider>,
      { auth: { activeCertificates: [CourseLevel.Level_1] } }
    )

    expect(
      screen.getByText(level1Category.name ?? 'should not pass')
    ).toBeInTheDocument()

    expect(
      screen.queryByText(level2Category.name ?? 'should not pass')
    ).not.toBeInTheDocument()
  })
})
