import React from 'react'

import { useCreateCourse } from '../CreateCourseProvider'

export const ReviewLicenseOrder: React.FC = () => {
  const { go1Licensing } = useCreateCourse()

  return <pre>{JSON.stringify(go1Licensing, null, 2)}</pre>
}
