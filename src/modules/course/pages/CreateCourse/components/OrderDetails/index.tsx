import { yupResolver } from '@hookform/resolvers/yup'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { useEffect, useMemo } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import {
  InvoiceForm,
  formSchema,
} from '@app/modules/course/components/CourseForm/InvoiceForm'
import { yup } from '@app/schemas'
import { InvoiceDetails } from '@app/types'

import { StepsEnum } from '../../types'
import { useCreateCourse } from '../CreateCourseProvider'
import { OrderDetailsReview } from '../OrderDetailsReview'

type Inputs = {
  invoiceDetails: InvoiceDetails
}

export const OrderDetails: React.FC = () => {
  const { t, _t } = useScopedTranslation('pages.create-course.order-details')
  const navigate = useNavigate()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const schema = useMemo(
    () =>
      yup.object({
        invoiceDetails: formSchema(_t),
      }),
    [_t],
  )

  const {
    setCurrentStepKey,
    courseData,
    setInvoiceDetails,
    completeStep,
    invoiceDetails,
  } = useCreateCourse()

  useEffect(() => {
    setCurrentStepKey(StepsEnum.ORDER_DETAILS)
  }, [setCurrentStepKey])

  const methods = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: { invoiceDetails },
  })

  const onSubmit: SubmitHandler<Inputs> = data => {
    setInvoiceDetails(data.invoiceDetails)
    completeStep(StepsEnum.ORDER_DETAILS)
    navigate('../review-and-confirm')
  }

  if (!courseData) {
    return (
      <Alert
        severity="error"
        variant="outlined"
        data-testid="license-order-details-not-found"
      >
        {_t('pages.create-course.course-not-found')}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {t('title')}
      </Typography>

      <OrderDetailsReview />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box p={3} mt={3} bgcolor="white">
            <Typography variant="h5" mb={2}>
              {t('invoice-contact')}
            </Typography>
            <InvoiceForm />
          </Box>

          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            sx={{ mt: 4, mb: 4 }}
          >
            <Box mb={2}>
              <Button
                onClick={() => navigate(`../trainer-expenses`)}
                startIcon={<ArrowBackIcon />}
              >
                {_t('pages.create-course.order-details.back-btn')}
              </Button>
            </Box>
            <Box mb={2}>
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!methods.formState.isValid}
                endIcon={<ArrowForwardIcon />}
                fullWidth={isMobile}
                data-testid="AssignTrainers-submit"
              >
                {_t('pages.create-course.step-navigation-review-and-confirm')}
              </LoadingButton>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  )
}
