import { yupResolver } from '@hookform/resolvers/yup'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LoadingButton from '@mui/lab/LoadingButton'
import { useMediaQuery, useTheme } from '@mui/material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'urql'

import { formSchema, InvoiceForm } from '@app/components/InvoiceForm'
import {
  OrgLicensesWithHistoryQuery,
  OrgLicensesWithHistoryQueryVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import orgLicensesWithHistory from '@app/queries/go1-licensing/org-licenses-with-history'
import { yup } from '@app/schemas'
import { InvoiceDetails } from '@app/types'

import { StepsEnum } from '../../types'
import { calculateGo1LicenseCost } from '../../utils'
import { useCreateCourse } from '../CreateCourseProvider'

import { OrderDetails } from './components/OrderDetails'

type Inputs = {
  invoiceDetails: InvoiceDetails
}

export const LicenseOrderDetails = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const {
    setCurrentStepKey,
    courseData,
    go1Licensing,
    setGo1Licensing,
    completeStep,
    setShowDraftConfirmationDialog,
  } = useCreateCourse()
  const { t, _t } = useScopedTranslation(
    'pages.create-course.license-order-details'
  )

  const schema = useMemo(
    () =>
      yup.object({
        invoiceDetails: formSchema(_t),
      }),
    [_t]
  )

  useEffect(() => {
    setCurrentStepKey(StepsEnum.LICENSE_ORDER_DETAILS)
  }, [setCurrentStepKey])

  const [{ data: orgData, fetching }] = useQuery<
    OrgLicensesWithHistoryQuery,
    OrgLicensesWithHistoryQueryVariables
  >({
    query: orgLicensesWithHistory,
    variables: { id: courseData?.organization.id, withHistory: false },
    requestPolicy: 'cache-and-network',
  })

  const methods = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      invoiceDetails: go1Licensing?.invoiceDetails,
    },
  })

  const prices = calculateGo1LicenseCost(
    courseData?.maxParticipants ?? 0,
    orgData?.organization_by_pk?.go1Licenses ?? 0
  )

  const onSubmit: SubmitHandler<Inputs> = data => {
    setGo1Licensing({ prices, invoiceDetails: data.invoiceDetails })
    completeStep(StepsEnum.LICENSE_ORDER_DETAILS)

    navigate('../review-license-order')
  }

  const handleDraftClick = () => {
    const values = methods.getValues()

    setGo1Licensing({ prices, invoiceDetails: values.invoiceDetails })
    setShowDraftConfirmationDialog(true)
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

  if (fetching) {
    return (
      <Stack direction="row" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    )
  }

  if (!orgData?.organization_by_pk && !fetching) {
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

      <OrderDetails
        {...prices}
        numberOfLicenses={courseData.maxParticipants}
        licensesBalance={orgData?.organization_by_pk?.go1Licenses ?? 0}
      />

      <Typography variant="h4" mb={2} mt={4}>
        {t('invoice-title')}
      </Typography>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box p={3} bgcolor="white">
            <Typography variant="h5" mb={2}>
              {t('invoice-contact')}
            </Typography>
            <InvoiceForm />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection={isMobile ? 'column' : 'row'}
            alignContent={isMobile ? 'left' : 'center'}
            sx={{ mt: 4, mb: 4 }}
          >
            <Box>
              <Button
                onClick={() => navigate(`../../new?type=${courseData.type}`)}
                startIcon={<ArrowBackIcon />}
              >
                {_t('pages.create-course.assign-trainers.back-btn')}
              </Button>
            </Box>
            <Box
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              sx={{ mt: isMobile ? 2 : 0 }}
            >
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
