import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Alert, Stack } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import TrainerExpensesForm, {
  FormValues,
} from '@app/components/TrainerExpensesForm'

import { useCreateCourse } from '../CreateCourseProvider'

export const TrainerExpenses = () => {
  const { t } = useTranslation()
  const { completeStep, courseData, storeExpenses, storeTrainers, trainers } =
    useCreateCourse()
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState<FormValues>()
  const [expensesValid, setExpensesValid] = useState<boolean>()

  const handleSubmit = useCallback(async () => {
    completeStep('trainer-expenses')

    if (expenses) {
      storeExpenses(expenses)
    }

    if (trainers) {
      const trainersData = trainers.map(t => ({
        profile_id: t.profile_id,
        type: t.type,
      }))
      storeTrainers(trainersData)
    }

    navigate('../review-and-submit')
  }, [completeStep, expenses, navigate, storeExpenses])

  const onChange = useCallback(
    (data: FormValues, isValid: boolean) => {
      setExpenses(data)
      setExpensesValid(isValid)
    },
    [setExpenses, setExpensesValid]
  )

  if (!courseData) {
    return (
      <Alert
        severity="error"
        variant="filled"
        data-testid="TrainerExpenses-alert"
      >
        {t('pages.create-course.assign-trainers.course-not-found')}
      </Alert>
    )
  }

  return courseData ? (
    <Stack spacing={5}>
      <TrainerExpensesForm trainers={trainers} onChange={onChange} />

      <Box display="flex" justifyContent="space-between">
        <Button
          sx={{ marginTop: 4 }}
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
        >
          {t('pages.create-course.trainer-expenses.back-btn')}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!expensesValid}
          sx={{ marginTop: 4 }}
          endIcon={<ArrowForwardIcon />}
          data-testid="TrainerExpenses-submit"
          onClick={handleSubmit}
        >
          {t('pages.create-course.trainer-expenses.submit-btn')}
        </LoadingButton>
      </Box>
    </Stack>
  ) : null
}
