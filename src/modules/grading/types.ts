import { Module_V2 } from '@app/generated/graphql'

export type Lesson = {
  name: string
  covered?: boolean
  items?: Lesson[]
}

export type ModuleForGrading = Module_V2 & { mandatory?: boolean }
