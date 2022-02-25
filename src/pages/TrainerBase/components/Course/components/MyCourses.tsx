import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import format from 'date-fns/format'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@app/components/IconButton'
import { TD } from '@app/components/Table/TD'
import { FilterAccordion } from '@app/components/FilterAccordion'
import type { FilterOption } from '@app/components/FilterAccordion'

import {
  QUERY as GetMyCourses,
  ResponseType as GetMyCoursesResponseType,
  ParamsType as GetMyCourseParamsType,
} from '@app/queries/courses/get-courses'
import { Course, CourseLevel, CourseType } from '@app/types'

type MyCoursesProps = unknown

// TODO: finalize after getting correct statuses from business
function getCourseStatus(c: Course) {
  if (c.submitted) {
    return 'Published'
  }

  if (c.modulesAgg.aggregate.count === 0) {
    return 'Pending'
  }

  return 'Draft'
}

type Sort =
  | 'name-asc'
  | 'name-desc'
  | 'org-asc'
  | 'org-desc'
  | 'type-asc'
  | 'type-desc'
  | 'start-asc'
  | 'start-desc'
  | 'end-asc'
  | 'end-desc'

const sorts: Record<Sort, object> = {
  'name-asc': { name: 'asc' },
  'name-desc': { name: 'desc' },
  'org-asc': { organization: { name: 'asc' } },
  'org-desc': { organization: { name: 'desc' } },
  'type-asc': { name: 'asc' },
  'type-desc': { type: 'desc' },
  'start-asc': { schedule_aggregate: { min: { start: 'asc' } } },
  'start-desc': { schedule_aggregate: { min: { start: 'desc' } } },
  'end-asc': { schedule_aggregate: { min: { end: 'asc' } } },
  'end-desc': { schedule_aggregate: { min: { end: 'desc' } } },
}

export const MyCourses: React.FC<MyCoursesProps> = () => {
  const { t } = useTranslation()

  const levelOptions = useMemo<FilterOption[]>(() => {
    return Object.values(CourseLevel).map<FilterOption>(level => ({
      id: level,
      title: t(`common.course-levels.${level}`),
      selected: false,
    }))
  }, [t])

  const typeOptions = useMemo<FilterOption[]>(() => {
    return Object.values(CourseType).map<FilterOption>(type => ({
      id: type,
      title: t(`common.course-types.${type}`),
      selected: false,
    }))
  }, [t])

  const [keyword, setKeyword] = useState('')
  const [levelFilter, setLevelFilter] = useState<FilterOption[]>(levelOptions)
  const [typeFilter, setTypeFilter] = useState<FilterOption[]>(typeOptions)
  const [sort, setSort] = useState('name-asc')

  const where = useMemo(() => {
    const obj: Record<string, object> = {}

    const selectedLevels = levelFilter.flatMap(item =>
      item.selected ? item.id : []
    )

    if (selectedLevels.length) {
      obj.level = { _in: selectedLevels }
    }

    const selectedTypes = typeFilter.flatMap(item =>
      item.selected ? item.id : []
    )

    if (selectedTypes.length) {
      obj.type = { _in: selectedTypes }
    }

    if (keyword.trim().length) {
      obj.name = { _ilike: `%${keyword}%` }
    }

    return obj
  }, [levelFilter, typeFilter, keyword])

  const { data } = useSWR<
    GetMyCoursesResponseType,
    Error,
    [string, GetMyCourseParamsType]
  >([GetMyCourses, { orderBy: sorts[sort as Sort], where }])

  return (
    <div className="flex py-2">
      <div className="w-48 hidden sm:flex flex-col pt-8 pr-4">
        <p className="text-sm text-gray-400 mb-4">Filter by</p>

        <div className="flex flex-col">
          <FilterAccordion
            options={levelFilter}
            title="Level"
            onChange={setLevelFilter}
          />

          <FilterAccordion
            className="mt-4"
            options={typeFilter}
            title="Course type"
            onChange={setTypeFilter}
          />
        </div>
      </div>

      <div className="flex-1">
        <p className="font-light text-2xl sm:text-4xl">My Courses</p>
        <p className="font-semibold">6 items</p>

        <div className="my-4">
          <input
            type="text"
            className="bg-gray-50 border-0"
            placeholder="Search"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </div>

        <table className="border-collapse w-full bg-white text-sm">
          <thead className="font-normal text-gray-400">
            <tr>
              <TD id="name" title="Course name" sort={sort} onSort={setSort} />
              <TD
                id="orgName"
                title="Organization"
                sort={sort}
                onSort={setSort}
              />
              <TD id="type" title="Course type" sort={sort} onSort={setSort} />
              <TD id="start" title="Start" sort={sort} onSort={setSort} />
              <TD id="end" title="End" sort={sort} onSort={setSort} />
              <TD id="status" title="Status" />
              <td className="py-4 px-2"> </td>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {data?.course?.map((c, index) => (
              <tr key={c.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-4 px-2">
                  <p className="font-semibold text-base mb-1">
                    {t(`common.course-levels.${c.level}`)}
                  </p>
                  <p className="text-gray-400">{c.name}</p>
                </td>
                <td className="py-4 px-2">{c.organization?.name}</td>
                <td className="py-4 px-2 capitalize">{c.type}</td>
                <td className="py-4 px-2">
                  {c.dates.aggregate.start.date && (
                    <div>
                      <p className="mb-1">
                        {format(
                          new Date(c.dates.aggregate.start.date),
                          'dd MMM'
                        )}
                      </p>
                      <p className="text-gray-400">
                        {format(
                          new Date(c.dates.aggregate.start.date),
                          'hh:mm aa'
                        )}
                      </p>
                    </div>
                  )}
                </td>
                <td className="py-4 px-2">
                  {c.dates.aggregate.end.date && (
                    <div>
                      <p className="mb-1">
                        {format(new Date(c.dates.aggregate.end.date), 'dd MMM')}
                      </p>
                      <p className="text-gray-400">
                        {format(
                          new Date(c.dates.aggregate.end.date),
                          'hh:mm aa'
                        )}
                      </p>
                    </div>
                  )}
                </td>
                <td className="py-4 px-2">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-500 text-xs font-semibold">
                    {getCourseStatus(c)}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center">
                    <button className="btn primary small mr-2">Manage</button>
                    <IconButton name="more-horiz" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
