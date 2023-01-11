import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import useSWR from 'swr'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { CourseType, CourseLevel } from '@app/types'

import { render, screen, waitFor } from '@test/index'
import { buildCourse, buildModuleGroup } from '@test/mock-data-utils'

import { CourseBuilder } from '.'

jest.mock('swr')
const useSWRMocked = jest.mocked(useSWR)

const buildSWRCourseAndGroupsResponse = (level: CourseLevel) => {
  const moduleGroup = buildModuleGroup({
    overrides: {
      level,
      duration: { aggregate: { sum: { duration: 1 } } },
    },
  })

  const course = buildCourse({
    overrides: {
      type: CourseType.OPEN,
      level,
      moduleGroupIds: [{ module: { moduleGroup: { id: moduleGroup.id } } }],
    },
  })

  return {
    mutate: jest.fn(),
    isValidating: false,
    data: { course, groups: [moduleGroup] },
    isLoading: false,
    error: null,
  }
}

describe('component: CourseBuilder', () => {
  describe('info alert for level 1 course', () => {
    const levelOneInfoMessage =
      /Additional holds that are not listed above, will fall under the Level Two certification./

    it('shows the info alert for level 1 course', async () => {
      const levelOneCourseAndGroups = buildSWRCourseAndGroupsResponse(
        CourseLevel.Level_1
      )
      useSWRMocked.mockReturnValue(levelOneCourseAndGroups)

      const client = {
        executeQuery: () => never,
      } as unknown as Client

      render(
        <MemoryRouter
          initialEntries={[
            `/courses/${levelOneCourseAndGroups.data.course.id}/modules`,
          ]}
        >
          <Provider value={client}>
            <Routes>
              <Route path="/courses/:id/modules" element={<CourseBuilder />} />
            </Routes>
          </Provider>
        </MemoryRouter>
      )

      await waitFor(() => {
        expect(screen.getByText(levelOneInfoMessage)).toBeInTheDocument()
      })
    })

    it('hides the info alert for level 2 course', async () => {
      const levelTwoCourseAndGroups = buildSWRCourseAndGroupsResponse(
        CourseLevel.Level_2
      )
      useSWRMocked.mockReturnValue(levelTwoCourseAndGroups)

      const client = {
        executeQuery: () => never,
      } as unknown as Client

      render(
        <MemoryRouter
          initialEntries={[
            `/courses/${levelTwoCourseAndGroups.data.course.id}/modules`,
          ]}
        >
          <Provider value={client}>
            <Routes>
              <Route path="/courses/:id/modules" element={<CourseBuilder />} />
            </Routes>
          </Provider>
        </MemoryRouter>
      )

      expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
    })
  })
})
