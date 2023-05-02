export type BILDModule = {
  name: string
  mandatory?: boolean
  duration?: number
}

export type BILDModuleGroup = {
  name: string
  duration?: number
  modules: BILDModule[]
}

export type Strategy = {
  modules?: BILDModule[]
  groups: BILDModuleGroup[]
}
