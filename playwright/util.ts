import * as fs from 'fs'

import { CourseTableRow, ModuleGroup } from './data/types'
import { stateFilePath } from './hooks/global-setup'

type KeyValue = {
  name: string
  value: string
}

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
  if (JSON.stringify(a) < JSON.stringify(b)) return -1
  if (JSON.stringify(a) > JSON.stringify(b)) return 1
  return 0
}

// Set the date to be in 'X' months time, if not provided, defaults to next month
export const inXMonths = (months = 1) => {
  const date = new Date()
  const nextMonth = new Date().getMonth() + months
  return new Date(date.setMonth(nextMonth))
}

export const toUiTime = (date: Date) => {
  return date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
}
