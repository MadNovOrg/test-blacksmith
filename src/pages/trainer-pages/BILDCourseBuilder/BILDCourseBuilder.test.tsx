import React from 'react'
import { Route, Routes } from 'react-router-dom'
import useSWR from 'swr'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { GetCourseByIdQuery } from '@app/generated/graphql'
import { useBildStrategies } from '@app/hooks/useBildStrategies'
import { BildStrategies } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen, userEvent, waitFor, within } from '@test/index'

import { BILDCourseBuilder } from '.'

jest.mock('@app/hooks/useBildStrategies')
jest.mock('swr')
const useSWRMocked = jest.mocked(useSWR)

const useBildStrategiesMocked = jest.mocked(useBildStrategies)

describe('component: BILDCourseBuilder', () => {
  it('renders course builder', async () => {
    const courseId = 10001

    useBildStrategiesMocked.mockReturnValue({
      strategies: [
        {
          id: 1,
          name: BildStrategies.Primary,
          modules: {
            modules: [{ name: 'Module AA', mandatory: false, duration: 30 }],
          },
          shortName: 'MAA',
          duration: 5,
        },
        {
          id: 2,
          name: BildStrategies.RestrictiveTertiaryIntermediate,
          modules: {
            modules: [{ name: 'Module BB', mandatory: false, duration: 15 }],
            groups: [
              {
                name: 'Group 1',
                modules: [
                  { name: 'Module CC', mandatory: false, duration: 10 },
                  { name: 'Module DD', mandatory: false, duration: 20 },
                ],
              },

              {
                name: 'Group 2',
                modules: [
                  { name: 'Module EE', mandatory: false, duration: 10 },
                  { name: 'Module MM', mandatory: true, duration: 20 },
                ],
              },
            ],
          },
          shortName: 'MBB',
          duration: 5,
        },
      ],
      error: undefined,
      isLoading: false,
      status: LoadingStatus.SUCCESS,
    })

    useSWRMocked.mockReturnValue({
      data: {
        course: {
          id: courseId,
          name: 'Course 1',
          __typename: 'Course',
          bildStrategies: [
            { strategyName: BildStrategies.Primary },
            { strategyName: BildStrategies.RestrictiveTertiaryIntermediate },
          ],
        },
        __typename: 'query_root',
      } as unknown as GetCourseByIdQuery,
      error: undefined,
      isValidating: false,
      isLoading: false,
      mutate: jest.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/:id/modules" element={<BILDCourseBuilder />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/courses/${courseId}/modules`] }
    )

    await waitFor(() => {
      expect(screen.getByText('Modules Available')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Course Summary')).toBeInTheDocument()
    })

    expect(screen.getByText('Course 1')).toBeInTheDocument()

    const leftPane = screen.getByTestId('all-modules')

    expect(within(leftPane).getByLabelText('Module AA')).toBeDisabled()
    expect(within(leftPane).getByLabelText('Module BB')).not.toBeDisabled()

    const rightPane = screen.getByTestId('course-modules')
    expect(within(rightPane).getByLabelText('Module AA')).toBeInTheDocument()
    expect(
      within(rightPane).queryByLabelText('Module BB')
    ).not.toBeInTheDocument()

    userEvent.click(within(leftPane).getByLabelText('Module BB'))

    await waitFor(() => {
      expect(
        within(rightPane).queryByLabelText('Module BB')
      ).toBeInTheDocument()
    })

    userEvent.click(within(leftPane).getByLabelText('Group 1'))

    await waitFor(() => {
      expect(
        within(rightPane).queryByLabelText('Module CC')
      ).toBeInTheDocument()
      expect(
        within(rightPane).queryByLabelText('Module DD')
      ).toBeInTheDocument()
    })

    userEvent.click(
      within(leftPane).getByTestId(
        `strategy-${BildStrategies.RestrictiveTertiaryIntermediate}`
      )
    )

    userEvent.click(within(leftPane).getByTestId(`expand-button-Group 2`))

    await waitFor(() => {
      expect(
        within(leftPane).queryByTestId(
          `module-${BildStrategies.RestrictiveTertiaryIntermediate}.Group 2.Module EE`
        )
      ).toBeInTheDocument()
    })

    userEvent.click(
      within(leftPane).getByTestId(
        `module-${BildStrategies.RestrictiveTertiaryIntermediate}.Group 2.Module EE`
      )
    )

    await waitFor(() => {
      expect(
        within(rightPane).queryByLabelText('Module EE')
      ).toBeInTheDocument()
      expect(
        within(rightPane).queryByLabelText('Module MM')
      ).toBeInTheDocument()
    })
  })
})
