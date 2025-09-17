import { useTranslation } from 'react-i18next'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import {
  GetParticipantGradingDetailsQuery,
  ModuleSettingsQuery,
} from '@app/generated/graphql'
import { MODULE_SETTINGS_QUERY } from '@app/modules/course/pages/CourseBuilder/components/ICMCourseBuilderV2/hooks/useModuleSettings'

import { fireEvent, _render, renderHook, screen } from '@test/index'
import { chance, userEvent } from '@test/index'

import { GET_PARTICIPANT_DETAILS } from '../../hooks/useParticipantDetails'

import { EditCertifications } from './EditCertifications'

vi.mock('@urql/core', () => ({
  useClient: vi.fn(),
}))

vi.mock('@app/context/auth', async () => ({
  ...(await vi.importActual('@app/context/auth')),
  useAuth: vi.fn().mockReturnValue({
    loadProfile: vi.fn(),
    acl: {
      isAustralia: vi.fn().mockReturnValue(false),
      isUK: vi.fn().mockReturnValue(true),
    },
  }),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: {
      participants: new Set([chance.guid()]),
    },
  }),
}))

vi.mock('urql', async () => ({
  ...(await vi.importActual('urql')),
  useClient: () => ({
    mutation: () => ({
      toPromise: () => Promise.resolve({ data: { affected_rows: 1 } }),
    }),
  }),
}))

