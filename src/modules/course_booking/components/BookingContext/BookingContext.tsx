import { Alert, CircularProgress, Stack } from '@mui/material'
import { allPass } from 'lodash/fp'
import { round } from 'lodash-es'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Source_Enum,
  Course_Type_Enum,
  FindProfilesQuery,
  GetCoursePricingQuery,
  GetTempProfileQuery,
  PaymentMethod,
  Promo_Code,
  Promo_Code_Type_Enum,
  PromoCodeOutput,
  Currency,
  GetTempProfileQueryVariables,
  GetCoursePricingQueryVariables,
  CreateOrderOutput,
  CreateOrderMutation,
  CreateOrderMutationVariables,
  Course_Level_Enum,
  Course_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { stripeProcessingFeeRate } from '@app/lib/stripe'
import { CREATE_ORDER } from '@app/modules/course_booking/queries/create-order'
import { GET_COURSE_PRICING_QUERY } from '@app/modules/course_booking/queries/get-course-pricing'
import { GET_TEMP_PROFILE } from '@app/modules/course_booking/queries/get-temp-profile'
import { useResourcePackPricing } from '@app/modules/resource_packs/hooks/useResourcePackPricing'
import { InvoiceDetails, Profile } from '@app/types'
import {
  getMandatoryCourseMaterialsCost,
  getResourcePackPrice,
  max,
} from '@app/util'

import { sectors } from '../../utils'

import { getTrainerExpenses, setCoursePricing } from './'

export type Sector = keyof typeof sectors | ''

export type Discounts = Record<
  string,
  Pick<Promo_Code, 'amount' | 'type'> & {
    amountCurrency: number
    freePlacesResourcePacksAmountCurrency: number
  }
>

export type Address = {
  addressLine1: string
  addressLine2: string
  city: string
  postCode: string
  country: string
}

export type ParticipantInput = {
  firstName: string
  lastName: string
  email: string
} & Address

export type BookingContact = {
  email: string
  firstName: string
  lastName: string
  residingCountry: string | null
  residingCountryCode: string | null
}

type CourseDetails = GetTempProfileQuery['tempProfiles'][0]['course']

type State = {
  participants: ParticipantInput[]
  quantity: number
  price: number
  currency: Currency
  vat: number
  promoCodes: string[]
  discounts: Discounts
  source: Course_Source_Enum | ''
  bookingContact: BookingContact
  salesRepresentative: Profile | null | FindProfilesQuery['profiles'][0]
  orgId: string
  orgName: string
  sector: Sector
  paymentMethod: PaymentMethod
  freeSpaces: number
  trainerExpenses: number
  courseType: Course_Type_Enum
  invoiceDetails?: InvoiceDetails
  attendeeValidCertificate?: boolean
}

export type ContextType = {
  error: string | null
  orderId: string | null
  course: CourseDetails
  booking: State
  ready: boolean
  isBooked: boolean
  availableSeats: number
  amounts: {
    courseCost: number
    freeSpacesDiscount: number
    subtotal: number
    discount: number
    subtotalDiscounted: number
    vat: number
    total: number
    trainerExpenses: number
    paymentProcessingFee: number
  }
  sectors: typeof sectors
  setBooking: (_: Partial<State>) => void
  addPromo: (_: PromoCodeOutput) => void
  removePromo: (_: string) => void
  placeOrder: () => Promise<CreateOrderOutput | undefined>
  internalBooking: boolean
}

const initialContext = {}

// We anyway dont render anything until state is read, forcing type
// like this removes the need for unnecessary checks everywhere
const initialState = {
  promoCodes: [],
  discounts: {},
} as unknown as State

const Context = React.createContext<ContextType>(initialContext as ContextType)

