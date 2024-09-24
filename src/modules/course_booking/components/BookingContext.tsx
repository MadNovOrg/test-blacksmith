import { Alert, CircularProgress, Stack } from '@mui/material'
import { allPass } from 'lodash/fp'
import { round } from 'lodash-es'
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
} from '@app/generated/graphql'
import { stripeProcessingFeeRate } from '@app/lib/stripe'
import { CREATE_ORDER } from '@app/modules/course_booking/queries/create-order'
import { GET_COURSE_PRICING_QUERY } from '@app/modules/course_booking/queries/get-course-pricing'
import { GET_TEMP_PROFILE } from '@app/modules/course_booking/queries/get-temp-profile'
import {
  CourseExpenseType,
  InvoiceDetails,
  Profile,
  TransportMethod,
} from '@app/types'
import {
  getMandatoryCourseMaterialsCost,
  getTrainerCarCostPerMile,
  getTrainerSubsistenceCost,
  max,
} from '@app/util'

import { positions, sectors } from '../utils'

export type Sector = keyof typeof sectors | ''

export type Discounts = Record<
  string,
  Pick<Promo_Code, 'amount' | 'type'> & { amountCurrency: number }
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
  firstName: string
  lastName: string
  email: string
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
  position: string
  otherPosition: string
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
  positions: typeof positions
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

type Props = unknown

export const BookingProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  const { t } = useTranslation()
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

  const profile = useMemo(() => data?.tempProfiles[0], [data?.tempProfiles])

  const [{ data: coursePricing, error: coursePricingError }] = useQuery<
    GetCoursePricingQuery,
    GetCoursePricingQueryVariables
  >({
    query: GET_COURSE_PRICING_QUERY,
    variables: { courseId: profile?.course?.id ?? 0 },
    pause: !profile?.course?.id,
  })

  const [, createOrder] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER)

  const isBILDcourse = profile?.course?.accreditedBy === Accreditors_Enum.Bild
  const courseHasPrice = Boolean(profile?.course?.price)
  const courseResidingCountry = profile?.course?.residingCountry

  useEffect(() => {
    if (
      typeof data !== 'undefined' &&
      (typeof coursePricing !== 'undefined' || coursePricingError)
    ) {
      if (!profile || !profile.course) {
        setError(t('error-no-booking'))
        setReady(true)
        return
      }

      let pricing: GetCoursePricingQuery['pricing']

      // course has custom pricing (e.g BILD)
      if (
        courseHasPrice &&
        (!isUKCountry(courseResidingCountry) || isBILDcourse)
      ) {
        pricing = {
          priceAmount: profile.course.price,
          priceCurrency: (profile.course.priceCurrency as Currency) ?? 'GBP',
          xeroCode: '',
        }
      } else {
        const scheduledPrice = coursePricing
        if (scheduledPrice) {
          pricing = {
            priceAmount: Number(scheduledPrice?.pricing?.priceAmount),
            priceCurrency: scheduledPrice?.pricing?.priceCurrency as Currency,
            xeroCode: scheduledPrice?.pricing?.xeroCode ?? '',
          }
        } else {
          setError(t('error-no-pricing'))
        }
      }

      const trainerExpenses =
        profile.course.expenses?.reduce((acc, { data: e }) => {
          switch (e.type) {
            case CourseExpenseType.Accommodation:
              return (
                acc +
                getTrainerSubsistenceCost(
                  e.accommodationNights,
                  isUKCountry(course?.residingCountry),
                ) +
                e.accommodationCost * e.accommodationNights
              )

            case CourseExpenseType.Miscellaneous:
              return acc + e.cost

            case CourseExpenseType.Transport:
              if (e.method === TransportMethod.CAR) {
                return acc + getTrainerCarCostPerMile(e.mileage)
              }

              if (e.method === TransportMethod.NONE) {
                return acc
              }

              return acc + e.cost

            default:
              return acc
          }
        }, 0) ?? 0

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
      if (pricing && !booking.participants) {
        setBooking({
          quantity: profile.quantity ?? 0,
          participants: [],
          price: pricing.priceAmount,
          currency: pricing.priceCurrency,
          vat: isInternationalCourse && !profile?.course?.includeVAT ? 0 : 20,
          promoCodes: [],
          discounts: {},
          orgId: '',
          orgName: '',
          sector: '',
          position: '',
          otherPosition: '',
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
  ])

  useEffect(() => {
    const discounts: Discounts = {}
    for (const code of booking.promoCodes) {
      const promoCode = promoCodes.find(pc => pc.code === code)
      if (!promoCode) {
        console.warn(`Promo code ${code} not found`)
        continue
      }

      const mcmDiscount =
        course?.type === Course_Type_Enum.Open
          ? getMandatoryCourseMaterialsCost(1, booking.currency)
          : 0

      const courseCost = booking.price * booking.quantity

      discounts[code] = {
        amount: promoCode.amount,
        type: promoCode.type as Promo_Code_Type_Enum,
        amountCurrency:
          promoCode.type === Promo_Code_Type_Enum.FreePlaces
            ? booking.price * promoCode.amount + mcmDiscount
            : (courseCost * promoCode.amount) / 100 +
              mcmDiscount * booking.quantity,
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
    const mandatoryCourseMaterialsCost = getMandatoryCourseMaterialsCost(
      booking.quantity,
      booking.currency,
    )

    const freeSpacesDiscount = !ready ? 0 : booking.price * booking.freeSpaces
    const discount = !ready
      ? 0
      : booking.promoCodes.reduce((acc, c) => {
          const isCorrectSum = acc + booking.discounts[c]?.amountCurrency
          return !isNaN(isCorrectSum) ? isCorrectSum : 0
        }, 0)

    const subtotalDiscounted = max(
      subtotal +
        mandatoryCourseMaterialsCost -
        Number(discount) -
        freeSpacesDiscount,
      0,
    )
    const vat = Math.max(
      ((subtotalDiscounted - mandatoryCourseMaterialsCost) * booking.vat) / 100,
      0,
    )
    const amountDue = subtotalDiscounted + vat

    const paymentProcessingFee =
      booking.paymentMethod === PaymentMethod.Cc
        ? round(
            stripeProcessingFeeRate.percent * subtotalDiscounted +
              stripeProcessingFeeRate.flat,
            2,
          ) // Round cent precision
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
  }, [booking, ready])

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
      positions,
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
