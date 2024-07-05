import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import TrainerExpensesForm, {
  FormValues,
} from '@app/components/TrainerExpensesForm'

import { StepsEnum } from '../../types'
import { useCreateCourse } from '../CreateCourseProvider'

export const TrainerExpenses = () => {
  const { t } = useTranslation()
  const {
    completeStep,
    courseData,
    expenses,
    setCurrentStepKey,
    setExpenses,
    trainers,
  } = useCreateCourse()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const navigate = useNavigate()
  const [expensesValid, setExpensesValid] = useState<boolean>()

  useEffect(() => {
    setCurrentStepKey(StepsEnum.TRAINER_EXPENSES)
  }, [setCurrentStepKey])

  const handleSubmit = useCallback(() => {
    completeStep(StepsEnum.TRAINER_EXPENSES)
    navigate('../order-details')
  }, [completeStep, navigate])

  const onChange = useCallback(
    (data: FormValues['expenses'], isValid: boolean) => {
      setExpenses(data)
      setExpensesValid(isValid)
    },
    [setExpenses],
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
      <TrainerExpensesForm
        initialValues={expenses}
        trainers={trainers}
        onChange={onChange}
      />

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        paddingBottom={5}
        justifyContent="space-between"
        sx={{ marginTop: 4 }}
      >
        <Box mb={2}>
          <Button
            onClick={() => navigate('../assign-trainers')}
            startIcon={<ArrowBackIcon />}
          >
            {t('pages.create-course.trainer-expenses.back-btn')}
          </Button>
        </Box>
        <Box mb={2}>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={!expensesValid}
            endIcon={<ArrowForwardIcon />}
            fullWidth={isMobile}
            data-testid="TrainerExpenses-submit"
            onClick={handleSubmit}
          >
            {t('pages.create-course.trainer-expenses.submit-btn')}
          </LoadingButton>
        </Box>
      </Box>
    </Stack>
  ) : null
}
