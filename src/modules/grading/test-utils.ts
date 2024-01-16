import { chance } from '@test/index'

import { ModuleForGrading, Lesson } from './types'

export function buildModule(
  overrides?: Partial<
    Pick<
      ModuleForGrading,
      'id' | 'name' | 'displayName' | 'lessons' | 'mandatory'
    >
  >
): Pick<ModuleForGrading, 'id' | 'name' | 'displayName' | 'lessons'> {
  return {
    id: chance.guid(),
    name: chance.word(),
    displayName: null,
    lessons: { items: [buildLesson()] },
    mandatory: false,
    ...overrides,
  }
}

export function buildLesson(overrides?: Partial<Lesson>): Lesson {
  return {
    name: chance.word(),
    covered: false,
    items: [],
    ...overrides,
  }
}
