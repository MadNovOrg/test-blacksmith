import { yupResolver } from '@hookform/resolvers/yup'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { InvoiceForm, formSchema } from '@app/components/InvoiceForm'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
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

  const schema = useMemo(
    () =>
      yup.object({
        invoiceDetails: formSchema(_t),
      }),
    [_t]
  )

  const {
    setCurrentStepKey,
    courseData,
    setInvoiceDetails,
    completeStep,
    invoiceDetails,
    saveDraft,
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

  const handleDraftClick = () => {
    const values = methods.getValues()

    setInvoiceDetails(values.invoiceDetails)
    saveDraft()
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
            justifyContent="space-between"
            sx={{ mt: 4, mb: 4 }}
          >
            <Button
              onClick={() => navigate(`../trainer-expenses`)}
              startIcon={<ArrowBackIcon />}
            >
              {_t('pages.create-course.order-details.back-btn')}
            </Button>

            <Box>
              <Button
                variant="text"
                sx={{ marginRight: 4 }}
                onClick={handleDraftClick}
              >
                {_t('pages.create-course.save-as-draft')}
              </Button>

              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!methods.formState.isValid}
                endIcon={<ArrowForwardIcon />}
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
