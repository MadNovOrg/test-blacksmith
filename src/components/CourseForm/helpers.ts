import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'

export function getLevels(courseType: CourseType) {
  const types = {
    [CourseType.OPEN]: () => {
      return [
        CourseLevel.LEVEL_1,
        CourseLevel.INTERMEDIATE_TRAINER,
        CourseLevel.ADVANCED_TRAINER,
      ]
    },

    [CourseType.CLOSED]: () => {
      return [
        CourseLevel.LEVEL_1,
        CourseLevel.LEVEL_2,
        CourseLevel.ADVANCED,
        CourseLevel.INTERMEDIATE_TRAINER,
        CourseLevel.ADVANCED_TRAINER,
      ]
    },

    [CourseType.INDIRECT]: () => {
      return [CourseLevel.LEVEL_1, CourseLevel.LEVEL_2, CourseLevel.ADVANCED]
    },
  }

  return types[courseType]()
}

export function canBeBlended(
  courseType: CourseType,
  courseLevel: CourseLevel | '',
  deliveryType: CourseDeliveryType
) {
  const isF2F = deliveryType === CourseDeliveryType.F2F
  const isMixed = deliveryType === CourseDeliveryType.MIXED
  const isVirtual = deliveryType === CourseDeliveryType.VIRTUAL

  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        // OPEN + F2F can never be blended
      }

      if (isMixed) {
        // OPEN + Mixed can never be blended
      }

      if (isVirtual) {
        // OPEN + Virtual can never be blended
      }

      return false
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [CourseLevel.LEVEL_1, CourseLevel.LEVEL_2]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        // CLOSED + Mixed can never be blended
      }

      if (isVirtual) {
        const levels = [CourseLevel.LEVEL_1]
        return levels.includes(courseLevel)
      }

      return false
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [CourseLevel.LEVEL_1, CourseLevel.LEVEL_2]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        // INDIRECT + Mixed can never be blended
      }

      if (isVirtual) {
        const levels = [CourseLevel.LEVEL_1]
        return levels.includes(courseLevel)
      }

      return false
    },
  }

  return types[courseType]()
}

export function canBeReacc(
  courseType: CourseType,
  courseLevel: CourseLevel | '',
  deliveryType: CourseDeliveryType,
  blended: boolean
) {
  const isF2F = deliveryType === CourseDeliveryType.F2F
  const isMixed = deliveryType === CourseDeliveryType.MIXED
  const isVirtual = deliveryType === CourseDeliveryType.VIRTUAL

  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [
          CourseLevel.INTERMEDIATE_TRAINER,
          CourseLevel.ADVANCED_TRAINER,
        ]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isMixed) {
        // OPEN + Mixed can never be reaccreditation
      }

      if (isVirtual) {
        // OPEN + Virtual can never be reaccreditation
      }

      return false
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [
          CourseLevel.LEVEL_1,
          CourseLevel.INTERMEDIATE_TRAINER,
          CourseLevel.ADVANCED_TRAINER,
        ]
        if (levels.includes(courseLevel)) return !blended
        if (courseLevel === CourseLevel.LEVEL_2) return true
      }

      if (isMixed) {
        const levels = [CourseLevel.LEVEL_1, CourseLevel.LEVEL_2]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isVirtual) {
        const levels = [CourseLevel.LEVEL_1]
        if (levels.includes(courseLevel)) return !blended
      }

      return false
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [CourseLevel.LEVEL_1]
        if (levels.includes(courseLevel)) return !blended
        if (courseLevel === CourseLevel.LEVEL_2) return true
      }

      if (isMixed) {
        const levels = [CourseLevel.LEVEL_1, CourseLevel.LEVEL_2]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isVirtual) {
        const levels = [CourseLevel.LEVEL_1]
        if (levels.includes(courseLevel)) return !blended
      }

      return false
    },
  }

  return types[courseType]()
}

export function canBeF2F(
  courseType: CourseType,
  courseLevel: CourseLevel | ''
) {
  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      const levels = [
        CourseLevel.LEVEL_1,
        CourseLevel.INTERMEDIATE_TRAINER,
        CourseLevel.ADVANCED_TRAINER,
      ]
      return levels.includes(courseLevel)
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      const levels = [
        CourseLevel.LEVEL_1,
        CourseLevel.LEVEL_2,
        CourseLevel.ADVANCED,
        CourseLevel.INTERMEDIATE_TRAINER,
        CourseLevel.ADVANCED_TRAINER,
      ]
      return levels.includes(courseLevel)
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      const levels = [
        CourseLevel.LEVEL_1,
        CourseLevel.LEVEL_2,
        CourseLevel.ADVANCED,
      ]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeMixed(
  courseType: CourseType,
  courseLevel: CourseLevel | ''
) {
  const types = {
    [CourseType.OPEN]: () => {
      return false
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      const levels = [CourseLevel.LEVEL_1, CourseLevel.LEVEL_2]
      return levels.includes(courseLevel)
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      const levels = [CourseLevel.LEVEL_1, CourseLevel.LEVEL_2]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeVirtual(
  courseType: CourseType,
  courseLevel: CourseLevel | ''
) {
  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      const levels = [CourseLevel.LEVEL_1]
      return levels.includes(courseLevel)
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      const levels = [CourseLevel.LEVEL_1]
      return levels.includes(courseLevel)
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      const levels = [CourseLevel.LEVEL_1]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}
