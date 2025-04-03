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
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useEffect, useMemo } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'urql'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useAuth } from '@app/context/auth'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  OrgLicensesWithHistoryQuery,
  OrgLicensesWithHistoryQueryVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import {
  formSchema,
  InvoiceForm,
} from '@app/modules/course/components/CourseForm/components/InvoiceForm'
import { ResourcePacksOptions } from '@app/modules/course/components/CourseForm/components/ResourcePacksTypeSection/types'
import { COURSE_FORM_RESOURCE_PACKS_OPTION_TO_COURSE_FIELDS } from '@app/modules/course/components/CourseForm/components/ResourcePacksTypeSection/utils'
import {
  WorkbookDeliveryAddress,
  WorkbookDeliveryAddressForm,
  formSchema as workbookDeliveryAddressFormSchema,
} from '@app/modules/course/components/CourseForm/components/WorkbookDeliveryAddress'
import { useResourcePackPricing } from '@app/modules/resource_packs/hooks/useResourcePackPricing'
import orgLicensesWithHistory from '@app/queries/go1-licensing/org-licenses-with-history'
import { yup } from '@app/schemas'
import { InvoiceDetails } from '@app/types'
import { AustraliaCountryCode, getResourcePackPrice } from '@app/util'

import { StepsEnum } from '../../types'
import { calculateGo1LicenseCost, calculateResourcePackCost } from '../../utils'
import { useCreateCourse } from '../CreateCourseProvider'

import { OrderDetails } from './components/OrderDetails'
type Inputs = {
  invoiceDetails: InvoiceDetails
  workbookDeliveryAddress?: WorkbookDeliveryAddress
}
const getCssProps = (isMobile: boolean) => {
  return {
    flexDirection: isMobile ? ('column' as const) : ('row' as const),
    alignContent: isMobile ? 'left' : 'center',
    marginTop: isMobile ? 2 : 0,
  }
}

