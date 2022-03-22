import * as fs from 'fs'

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
