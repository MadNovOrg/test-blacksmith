import * as fs from 'fs'

import { ModuleGroup } from './data/types'
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
