import { Lesson, ModuleForGrading } from './types'

export function isModule(module: object): module is ModuleForGrading {
  if (
    'id' in module &&
    'name' in module &&
    'lessons' in module &&
    'displayName' in module
  ) {
    return true
  }

  return false
}

export function isLesson(lesson: object): lesson is Lesson {
  return 'name' in lesson
}