export const LicenseOrderDetails = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const cssProps = getCssProps(isMobile)
  const {
    acl: { isAustralia },
  } = useAuth()
  const { isAustraliaCountry, getLabel } = useWorldCountries()

  const indirectResourcePacksEnabled = useFeatureFlagEnabled(
    'indirect-course-resource-packs',
  )

  const {
    completeStep,
    courseData,
    invoiceDetails,
    workbookDeliveryAddress,
    setCurrentStepKey,
    setGo1Licensing,
    setInvoiceDetails,
    setWorkbookDeliveryAddress,
    setResourcePacksCost,
    setShowDraftConfirmationDialog,
  } = useCreateCourse()
  const { t, _t } = useScopedTranslation(
    'pages.create-course.license-order-details',
  )

  const showDeliveryAddress = useMemo(() => {
    return (
      isAustralia() &&
      indirectResourcePacksEnabled &&
      [
        ResourcePacksOptions.PrintWorkbookExpress,
        ResourcePacksOptions.PrintWorkbookStandard,
      ].includes(courseData?.resourcePacksType as ResourcePacksOptions)
    )
  }, [courseData?.resourcePacksType, indirectResourcePacksEnabled, isAustralia])

  const schema = useMemo(
    () =>
      yup.object({
        invoiceDetails: formSchema(_t),
        ...(showDeliveryAddress
          ? {
              workbookDeliveryAddress: workbookDeliveryAddressFormSchema(_t),
            }
          : {}),
      }),
    [_t, showDeliveryAddress],
  )

  useEffect(() => {
    setCurrentStepKey(StepsEnum.LICENSE_ORDER_DETAILS)
  }, [setCurrentStepKey])

  const [{ data: orgData, fetching }] = useQuery<
    OrgLicensesWithHistoryQuery,
    OrgLicensesWithHistoryQueryVariables
  >({
    query: orgLicensesWithHistory,
    variables: {
      id: courseData?.organization.id,
      withHistory: false,
      withMainOrg: true,
    },
    requestPolicy: 'cache-and-network',
  })

  const methods = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      invoiceDetails,
      workbookDeliveryAddress: {
        ...workbookDeliveryAddress,
        countryCode:
          workbookDeliveryAddress?.countryCode ?? AustraliaCountryCode,
        country:
          workbookDeliveryAddress?.country ?? getLabel(AustraliaCountryCode),
      },
    },
  })

  const { data: resourcePackCost } = useResourcePackPricing({
    course_type: courseData?.type as Course_Type_Enum,
    course_level: courseData?.courseLevel as Course_Level_Enum,
    course_delivery_type: courseData?.deliveryType as Course_Delivery_Type_Enum,
    reaccreditation: Boolean(courseData?.reaccreditation),
    resourcePacksOptions: courseData?.resourcePacksType,
    organisation_id: courseData?.organization?.id ?? '',
  })
  const rpPrice = getResourcePackPrice(
    resourcePackCost?.resource_packs_pricing[0],
    courseData?.priceCurrency,
  )
  const includeGST = isAustraliaCountry(courseData?.residingCountry)

  const go1LicensesCost = courseData?.blendedLearning
    ? calculateGo1LicenseCost({
        numberOfLicenses: courseData?.maxParticipants ?? 0,
        licenseBalance:
          orgData?.organization_by_pk?.main_organisation?.go1Licenses ??
          orgData?.organization_by_pk?.go1Licenses ??
          0,
        isAustralia: isAustralia(),
        residingCountry: courseData?.residingCountry ?? '',
        isAustraliaCountry: includeGST,
      })
    : undefined

  const resourcePacksCost = calculateResourcePackCost({
    numberOfResourcePacks: courseData?.maxParticipants ?? 0,
    residingCountry: courseData?.residingCountry,
    resourcePacksBalance:
      orgData?.organization_by_pk?.resourcePacks?.find(rp => {
        if (!courseData?.resourcePacksType) return false

        return (
          rp.resourcePacksType ===
          COURSE_FORM_RESOURCE_PACKS_OPTION_TO_COURSE_FIELDS[
            courseData.resourcePacksType
          ].resourcePacksType
        )
      })?.totalResourcePacks ?? 0,
    resourcePacksPrice: rpPrice,
  })

  const onSubmit: SubmitHandler<Inputs> = data => {
    setInvoiceDetails(data.invoiceDetails)
    if (showDeliveryAddress && data.workbookDeliveryAddress) {
      setWorkbookDeliveryAddress(data.workbookDeliveryAddress)
    }

    if (go1LicensesCost) {
      setGo1Licensing({
        prices: go1LicensesCost,
        invoiceDetails: data.invoiceDetails,
      })
    }

    if (resourcePacksCost) {
      setResourcePacksCost(resourcePacksCost)
    }

    completeStep(StepsEnum.LICENSE_ORDER_DETAILS)

    navigate('../review-license-order')
  }

  const handleDraftClick = () => {
    const values = methods.getValues()

    setInvoiceDetails(values.invoiceDetails)
    if (showDeliveryAddress && values.workbookDeliveryAddress) {
      setWorkbookDeliveryAddress(values.workbookDeliveryAddress)
    }

    if (go1LicensesCost) {
      setGo1Licensing({
        prices: go1LicensesCost,
        invoiceDetails: values.invoiceDetails,
      })
    }

    if (resourcePacksCost) {
      setResourcePacksCost(resourcePacksCost)
    }

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
        courseData={courseData}
        go1LicensesCost={go1LicensesCost}
        numberOfLicenses={courseData.maxParticipants}
        numberOfResourcePacks={
          courseData.resourcePacksType ? courseData.maxParticipants : undefined
        }
        residingCountry={courseData.residingCountry}
        resourcePacksCost={resourcePacksCost}
      />

      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          {showDeliveryAddress ? (
            <Box>
              <Typography variant="h4" mb={2} mt={4}>
                {t('workbook-address.title')}
              </Typography>
              <Box p={3} mt={3} bgcolor="white">
                <WorkbookDeliveryAddressForm />
              </Box>
            </Box>
          ) : null}

          <Typography variant="h4" mb={2} mt={4}>
            {t('invoice-title')}
          </Typography>
          <Box p={3} bgcolor="white">
            <Typography variant="h5" mb={2}>
              {t('invoice-contact')}
            </Typography>
            <InvoiceForm />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection={cssProps.flexDirection}
            alignContent={cssProps.alignContent}
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
              flexDirection={cssProps.flexDirection}
              sx={{ mt: cssProps.marginTop }}
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
        </FormProvider>
      </form>
    </Box>
  )
}
