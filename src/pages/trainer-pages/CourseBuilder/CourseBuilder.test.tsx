import React from 'react'
import { Route, Routes } from 'react-router-dom'
import useSWR from 'swr'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { CourseType, CourseLevel } from '@app/types'

import { render, screen, waitFor } from '@test/index'
import { buildCourse, buildModuleGroup } from '@test/mock-data-utils'

import { CourseBuilder } from '.'

jest.mock('swr')
const useSWRMocked = jest.mocked(useSWR)

const buildSWRCourseAndGroupsResponse = (
  level: CourseLevel,
  type: CourseType
) => {
  const moduleGroup = buildModuleGroup({
    overrides: {
      level,
      duration: { aggregate: { sum: { duration: 1 } } },
    },
  })

  const course = buildCourse({
    overrides: {
      type,
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

    const levelOneIndirectInfoMessage =
      /Additional intermediate modules that are not listed would need to be delivered as part of Level Two course/

    it('shows the info alert for level 1 course', async () => {
      const levelOneCourseAndGroups = buildSWRCourseAndGroupsResponse(
        CourseLevel.Level_1,
        CourseType.OPEN
      )
      useSWRMocked.mockReturnValue(levelOneCourseAndGroups)

      const client = {
        executeQuery: () => never,
      } as unknown as Client

      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/:id/modules" element={<CourseBuilder />} />
          </Routes>
        </Provider>,
        {},
        {
          initialEntries: [
            `/courses/${levelOneCourseAndGroups.data.course.id}/modules`,
          ],
        }
      )

      await waitFor(() => {
        expect(screen.getByText(levelOneInfoMessage)).toBeInTheDocument()
      })
    })

    it('shows a different info alert for level 1 indirect course', async () => {
      const levelOneCourseAndGroups = buildSWRCourseAndGroupsResponse(
        CourseLevel.Level_1,
        CourseType.INDIRECT
      )
      useSWRMocked.mockReturnValue(levelOneCourseAndGroups)

      const client = {
        executeQuery: () => never,
      } as unknown as Client

      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/:id/modules" element={<CourseBuilder />} />
          </Routes>
        </Provider>,
        {},
        {
          initialEntries: [
            `/courses/${levelOneCourseAndGroups.data.course.id}/modules`,
          ],
        }
      )

      await waitFor(() => {
        expect(
          screen.getByText(levelOneIndirectInfoMessage)
        ).toBeInTheDocument()
      })
    })
    it('hides the info alert for level 2 course', async () => {
      const levelTwoCourseAndGroups = buildSWRCourseAndGroupsResponse(
        CourseLevel.Level_2,
        CourseType.OPEN
      )
      useSWRMocked.mockReturnValue(levelTwoCourseAndGroups)

      const client = {
        executeQuery: () => never,
      } as unknown as Client

      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/:id/modules" element={<CourseBuilder />} />
          </Routes>
        </Provider>,
        {},
        {
          initialEntries: [
            `/courses/${levelTwoCourseAndGroups.data.course.id}/modules`,
          ],
        }
      )

      expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
    })
  })
})
