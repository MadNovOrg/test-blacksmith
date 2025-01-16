import { deepmerge } from '@mui/utils'
import React from 'react'
import { Provider, Client } from 'urql'
import { never } from 'wonka'

import { AuthContext } from '@app/context/auth'
import { injectACL } from '@app/context/auth/permissions'
import { TrainerCoursesQueryVariables } from '@app/generated/graphql'
import { RoleName } from '@app/types'
import { ALL_ORGS } from '@app/util'

import { renderHook } from '@test/index'
import { defaultProviders } from '@test/providers'

import { useCourses } from './useCourses'

describe('hook: useCourses', () => {
  it('calls course query with correct variables for all organizations a user is managing', () => {
    let whereClause: TrainerCoursesQueryVariables['where']

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        whereClause = variables.where

        return never
      },
    } as unknown as Client

    const Wrapper: React.FC<React.PropsWithChildren<unknown>> = ({
      children,
    }) => {
      const auth = deepmerge(defaultProviders.auth, {
        activeRole: RoleName.USER,
        isOrgAdmin: true,
        organizationIds: [],
      })

      return (
        <AuthContext.Provider value={injectACL(auth)}>
          <Provider value={client}>{children}</Provider>
        </AuthContext.Provider>
      )
    }

    renderHook(
      () =>
        useCourses(RoleName.USER, {
          orgId: ALL_ORGS,
          sorting: { by: 'name', onSort: vi.fn(), dir: 'asc' },
        }),
      {
        wrapper: Wrapper,
      },
    )

    expect(whereClause).toMatchInlineSnapshot(`
      {
        "_or": [
          {
            "organization": {
              "_or": [
                {
                  "id": {
                    "_in": [],
                  },
                },
                {
                  "main_organisation": {
                    "members": {
                      "isAdmin": {
                        "_eq": true,
                      },
                      "profile_id": {
                        "_eq": "cacb559d-b85d-5e64-b623-37252520ebda",
                      },
                    },
                  },
                },
              ],
            },
            "type": {
              "_in": [
                "CLOSED",
                "INDIRECT",
              ],
            },
          },
          {
            "participants": {
              "profile": {
                "organizations": {
                  "organization": {
                    "_or": [
                      {
                        "id": {
                          "_in": [],
                        },
                        "members": {
                          "isAdmin": {
                            "_eq": true,
                          },
                          "profile_id": {
                            "_eq": "cacb559d-b85d-5e64-b623-37252520ebda",
                          },
                        },
                      },
                      {
                        "main_organisation": {
                          "members": {
                            "isAdmin": {
                              "_eq": true,
                            },
                            "profile_id": {
                              "_eq": "cacb559d-b85d-5e64-b623-37252520ebda",
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            "type": {
              "_eq": "OPEN",
            },
          },
        ],
      }
    `)
  })

  it('calls course query with correct variables for a single organization a user is managing', () => {
    let whereClause: TrainerCoursesQueryVariables['where']
    const orgId = 'org-id'

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        whereClause = variables.where

        return never
      },
    } as unknown as Client

    const Wrapper: React.FC<React.PropsWithChildren<unknown>> = ({
      children,
    }) => {
      const auth = deepmerge(defaultProviders.auth, {
        activeRole: RoleName.USER,
        isOrgAdmin: true,
        organizationIds: [orgId],
      })

      return (
        <AuthContext.Provider value={injectACL(auth)}>
          <Provider value={client}>{children}</Provider>
        </AuthContext.Provider>
      )
    }

    renderHook(
      () =>
        useCourses(RoleName.USER, {
          orgId: orgId,
          sorting: { by: 'name', onSort: vi.fn(), dir: 'asc' },
        }),
      {
        wrapper: Wrapper,
      },
    )

    expect(whereClause).toMatchInlineSnapshot(`
      {
        "_or": [
          {
            "organization": {
              "id": {
                "_eq": "org-id",
              },
            },
            "type": {
              "_in": [
                "CLOSED",
                "INDIRECT",
              ],
            },
          },
          {
            "participants": {
              "profile": {
                "organizations": {
                  "organization": {
                    "id": {
                      "_eq": "org-id",
                    },
                    "members": {
                      "isAdmin": {
                        "_eq": true,
                      },
                      "profile_id": {
                        "_eq": "cacb559d-b85d-5e64-b623-37252520ebda",
                      },
                    },
                  },
                },
              },
            },
            "type": {
              "_eq": "OPEN",
            },
          },
        ],
      }
    `)
  })
})
