import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  ResourceCategorySummaryFragment,
  ResourceDetailsQuery,
  ResourceSummaryFragment,
} from '@app/generated/graphql'
import { CourseLevel, TrainerRoleTypeName } from '@app/types'

import { chance, render, screen } from '@test/index'

import { ResourceCategoryDetails } from './ResourceCategoryDetails'

describe('page: ResourceCategoryDetails', () => {
  it('displays loading state while fetching for resource category', () => {
    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <ResourceCategoryDetails />
      </Provider>
    )

    expect(screen.getByTestId('resource-category-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('resources-skeleton')).toBeInTheDocument()
  })

  it('displays resource category title and description', () => {
    const resourceCategory = buildResourceCategory({
      resourcePermissions: {
        certificateLevels: [CourseLevel.Level_1],
      },
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: ResourceDetailsQuery }>({
          data: {
            content: {
              resourceCategory,
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <ResourceCategoryDetails />
      </Provider>,
      { auth: { activeCertificates: [CourseLevel.Level_1] } }
    )

    expect(
      screen.queryByTestId('resource-category-skeleton')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('resources-skeleton')).not.toBeInTheDocument()

    expect(screen.getByText(resourceCategory.name ?? '')).toBeInTheDocument()
    expect(
      screen.getByText(resourceCategory.description ?? '')
    ).toBeInTheDocument()
  })

  it('filters resources by active certificate levels', () => {
    const level1Resource = buildResource({
      resourcePermissions: {
        certificateLevels: [CourseLevel.Level_1],
      },
    })

    const advancedModulesResource = buildResource({
      resourcePermissions: {
        certificateLevels: [
          CourseLevel.Level_1,
          CourseLevel.Level_2,
          CourseLevel.Advanced,
        ],
      },
    })

    const intermediateTrainerResource = buildResource({
      resourcePermissions: {
        certificateLevels: [CourseLevel.IntermediateTrainer],
      },
    })

    const resourceCategory = buildResourceCategory({
      resourcePermissions: {
        certificateLevels: [CourseLevel.Advanced],
      },
      resources: {
        nodes: [
          level1Resource,
          advancedModulesResource,
          intermediateTrainerResource,
        ],
      },
    })
    const client = {
      executeQuery: () =>
        fromValue<{ data: ResourceDetailsQuery }>({
          data: {
            content: {
              resourceCategory,
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <ResourceCategoryDetails />
      </Provider>,
      {
        auth: {
          activeCertificates: [
            CourseLevel.Advanced,
            CourseLevel.IntermediateTrainer,
          ],
        },
      }
    )

    expect(
      screen.queryByText(level1Resource.title ?? '')
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(advancedModulesResource.title ?? '')
    ).toBeInTheDocument()
    expect(
      screen.getByText(intermediateTrainerResource.title ?? '')
    ).toBeInTheDocument()
  })

  it('filters by resources available to principal trainers', () => {
    const level1Resource = buildResource({
      resourcePermissions: {
        certificateLevels: [CourseLevel.Level_1],
      },
    })

    const principalTrainerResource = buildResource({
      resourcePermissions: {
        principalTrainer: true,
      },
    })

    const resourceCategory = buildResourceCategory({
      resourcePermissions: {
        principalTrainer: true,
      },
      resources: {
        nodes: [level1Resource, principalTrainerResource],
      },
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: ResourceDetailsQuery }>({
          data: {
            content: {
              resourceCategory,
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <ResourceCategoryDetails />
      </Provider>,
      {
        auth: {
          trainerRoles: [TrainerRoleTypeName.PRINCIPAL],
        },
      }
    )

    expect(
      screen.queryByText(level1Resource.title ?? '')
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(principalTrainerResource.title ?? '')
    ).toBeInTheDocument()
  })

  it("displays not found page if a user doesn't have an appropriate certificate level", () => {
    const level2Resource = buildResource({
      resourcePermissions: {
        certificateLevels: [CourseLevel.Level_2],
      },
    })

    const resourceCategory = buildResourceCategory({
      resources: {
        nodes: [level2Resource],
      },
    })
    const client = {
      executeQuery: () =>
        fromValue<{ data: ResourceDetailsQuery }>({
          data: {
            content: {
              resourceCategory,
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <ResourceCategoryDetails />
      </Provider>,
      {
        auth: {
          activeCertificates: [CourseLevel.Level_1],
        },
      }
    )

    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })
})

function buildResourceCategory(
  overrides?: Partial<ResourceCategorySummaryFragment>
): ResourceCategorySummaryFragment {
  return {
    id: chance.guid(),
    name: chance.name(),
    description: chance.sentence(),
    ...overrides,
  }
}

function buildResource(
  overrides?: Partial<ResourceSummaryFragment>
): ResourceSummaryFragment {
  return {
    id: chance.guid(),
    title: chance.name(),
    resourcePermissions: {
      certificateLevels: [],
      principalTrainer: false,
    },
    ...overrides,
  }
}
