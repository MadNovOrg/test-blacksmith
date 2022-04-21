import React, { useCallback, useContext, useMemo, useState } from 'react'

import { ValidCourseInput } from '@app/types'

type ContextValue = {
  courseData?: ValidCourseInput
  storeCourseData: (courseData: ValidCourseInput) => void
}

const CreateCourseContext = React.createContext<ContextValue | undefined>(
  undefined
)

type Props = {
  initialValue?: ValidCourseInput
}

export const CreateCourseProvider: React.FC<Props> = ({
  children,
  initialValue,
}) => {
  const [courseData, setCourseData] = useState<ValidCourseInput | undefined>(
    initialValue
  )

  const storeCourseData = useCallback((courseInput: ValidCourseInput) => {
    setCourseData(courseInput)
  }, [])

  const value = useMemo(() => {
    return {
      courseData,
      storeCourseData,
    }
  }, [storeCourseData, courseData])

  return (
    <CreateCourseContext.Provider value={value}>
      {children}
    </CreateCourseContext.Provider>
  )
}

export function useCreateCourse() {
  const context = useContext(CreateCourseContext)

  if (context === undefined) {
    throw new Error(
      'useCreateCourse must be used within a CreateCourseProvider'
    )
  }

  return context
}
