import React, { useRef, useState } from 'react'
import { Box } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { CourseForm, FormValues } from '@app/components/CourseForm'

export const CreateCourseForm = () => {
  const courseDataRef = useRef<FormValues>()
  const [courseDataValid, setCourseDataValid] = useState(false)

  return (
    <Box paddingBottom={5}>
      <CourseForm
        onChange={(data, isValid) => {
          console.log(data, isValid)
          courseDataRef.current = data
          setCourseDataValid(isValid)
        }}
      />

      <Box display="flex" justifyContent="flex-end">
        <LoadingButton
          variant="contained"
          disabled={!courseDataValid}
          sx={{ marginTop: 4 }}
          onClick={() => alert(JSON.stringify(courseDataRef.current, null, 2))}
        >
          Select trainer(s)
        </LoadingButton>
      </Box>
    </Box>
  )
}
