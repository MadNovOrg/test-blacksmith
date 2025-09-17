import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { noop } from 'ts-essentials'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { CourseToBuildQuery, Course_Level_Enum } from '@app/generated/graphql'
import {
  Strategies,
  useBildStrategies,
} from '@app/modules/course/hooks/useBildStrategies'
import { BILDModule, BILDModuleGroup, BildStrategies } from '@app/types'
import { LoadingStatus } from '@app/util'

import {
  chance,
  fireEvent,
  _render,
  screen,
  userEvent,
  within,
} from '@test/index'

import { buildCourse } from '../../test-utils'
import { useModuleSettings } from '../ICMCourseBuilderV2/hooks/useModuleSettings'

import { BILDBuilderCourseData, BILDCourseBuilder } from './BILDCourseBuilder'

vi.mock('@app/modules/course/hooks/useBildStrategies')
vi.mock('../ICMCourseBuilderV2/hooks/useModuleSettings')

const useBildStrategiesMocked = vi.mocked(useBildStrategies)
const useModuleSettingsMocked = vi.mocked(useModuleSettings)

describe('component: BILDCourseBuilder', () => {
  beforeEach(() => {
    useModuleSettingsMocked.mockReturnValue([
      { data: { moduleSettings: [] }, fetching: false, stale: false },
      noop,
    ])
  })

  it('renders course builder', async () => {
    const courseId = 10001

    const primaryStrategy = buildStrategy({
      name: BildStrategies.Primary,
      modules: {
        modules: [buildBILDModule({ name: 'Module AA' })],
      },
    })

    const restrictiveIntermediateStrategy = buildStrategy({
      name: BildStrategies.RestrictiveTertiaryIntermediate,
      modules: {
        modules: [buildBILDModule({ name: 'Module BB' })],
        groups: [
          buildBILDModuleGroup({
            name: 'Group 1',
            modules: [
              { name: 'Module CC', mandatory: false, duration: 10 },
              { name: 'Module DD', mandatory: false, duration: 20 },
            ],
          }),
          buildBILDModuleGroup({
            name: 'Group 2',
            modules: [
              buildBILDModule({
                name: 'Module EE',
                mandatory: false,
                duration: 10,
              }),
              buildBILDModule({
                name: 'Module MM',
                mandatory: true,
                duration: 20,
              }),
            ],
          }),
        ],
      },
    })

    useBildStrategiesMocked.mockReturnValue({
      strategies: [primaryStrategy, restrictiveIntermediateStrategy],
      isLoading: false,
      error: undefined,
      status: LoadingStatus.SUCCESS,
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: CourseToBuildQuery }>({
          data: {
            course: buildCourse({
              id: courseId,
              name: 'Course 1',
              bildStrategies: [
                { strategyName: BildStrategies.Primary },
                {
                  strategyName: BildStrategies.RestrictiveTertiaryIntermediate,
                },
              ],
            }),
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/:id/modules" element={<BILDCourseBuilder />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/courses/${courseId}/modules`] },
    )

    expect(screen.getByText('Modules Available')).toBeInTheDocument()
    expect(screen.getByText('Course Summary')).toBeInTheDocument()
    expect(screen.getByText('Course 1')).toBeInTheDocument()

    const leftPane = screen.getByTestId('all-modules')

    expect(within(leftPane).getByLabelText('Module AA')).toBeDisabled()
    expect(within(leftPane).getByLabelText('Module BB')).not.toBeDisabled()

    const rightPane = screen.getByTestId('course-modules')

    expect(within(rightPane).getByLabelText('Module AA')).toBeInTheDocument()
    expect(
      within(rightPane).queryByLabelText('Module BB'),
    ).not.toBeInTheDocument()

    await userEvent.click(within(leftPane).getByLabelText('Module BB'))

    expect(within(rightPane).queryByLabelText('Module BB')).toBeInTheDocument()

    await userEvent.click(
      within(leftPane).getByLabelText('Group 1', { exact: false }),
    )

    expect(within(rightPane).queryByLabelText('Module CC')).toBeInTheDocument()
    expect(within(rightPane).queryByLabelText('Module DD')).toBeInTheDocument()

    await userEvent.click(
      within(leftPane).getByTestId(
        `strategy-${BildStrategies.RestrictiveTertiaryIntermediate}`,
      ),
    )

    await userEvent.click(within(leftPane).getByTestId(`expand-button-Group 2`))

    expect(
      within(leftPane).queryByTestId(
        `module-${BildStrategies.RestrictiveTertiaryIntermediate}.Group 2.Module EE`,
      ),
    ).toBeInTheDocument()

    await userEvent.click(
      within(leftPane).getByTestId(
        `module-${BildStrategies.RestrictiveTertiaryIntermediate}.Group 2.Module EE`,
      ),
    )

    expect(within(rightPane).queryByLabelText('Module EE')).toBeInTheDocument()
    expect(within(rightPane).queryByLabelText('Module MM')).toBeInTheDocument()
  })

  it('renders course builder with course data instead of course id query param', async () => {
    const primaryStrategy = buildStrategy({
      name: BildStrategies.Primary,
      modules: {
        modules: [buildBILDModule({ name: 'Module AA' })],
      },
    })

    const restrictiveIntermediateStrategy = buildStrategy({
      name: BildStrategies.RestrictiveTertiaryIntermediate,
      modules: {
        modules: [buildBILDModule({ name: 'Module BB' })],
        groups: [
          buildBILDModuleGroup({
            name: 'Group 1',
            modules: [
              { name: 'Module CC', mandatory: false, duration: 10 },
              { name: 'Module DD', mandatory: false, duration: 20 },
            ],
          }),
          buildBILDModuleGroup({
            name: 'Group 2',
            modules: [
              buildBILDModule({
                name: 'Module EE',
                mandatory: false,
                duration: 10,
              }),
              buildBILDModule({
                name: 'Module MM',
                mandatory: true,
                duration: 20,
              }),
            ],
          }),
        ],
      },
    })

    useBildStrategiesMocked.mockReturnValue({
      strategies: [primaryStrategy, restrictiveIntermediateStrategy],
      isLoading: false,
      error: undefined,
      status: LoadingStatus.SUCCESS,
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <BILDCourseBuilder
          data={{
            course: buildCourse({
              name: 'Course 1',
              bildStrategies: [
                { strategyName: BildStrategies.Primary },
                {
                  strategyName: BildStrategies.RestrictiveTertiaryIntermediate,
                },
              ],
            }) as BILDBuilderCourseData['course'],
          }}
        />
      </Provider>,
    )

    expect(screen.getByText('Modules Available')).toBeInTheDocument()
    expect(screen.getByText('Course Summary')).toBeInTheDocument()
    expect(screen.getByText('Course 1')).toBeInTheDocument()

    const leftPane = screen.getByTestId('all-modules')

    expect(within(leftPane).getByLabelText('Module AA')).toBeDisabled()
    expect(within(leftPane).getByLabelText('Module BB')).not.toBeDisabled()

    const rightPane = screen.getByTestId('course-modules')

    expect(within(rightPane).getByLabelText('Module AA')).toBeInTheDocument()
    expect(
      within(rightPane).queryByLabelText('Module BB'),
    ).not.toBeInTheDocument()

    await userEvent.click(within(leftPane).getByLabelText('Module BB'))

    expect(within(rightPane).queryByLabelText('Module BB')).toBeInTheDocument()

    await userEvent.click(
      within(leftPane).getByLabelText('Group 1', { exact: false }),
    )

    expect(within(rightPane).queryByLabelText('Module CC')).toBeInTheDocument()
    expect(within(rightPane).queryByLabelText('Module DD')).toBeInTheDocument()

    await userEvent.click(
      within(leftPane).getByTestId(
        `strategy-${BildStrategies.RestrictiveTertiaryIntermediate}`,
      ),
    )

    await userEvent.click(within(leftPane).getByTestId(`expand-button-Group 2`))

    expect(
      within(leftPane).queryByTestId(
        `module-${BildStrategies.RestrictiveTertiaryIntermediate}.Group 2.Module EE`,
      ),
    ).toBeInTheDocument()

    await userEvent.click(
      within(leftPane).getByTestId(
        `module-${BildStrategies.RestrictiveTertiaryIntermediate}.Group 2.Module EE`,
      ),
    )

    expect(within(rightPane).queryByLabelText('Module EE')).toBeInTheDocument()
    expect(within(rightPane).queryByLabelText('Module MM')).toBeInTheDocument()
  })

  it.each([
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ])(
    `pre-selects and disables all strategies if a course is of level %s`,
    async courseLevel => {
      const courseId = 10001

      const primaryStrategy = buildStrategy({
        name: BildStrategies.Primary,
        modules: {
          modules: [buildBILDModule({ name: 'Module AA' })],
        },
      })

      const restrictiveIntermediateStrategy = buildStrategy({
        name: BildStrategies.RestrictiveTertiaryIntermediate,
        modules: {
          modules: [buildBILDModule({ name: 'Module BB' })],
          groups: [
            buildBILDModuleGroup({
              name: 'Group 1',
              modules: [
                buildBILDModule({
                  name: 'Module CC',
                  mandatory: false,
                  duration: 10,
                }),
                buildBILDModule({
                  name: 'Module DD',
                  mandatory: false,
                  duration: 20,
                }),
              ],
            }),
            buildBILDModuleGroup({
              name: 'Group 2',
              modules: [
                buildBILDModule({
                  name: 'Module EE',
                  mandatory: false,
                  duration: 10,
                }),
                buildBILDModule({
                  name: 'Module MM',
                  mandatory: true,
                  duration: 20,
                }),
              ],
            }),
          ],
        },
      })

      useBildStrategiesMocked.mockReturnValue({
        strategies: [primaryStrategy, restrictiveIntermediateStrategy],
        isLoading: false,
        error: undefined,
        status: LoadingStatus.SUCCESS,
      })

      const client = {
        executeQuery: () =>
          fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course: buildCourse({
                id: courseId,
                level: courseLevel,
                name: 'Course 1',
                bildStrategies: [
                  { strategyName: BildStrategies.Primary },
                  {
                    strategyName:
                      BildStrategies.RestrictiveTertiaryIntermediate,
                  },
                ],
              }),
            },
          }),
      } as unknown as Client

      _render(
        <Provider value={client}>
          <Routes>
            <Route
              path="/courses/:id/modules"
              element={<BILDCourseBuilder />}
            />
          </Routes>
        </Provider>,
        {},
        { initialEntries: [`/courses/${courseId}/modules`] },
      )

      const leftPane = screen.getByTestId('all-modules')
      const rightPane = screen.getByTestId('course-modules')

      const allModuleCheckboxes = within(leftPane).getAllByLabelText(/module/i)

      allModuleCheckboxes.forEach(checkbox => {
        expect(checkbox).toBeDisabled()
      })

      const allSelectedModules = within(rightPane).getAllByLabelText(/module/i)

      expect(allSelectedModules).toHaveLength(6)
    },
  )

  it.each([
    [Course_Level_Enum.BildIntermediateTrainer],
    [Course_Level_Enum.BildAdvancedTrainer],
  ])("doesn't display estimated duration for %s courses", courseLevel => {
    const courseId = 10001

    const primaryStrategy = buildStrategy({
      name: BildStrategies.Primary,
      modules: {
        modules: [buildBILDModule({ name: 'Module AA' })],
      },
    })

    const restrictiveIntermediateStrategy = buildStrategy({
      name: BildStrategies.RestrictiveTertiaryIntermediate,
      modules: {
        modules: [buildBILDModule({ name: 'Module BB' })],
        groups: [
          buildBILDModuleGroup({
            name: 'Group 1',
            modules: [
              buildBILDModule({
                name: 'Module CC',
                mandatory: false,
                duration: 10,
              }),
              buildBILDModule({
                name: 'Module DD',
                mandatory: false,
                duration: 20,
              }),
            ],
          }),
          buildBILDModuleGroup({
            name: 'Group 2',
            modules: [
              buildBILDModule({
                name: 'Module EE',
                mandatory: false,
                duration: 10,
              }),
              buildBILDModule({
                name: 'Module MM',
                mandatory: true,
                duration: 20,
              }),
            ],
          }),
        ],
      },
    })

    useBildStrategiesMocked.mockReturnValue({
      strategies: [primaryStrategy, restrictiveIntermediateStrategy],
      isLoading: false,
      error: undefined,
      status: LoadingStatus.SUCCESS,
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: CourseToBuildQuery }>({
          data: {
            course: buildCourse({
              id: courseId,
              level: courseLevel,
              name: 'Course 1',
              bildStrategies: [
                { strategyName: BildStrategies.Primary },
                {
                  strategyName: BildStrategies.RestrictiveTertiaryIntermediate,
                },
              ],
            }),
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/:id/modules" element={<BILDCourseBuilder />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/courses/${courseId}/modules`] },
    )

    expect(screen.queryByText(/estimated duration/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/\bminimum\s+(\d{3,})\s+hours\b/i),
    ).not.toBeInTheDocument()

    expect(screen.queryByText(/\b(\d+)\s+mins\b/i)).not.toBeInTheDocument()
  })

  it('submit course builder with no course id, but course data provided instead', async () => {
    const primaryStrategy = buildStrategy({
      name: BildStrategies.Primary,
      modules: {
        modules: [buildBILDModule({ name: 'Module AA' })],
      },
    })

    const restrictiveIntermediateStrategy = buildStrategy({
      name: BildStrategies.RestrictiveTertiaryIntermediate,
      modules: {
        modules: [buildBILDModule({ name: 'Module BB' })],
        groups: [
          buildBILDModuleGroup({
            name: 'Group 1',
            modules: [
              buildBILDModule({
                name: 'Module CC',
                mandatory: false,
                duration: 10,
              }),
              buildBILDModule({
                name: 'Module DD',
                mandatory: false,
                duration: 20,
              }),
            ],
          }),
          buildBILDModuleGroup({
            name: 'Group 2',
            modules: [
              buildBILDModule({
                name: 'Module EE',
                mandatory: false,
                duration: 10,
              }),
              buildBILDModule({
                name: 'Module MM',
                mandatory: true,
                duration: 20,
              }),
            ],
          }),
        ],
      },
    })

    useBildStrategiesMocked.mockReturnValue({
      strategies: [primaryStrategy, restrictiveIntermediateStrategy],
      isLoading: false,
      error: undefined,
      status: LoadingStatus.SUCCESS,
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    const onSubmit = vitest.fn()
    const onBildModuleChange = vitest.fn()

    _render(
      <Provider value={client}>
        <BILDCourseBuilder
          data={{
            course: buildCourse({
              level: Course_Level_Enum.BildRegular,
              name: 'Course 1',
              bildStrategies: [
                {
                  strategyName: BildStrategies.Primary,
                },
              ],
            }) as BILDBuilderCourseData['course'],
          }}
          onSubmit={onSubmit}
          onModuleSelectionChange={onBildModuleChange}
        />
      </Provider>,
      {},
    )

    expect(onBildModuleChange).toHaveBeenCalled()

    fireEvent.click(screen.getByTestId('submit-button'))
    expect(onSubmit).toHaveBeenCalled()
  })
})

function buildStrategy(overrides?: Partial<Strategies[0]>): Strategies[0] {
  return {
    id: chance.guid(),
    shortName: chance.word(),
    name: BildStrategies.Primary,
    modules: { modules: [buildBILDModule()], groups: [buildBILDModuleGroup()] },
    duration: 10,
    ...overrides,
  }
}

function buildBILDModuleGroup(
  overrides?: Partial<BILDModuleGroup>,
): BILDModuleGroup {
  return {
    name: chance.word(),
    duration: 10,
    modules: [buildBILDModule()],
    ...overrides,
  }
}

function buildBILDModule(overrides?: Partial<BILDModule>): BILDModule {
  return {
    name: chance.word(),
    mandatory: false,
    duration: 10,
    ...overrides,
  }
}
