import { Lesson, ModuleForGrading } from '../utils/types'

export function isModule(module: object): module is ModuleForGrading {
  return 'id' in module && 'name' in module && 'lessons' in module
}

export function isLesson(lesson: object): lesson is Lesson {
  return 'name' in lesson
}

export function countLessons(lessons: Lesson[]): {
  numberOfLessons: number
  coveredLessons: number
} {
  let numberOfLessons = 0
  let coveredLessons = 0

  if (!Array.isArray(lessons) || !lessons.length) {
    return { numberOfLessons, coveredLessons }
  }

  lessons.forEach(l => {
    if (!isLesson(l)) {
      return
    }

    const childItems = l.items

    const lessonCovered = l.covered ?? false
    const {
      numberOfLessons: numberOfChildLessons,
      coveredLessons: childCoveredLessons,
    } = Array.isArray(childItems)
      ? countLessons(childItems)
      : { numberOfLessons: 0, coveredLessons: 0 }

    numberOfLessons++
    if (lessonCovered) {
      coveredLessons++
    }

    numberOfLessons += numberOfChildLessons
    coveredLessons += childCoveredLessons
  })

  return { coveredLessons, numberOfLessons }
}