describe(EditCertifications.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  it('should _render the component ', () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_PARTICIPANT_DETAILS) {
          return fromValue<{ data: GetParticipantGradingDetailsQuery }>({
            data: {
              participants: [
                {
                  profile: {
                    fullName: chance.name(),
                    avatar: chance.url(),
                  },
                  gradedOn: [],
                  id: chance.guid(),
                },
              ],
            },
          })
        }
        if (query === MODULE_SETTINGS_QUERY) {
          return fromValue<{ data: ModuleSettingsQuery }>({
            data: {
              moduleSettings: [
                {
                  module: {
                    lessons: {
                      items: [],
                    },
                  },
                },
              ],
            } as ModuleSettingsQuery,
          })
        }
      },
    } as unknown as Client
    _render(
      <Provider value={client}>
        <EditCertifications />
      </Provider>,
    )
    expect(
      screen.getByText(t('pages.edit-certifications.title')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(t('pages.edit-certifications.subtitle')),
    ).toBeInTheDocument()
  })
  it('should navigate to the previous page when the back button is clicked', () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_PARTICIPANT_DETAILS) {
          return fromValue<{ data: GetParticipantGradingDetailsQuery }>({
            data: {
              participants: [
                {
                  profile: {
                    fullName: chance.name(),
                    avatar: chance.url(),
                  },
                  gradedOn: [],
                  id: chance.guid(),
                },
              ],
            },
          })
        }
        if (query === MODULE_SETTINGS_QUERY) {
          return fromValue<{ data: ModuleSettingsQuery }>({
            data: {
              moduleSettings: [
                {
                  module: {
                    lessons: {
                      items: [],
                    },
                  },
                },
              ],
            } as ModuleSettingsQuery,
          })
        }
      },
    } as unknown as Client
    _render(
      <Provider value={client}>
        <EditCertifications />
      </Provider>,
    )
    const backButton = screen.getByText(t('common.back'))
    backButton.click()
    expect(mockNavigate).toHaveBeenCalled()
  })
  it('should _render a loading spinner when fetching data', () => {
    const client = {
      executeQuery: () => never,
    } as unknown as Client
    _render(
      <Provider value={client}>
        <EditCertifications />
      </Provider>,
    )
    expect(screen.getByTestId('fetching-participants')).toBeInTheDocument()
  })
  it('prefills data on single graded participant', async () => {
    const moduleName = 'Theory'
    const notCoveredModule = 'Bite Responses'
    const notCoveredLesson = 'Not covered lesson'
    const gradedLesson = 'Lesson 1'
    const notes = 'Didnt attend others'

    const partiallyCoveredModule = 'Partially Covered Module'
    const partiallyCoveredLesson = 'Partially covered lesson'

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_PARTICIPANT_DETAILS) {
          return fromValue<{ data: GetParticipantGradingDetailsQuery }>({
            data: {
              participants: [
                {
                  profile: {
                    fullName: chance.name(),
                    avatar: chance.url(),
                  },
                  gradedOn: [
                    {
                      id: chance.guid(),
                      name: moduleName,
                      lessons: {
                        items: [
                          {
                            name: gradedLesson,
                            covered: true,
                          },
                        ],
                      },
                    },
                    {
                      name: partiallyCoveredModule,
                      id: chance.guid(),
                      lessons: {
                        items: [
                          {
                            name: partiallyCoveredLesson,
                            covered: true,
                          },
                          {
                            name: notCoveredLesson,
                            covered: false,
                          },
                        ],
                      },
                      note: notes,
                    },
                  ],
                  id: chance.guid(),
                },
              ],
            },
          })
        }
        if (query === MODULE_SETTINGS_QUERY) {
          return fromValue<{ data: ModuleSettingsQuery }>({
            data: {
              moduleSettings: [
                {
                  module: {
                    name: notCoveredModule,
                    id: chance.guid(),
                    lessons: {
                      items: [],
                    },
                  },
                },
              ],
            } as ModuleSettingsQuery,
          })
        }
      },
    } as unknown as Client

    _render(
      <Provider value={client}>
        <EditCertifications />
      </Provider>,
    )
    screen.debug(undefined, 100000)
    // checks fukky covered modules
    expect(screen.getByText(moduleName)).toBeInTheDocument()

    await userEvent.click(screen.getByText(moduleName))
    expect(screen.getByLabelText(gradedLesson)).toBeInTheDocument()
    expect(screen.getByLabelText(gradedLesson)).toHaveAttribute('checked')

    // checks not covered modules

    expect(screen.getByText(notCoveredModule)).toBeInTheDocument()
    expect(screen.getByText(notCoveredModule)).not.toHaveAttribute('checked')

    /// Checks partially covered module with notes
    expect(screen.getByText(partiallyCoveredModule)).toBeInTheDocument()

    await userEvent.click(screen.getByText(partiallyCoveredModule))

    expect(screen.getByLabelText(partiallyCoveredLesson)).toBeInTheDocument()
    expect(screen.getByLabelText(partiallyCoveredLesson)).toHaveAttribute(
      'checked',
    )

    expect(screen.getByLabelText(notCoveredLesson)).toBeInTheDocument()
    expect(screen.getByLabelText(notCoveredLesson)).not.toHaveAttribute(
      'checked',
    )
    expect(screen.getByDisplayValue(notes)).toBeInTheDocument()
  })

  it('should update the grading accordingly', async () => {
    const theory = 'Theory'
    const theoryLessons = {
      items: [
        {
          name: 'Covered',
        },
      ],
    }

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_PARTICIPANT_DETAILS) {
          return fromValue<{ data: GetParticipantGradingDetailsQuery }>({
            data: {
              participants: [
                {
                  id: chance.guid(),
                  profile: {
                    fullName: chance.name(),
                    avatar: chance.url(),
                  },
                  gradedOn: [],
                },
              ],
            },
          })
        }
        if (query === MODULE_SETTINGS_QUERY) {
          return fromValue<{ data: ModuleSettingsQuery }>({
            data: {
              moduleSettings: [
                {
                  module: {
                    name: theory,
                    id: chance.guid(),
                    lessons: theoryLessons,
                  },
                },
              ],
            } as ModuleSettingsQuery,
          })
        }
      },
    } as unknown as Client

    _render(
      <Provider value={client as unknown as Client}>
        <EditCertifications />
      </Provider>,
    )
    expect(screen.getByText(theory)).toBeInTheDocument()

    await userEvent.click(screen.getByText(theory))

    expect(
      screen.getByLabelText(theoryLessons.items[0].name),
    ).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: 'Some notes' },
    })
    expect(screen.getByLabelText('Notes')).toHaveValue('Some notes')

    await userEvent.click(screen.getByLabelText(theoryLessons.items[0].name))

    await userEvent.click(
      screen.getByText(
        t('pages.edit-certifications.update-certifications-button'),
      ),
    )

    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })
  it('should show participants which are being edited', () => {
    const pName1 = 'John Doe'
    const pName2 = 'Jane Doe'

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_PARTICIPANT_DETAILS) {
          return fromValue<{ data: GetParticipantGradingDetailsQuery }>({
            data: {
              participants: [
                {
                  id: chance.guid(),
                  profile: {
                    fullName: pName2,
                    avatar: chance.url(),
                  },
                  gradedOn: [],
                },
                {
                  id: chance.guid(),
                  profile: {
                    fullName: pName1,
                    avatar: chance.url(),
                  },
                  gradedOn: [],
                },
              ],
            },
          })
        }
        if (query === MODULE_SETTINGS_QUERY) {
          return fromValue<{ data: ModuleSettingsQuery }>({
            data: {
              moduleSettings: [
                {
                  module: {
                    name: 'Theory',
                    id: chance.guid(),
                    lessons: {
                      items: [
                        {
                          name: 'Covered',
                        },
                      ],
                    },
                  },
                },
              ],
            } as ModuleSettingsQuery,
          })
        }
      },
      executeMutation: vi.fn(),
    }

    _render(
      <Provider value={client as unknown as Client}>
        <EditCertifications />
      </Provider>,
    )
    expect(screen.getByText(pName1)).toBeInTheDocument()
    expect(screen.getByText(pName2)).toBeInTheDocument()
  })
  it('should _render no modules message when there are no modules', () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_PARTICIPANT_DETAILS) {
          return fromValue<{ data: GetParticipantGradingDetailsQuery }>({
            data: {
              participants: [
                {
                  id: chance.guid(),
                  profile: {
                    fullName: chance.name(),
                    avatar: chance.url(),
                  },
                  gradedOn: [],
                },
              ],
            },
          })
        }
        if (query === MODULE_SETTINGS_QUERY) {
          return fromValue<{ data: ModuleSettingsQuery }>({
            data: {
              moduleSettings: [],
            } as ModuleSettingsQuery,
          })
        }
      },
    } as unknown as Client
    _render(
      <Provider value={client}>
        <EditCertifications />
      </Provider>,
    )
    expect(
      screen.getByText(t('pages.course-grading.no-modules')),
    ).toBeInTheDocument()
  })
})