export const getFreePlacesRPAmountCurrency = (
  promoCodeType: Promo_Code_Type_Enum,
  promoCodeAmount: number,
  isANZ: boolean,
  courseType: Course_Type_Enum,
  rpPrice: number | undefined | null,
) => {
  const validRpPrice = rpPrice ?? 0
  return promoCodeType === Promo_Code_Type_Enum.FreePlaces &&
    isANZ &&
    courseType === Course_Type_Enum.Open
    ? validRpPrice * promoCodeAmount
    : 0
}

export const BookingProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation()
  const {
    acl: { isAustralia },
  } = useAuth()
  const location = useLocation()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableSeats, setAvailableSeats] = useState(0)
  const [course, setCourse] = useState<CourseDetails>({} as CourseDetails) // safe
  const [booking, setBooking] = useState<State>(initialState)
  const [promoCodes, setPromoCodes] = useState<PromoCodeOutput[]>([])
  const { isUKCountry } = useWorldCountries()

  const isBooked = location.pathname.startsWith('/booking/payment/')
  const internalBooking = useRef(location.state?.internalBooking)

  const [{ data }] = useQuery<
    GetTempProfileQuery,
    GetTempProfileQueryVariables
  >({
    query: GET_TEMP_PROFILE,
  })
  const { acl } = useAuth()
  const hideMCM = useFeatureFlagEnabled('hide-mcm')

  const profile = useMemo(() => data?.tempProfiles[0], [data?.tempProfiles])

  const [{ data: coursePricing, error: coursePricingError }] = useQuery<
    GetCoursePricingQuery,
    GetCoursePricingQueryVariables
  >({
    query: GET_COURSE_PRICING_QUERY,
    variables: { courseId: profile?.course?.id ?? 0 },
    pause: !profile?.course?.id,
  })

  const { data: resourcePackPricing } = useResourcePackPricing({
    course_type: profile?.course?.type as Course_Type_Enum,
    course_level: profile?.course?.level as Course_Level_Enum,
    course_delivery_type: profile?.course
      ?.deliveryType as Course_Delivery_Type_Enum,
    reaccreditation: profile?.course?.reaccreditation ?? false,
    organisation_id: booking.orgId ?? '',
    pause: acl.isUK() || hideMCM,
  })

  const rpPrice = getResourcePackPrice(
    resourcePackPricing?.resource_packs_pricing[0],
    profile?.course?.priceCurrency as Currency,
  )

  const [, createOrder] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER)

  const isBILDcourse = profile?.course?.accreditedBy === Accreditors_Enum.Bild
  const courseHasPrice = Boolean(profile?.course?.price)
  const courseResidingCountry = profile?.course?.residingCountry

  useEffect(() => {
    if (data && (coursePricing || coursePricingError)) {
      if (!profile?.course) {
        setError(t('error-no-booking'))
        setReady(true)
        return
      }

      const pricing = setCoursePricing({
        setError,
        profile,
        isUKCountry,
        coursePricing,
      })

      const trainerExpenses = getTrainerExpenses({
        course: profile.course,
        isUKCountry,
      })

      setAvailableSeats(
        profile.course.maxParticipants -
          (profile?.course?.participants?.aggregate?.count ?? 0),
      )

      setCourse(profile.course)

      const isInternationalCourse = allPass([
        () => profile?.course?.type === Course_Type_Enum.Open,
        () => profile?.course?.accreditedBy === Accreditors_Enum.Icm,
        () => Boolean(profile?.course?.residingCountry),
        () => !isUKCountry(profile?.course?.residingCountry),
      ])()

      // doesnt reset if booking already contains data in it
      const getVat = () => {
        if (isInternationalCourse && !profile?.course?.includeVAT) {
          return 0
        }
        return isAustralia() ? 10 : 20
      }
      if (pricing && !booking.participants) {
        setBooking({
          quantity: profile.quantity ?? 0,
          participants: [],
          price: pricing.priceAmount,
          currency: pricing.priceCurrency,
          vat: getVat(),
          promoCodes: [],
          discounts: {},
          orgId: '',
          orgName: '',
          sector: '',
          paymentMethod: PaymentMethod.Invoice,
          freeSpaces: profile.course.freeSpaces ?? 0,
          trainerExpenses,
          courseType: profile.course.type,
          source: '',
          salesRepresentative: null,
          bookingContact: {
            email: '',
            firstName: '',
            lastName: '',
            residingCountry: '',
            residingCountryCode: '',
          },
          attendeeValidCertificate: false,
        })
      }
      setReady(true)
    }
  }, [
    booking.participants,
    coursePricing,
    coursePricingError,
    data,
    isUKCountry,
    profile,
    t,
    course?.residingCountry,
    courseHasPrice,
    courseResidingCountry,
    isBILDcourse,
    isAustralia,
  ])

  useEffect(() => {
    const discounts: Discounts = {}
    for (const code of booking.promoCodes) {
      const promoCode = promoCodes.find(pc => pc.code === code)
      if (!promoCode) {
        console.warn(`Promo code ${code} not found`)
        continue
      }

      const courseCost = booking.price * booking.quantity

      discounts[code] = {
        amount: promoCode.amount,
        type: promoCode.type as Promo_Code_Type_Enum,
        amountCurrency:
          promoCode.type === Promo_Code_Type_Enum.FreePlaces
            ? booking.price * promoCode.amount
            : (courseCost * promoCode.amount) / 100,
        // On ANZ, if promo code is FreePlaces and course type is open, we need to calculate the discount on resource pack price
        freePlacesResourcePacksAmountCurrency: getFreePlacesRPAmountCurrency(
          promoCode.type as Promo_Code_Type_Enum,
          promoCode.amount,
          isAustralia(),
          course?.type as Course_Type_Enum,
          rpPrice,
        ),
      }
    }

    setBooking(b => ({ ...b, discounts }))
  }, [
    booking.price,
    booking.quantity,
    booking.promoCodes,
    promoCodes,
    booking.currency,
    course?.type,
    acl,
    rpPrice,
    isAustralia,
  ])

  const addPromo = useCallback<ContextType['addPromo']>(
    (code: PromoCodeOutput) => {
      setPromoCodes(codes => [...codes, code])
      setBooking(b => ({ ...b, promoCodes: [...b.promoCodes, code.code] }))
    },
    [],
  )

  const removePromo = useCallback<ContextType['removePromo']>(
    (code: string) => {
      setBooking(b => ({
        ...b,
        promoCodes: b.promoCodes.filter(c => c !== code),
      }))
    },
    [],
  )

  const amounts: ContextType['amounts'] = useMemo(() => {
    const courseCost = !ready ? 0 : booking.price * booking.quantity
    const trainerExpenses = !ready ? 0 : booking.trainerExpenses
    const subtotal = courseCost + trainerExpenses
    let mandatoryCourseMaterialsCost = 0
    if (acl.isUK()) {
      mandatoryCourseMaterialsCost = getMandatoryCourseMaterialsCost(
        booking.quantity,
        booking.currency,
      )
    } else if (!hideMCM) {
      mandatoryCourseMaterialsCost = (rpPrice ?? 0) * booking.quantity
    }

    const freeSpacesDiscount = !ready ? 0 : booking.price * booking.freeSpaces
    const discount = !ready
      ? 0
      : booking.promoCodes.reduce((acc, c) => {
          const isCorrectSum = acc + booking.discounts[c]?.amountCurrency
          return !isNaN(isCorrectSum) ? isCorrectSum : 0
        }, 0)

    const resourcePacksDiscount = !ready
      ? 0
      : booking.promoCodes.reduce((acc, c) => {
          const isCorrectSum =
            acc + booking.discounts[c]?.freePlacesResourcePacksAmountCurrency
          return !isNaN(isCorrectSum) ? isCorrectSum : 0
        }, 0)

    const subtotalDiscounted = max(
      subtotal +
        mandatoryCourseMaterialsCost -
        Math.min(Number(discount), courseCost) - // If discount is higher than course cost, we should not go negative
        resourcePacksDiscount - // On ANZ it will be equal to rpPrice * promoCode.amount when promoCode is FreePlaces, course type is open otherwise 0
        freeSpacesDiscount,
      0,
    )
    const vat = Math.max(
      ((subtotalDiscounted - (acl.isUK() ? mandatoryCourseMaterialsCost : 0)) *
        booking.vat) /
        100,
      0,
    )
    const amountDue = subtotalDiscounted + vat

    const paymentProcessingFee =
      booking.paymentMethod === PaymentMethod.Cc
        ? round(
            stripeProcessingFeeRate.percent * subtotalDiscounted +
              stripeProcessingFeeRate.flat,
            2,
          )
        : 0

    const total = amountDue + paymentProcessingFee

    return {
      courseCost,
      subtotal,
      discount,
      freeSpacesDiscount,
      subtotalDiscounted,
      vat,
      total,
      trainerExpenses,
      paymentProcessingFee,
    }
  }, [
    acl,
    booking.currency,
    booking.discounts,
    booking.freeSpaces,
    booking.paymentMethod,
    booking.price,
    booking.promoCodes,
    booking.quantity,
    booking.trainerExpenses,
    booking.vat,
    hideMCM,
    ready,
    rpPrice,
  ])

  const placeOrder = useCallback(async () => {
    const promoCodes =
      booking.courseType !== Course_Type_Enum.Closed ? booking.promoCodes : []
    if (course?.id) {
      const { data: createOrderResponse } = await createOrder({
        input: {
          courseId: course.id,
          quantity: booking.quantity,
          paymentMethod: booking.paymentMethod,
          billingAddress: booking.invoiceDetails?.billingAddress ?? '',
          billingGivenName: booking.invoiceDetails?.firstName ?? '',
          billingFamilyName: booking.invoiceDetails?.surname ?? '',
          billingEmail: booking.invoiceDetails?.email ?? '',
          billingPhone: booking.invoiceDetails?.phone ?? '',
          clientPurchaseOrder: booking.invoiceDetails?.purchaseOrder ?? '',
          registrants: booking.participants,
          organizationId: booking.orgId,
          promoCodes,
          source: booking.source,
          salesRepresentativeId: booking.salesRepresentative?.id,
          bookingContact: booking.bookingContact,
        },
      })

      if (createOrderResponse?.order?.success) {
        setOrderId(createOrderResponse?.order?.id)
      }
      return createOrderResponse?.order as CreateOrderOutput
    }
  }, [
    booking.bookingContact,
    booking.courseType,
    booking.invoiceDetails?.billingAddress,
    booking.invoiceDetails?.email,
    booking.invoiceDetails?.firstName,
    booking.invoiceDetails?.phone,
    booking.invoiceDetails?.purchaseOrder,
    booking.invoiceDetails?.surname,
    booking.orgId,
    booking.participants,
    booking.paymentMethod,
    booking.promoCodes,
    booking.quantity,
    booking.salesRepresentative?.id,
    booking.source,
    course,
    createOrder,
  ])

  const value = useMemo<ContextType>(
    () => ({
      error,
      orderId,
      amounts,
      course,
      ready,
      booking,
      isBooked,
      availableSeats,
      sectors,
      setBooking: s => setBooking(prev => ({ ...prev, ...s })),
      addPromo,
      removePromo,
      placeOrder,
      internalBooking: internalBooking.current ?? false,
    }),
    [
      error,
      orderId,
      ready,
      booking,
      isBooked,
      course,
      addPromo,
      removePromo,
      amounts,
      availableSeats,
      placeOrder,
      internalBooking,
    ],
  )

  if (!ready) {
    return (
      <Stack alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    )
  }

  if (!isBooked && availableSeats < booking.quantity) {
    return (
      <Alert severity="error" variant="outlined">
        {t('pages.book-course.not-enough-spaces')}
      </Alert>
    )
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useBooking() {
  return useContext(Context)
}
