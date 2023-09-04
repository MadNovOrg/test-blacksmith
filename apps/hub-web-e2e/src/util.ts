import * as fs from 'fs'

import { addDays, format } from 'date-fns'

import { TARGET_ENV, TEMP_DIR } from './constants'
import { CourseTableRow, ModuleGroup } from './data/types'

type KeyValue = {
  name: string
  value: string
}

export const stateFilePath = (userKey: string) =>
  `${TEMP_DIR}/storage-${userKey}-${TARGET_ENV}.json`

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const getAdminIdToken: () => string = () => {
  const data = JSON.parse(fs.readFileSync(stateFilePath('admin')).toString())
  return data.origins[0].localStorage.filter((pair: KeyValue) =>
    pair.name.endsWith('idToken')
  )[0].value
}

export const sortModulesByName = (a: ModuleGroup, b: ModuleGroup) => {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}

export const sortCoursesByAllFields = (
  a: CourseTableRow,
  b: CourseTableRow
) => {
  const strA = JSON.stringify(a)
  const strB = JSON.stringify(b)
  return strA.localeCompare(strB)
}

export const toUiTime = (date: Date) => {
  return date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
}

export const getFormattedDate = (daysToAdd: number) => {
  const newDate = addDays(new Date(), daysToAdd)
  return format(newDate, 'ddMMyyyy')
}
