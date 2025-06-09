import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  ResourceDetailsQuery,
  ResourceSummaryFragment,
  Course_Level_Enum,
  Grade_Enum,
} from '@app/generated/graphql'
import { RoleName, TrainerRoleTypeName } from '@app/types'

import { chance, render, screen } from '@test/index'

import { ResourceCategory } from '../../hooks/useResourceCategory'

import { ResourceCategoryDetails } from './ResourceCategoryDetails'

describe('page: ResourceCategoryDetails', () => {
  it('displays loading state while fetching for resource category', () => {
    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <ResourceCategoryDetails />
      </Provider>,
    )

    expect(screen.getByTestId('resource-category-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('resources-skeleton')).toBeInTheDocument()
  })

  it('displays resource category title and description', () => {
    const resourceCategory = buildResourceCategory({
      resourcePermissions: {
        certificateLevels: [Course_Level_Enum.Level_1],
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
          certificates: [
            {
              courseLevel: Course_Level_Enum.Level_1,
              expiryDate: '2030-12-31',
            },
          ],
        },
      },
    )

    expect(
      screen.queryByTestId('resource-category-skeleton'),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('resources-skeleton')).not.toBeInTheDocument()

    expect(
      screen.getByText(resourceCategory?.name ?? 'should fail'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(resourceCategory?.description ?? 'should fail'),
    ).toBeInTheDocument()
  })

  it('filters resources by active certificate levels', () => {
    const level1Resource = buildResource({
      resourcePermissions: {
        certificateLevels: [Course_Level_Enum.Level_1],
      },
    })

    const advancedModulesResource = buildResource({
      resourcePermissions: {
        certificateLevels: [
          Course_Level_Enum.Level_1,
          Course_Level_Enum.Level_2,
          Course_Level_Enum.Advanced,
        ],
      },
    })

    const intermediateTrainerResource = buildResource({
      resourcePermissions: {
        certificateLevels: [Course_Level_Enum.IntermediateTrainer],
      },
    })

    const resourceCategory = buildResourceCategory({
      resourcePermissions: {
        certificateLevels: [Course_Level_Enum.Advanced],
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
          certificates: [
            {
              courseLevel: Course_Level_Enum.Advanced,
              expiryDate: '2030-12-31',
            },
            {
              courseLevel: Course_Level_Enum.IntermediateTrainer,
              expiryDate: '2030-12-31',
            },
          ],
        },
      },
    )

    expect(
      screen.queryByText(level1Resource.title ?? ''),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(advancedModulesResource.title ?? ''),
    ).toBeInTheDocument()
    expect(
      screen.getByText(intermediateTrainerResource.title ?? ''),
    ).toBeInTheDocument()
  })

  it('filters by resources available to principal trainers', () => {
    const level1Resource = buildResource({
      resourcePermissions: {
        certificateLevels: [Course_Level_Enum.Level_1],
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
      },
    )

    expect(
      screen.queryByText(level1Resource.title ?? ''),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(principalTrainerResource.title ?? ''),
    ).toBeInTheDocument()
  })

  it("displays not found page if a user doesn't have an appropriate certificate level", () => {
    const level2Resource = buildResource({
      resourcePermissions: {
        certificateLevels: [Course_Level_Enum.Level_2],
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
          activeCertificates: [
            {
              level: Course_Level_Enum.Level_1,
              grade: Grade_Enum.Pass,
            },
          ],
        },
      },
    )

    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })
  ;[
    RoleName.TT_ADMIN,
    RoleName.SALES_ADMIN,
    RoleName.FINANCE,
    RoleName.LD,
    RoleName.SALES_REPRESENTATIVE,
    RoleName.TT_OPS,
  ].forEach(roleName => {
    it(`displays all resources to internal users`, () => {
      const level1Resource = buildResource({
        resourcePermissions: {
          certificateLevels: [Course_Level_Enum.Level_1],
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
            activeRole: roleName,
          },
        },
      )

      expect(
        screen.getByText(level1Resource.title ?? 'should fail'),
      ).toBeInTheDocument()
      expect(
        screen.getByText(principalTrainerResource.title ?? 'should fail'),
      ).toBeInTheDocument()
    })
  })

  it('filters nested resource categories and resources', () => {
    const level1Resource = buildResource({
      title: 'Level 1 resource',
      resourcePermissions: {
        certificateLevels: [Course_Level_Enum.Level_1],
      },
    })

    const secondLevelNestingCategory = buildResourceCategory({
      name: 'Second level nesting',
      resourcePermissions: {
        principalTrainer: false,
      },
    })

    const firstLevelNestingCategory = buildResourceCategory({
      name: 'First level nesting',
      resourcePermissions: {
        principalTrainer: true,
      },
      resources: {
        nodes: [
          buildResource({
            resourcePermissions: {
              principalTrainer: true,
            },
          }),
        ],
      },
      children: {
        nodes: [secondLevelNestingCategory],
      },
    })

    const resourceCategory = buildResourceCategory({
      name: 'Top level category',
      resourcePermissions: {
        principalTrainer: true,
      },
      resources: {
        nodes: [level1Resource],
      },
      children: {
        nodes: [firstLevelNestingCategory],
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
          activeRole: RoleName.TRAINER,
          trainerRoles: [TrainerRoleTypeName.PRINCIPAL],
        },
      },
    )

    expect(
      screen.queryByText(level1Resource.title ?? 'should fail'),
    ).not.toBeInTheDocument()

    expect(
      screen.getByText(firstLevelNestingCategory.name ?? 'should fail'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText(secondLevelNestingCategory.name ?? 'should fail'),
    ).not.toBeInTheDocument()
  })

  it("doesn't display no resources message if there are no direct child resources but child category has resources", () => {
    const childCategory = buildResourceCategory({
      name: 'First level nesting',
      resourcePermissions: {
        principalTrainer: true,
      },
      resources: {
        nodes: [
          buildResource({
            resourcePermissions: {
              principalTrainer: true,
            },
          }),
        ],
      },
    })

    const parentCategory = buildResourceCategory({
      name: 'Top level category',
      resourcePermissions: {
        principalTrainer: true,
      },
      resources: {
        nodes: [],
      },
      children: {
        nodes: [childCategory],
      },
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: ResourceDetailsQuery }>({
          data: {
            content: {
              resourceCategory: parentCategory,
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
          activeRole: RoleName.TRAINER,
          trainerRoles: [TrainerRoleTypeName.PRINCIPAL],
        },
      },
    )

    expect(
      screen.getByText(childCategory.name ?? 'should fail'),
    ).toBeInTheDocument()

    expect(screen.queryByText(/no resources found/i)).not.toBeInTheDocument()
  })

  it("display no resources found message when both parent and child categories don't have resources", () => {
    const childCategory = buildResourceCategory({
      name: 'First level nesting',
      resourcePermissions: {
        principalTrainer: true,
      },
      resources: {
        nodes: [],
      },
    })

    const parentCategory = buildResourceCategory({
      name: 'Top level category',
      resourcePermissions: {
        principalTrainer: true,
      },
      resources: {
        nodes: [],
      },
      children: {
        nodes: [childCategory],
      },
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: ResourceDetailsQuery }>({
          data: {
            content: {
              resourceCategory: parentCategory,
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
          activeRole: RoleName.TRAINER,
          trainerRoles: [TrainerRoleTypeName.PRINCIPAL],
        },
      },
    )

    expect(
      screen.queryByText(childCategory.name ?? 'should fail'),
    ).not.toBeInTheDocument()

    expect(screen.getByText(/no resources found/i)).toBeInTheDocument()
  })
})

function buildResourceCategory(
  overrides?: Partial<ResourceCategory>,
): NonNullable<ResourceCategory> {
  return {
    id: chance.guid(),
    name: chance.name(),
    description: chance.sentence(),
    ...overrides,
  }
}

function buildResource(
  overrides?: Partial<ResourceSummaryFragment>,
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
