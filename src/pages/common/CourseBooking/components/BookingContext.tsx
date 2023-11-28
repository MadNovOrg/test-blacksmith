import { Alert, CircularProgress, Stack } from '@mui/material'
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
import { useMount } from 'react-use'

import {
  Course_Source_Enum,
  Course_Type_Enum,
  GetTempProfileQuery,
  PaymentMethod,
  Promo_Code,
  Promo_Code_Type_Enum,
  PromoCodeOutput,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { stripeProcessingFeeRate } from '@app/lib/stripe'
import { GetCoursePricing } from '@app/queries/courses/get-course-pricing'
import {
  MUTATION as CREATE_ORDER,
  ParamsType as CreateOrderParamsType,
  ResponseType as CreateOrderResponseType,
} from '@app/queries/order/create-order'
import { QUERY as GET_TEMP_PROFILE } from '@app/queries/profile/get-temp-profile'
import {
  CourseExpenseType,
  Currency,
  InvoiceDetails,
  Profile,
  TransportMethod,
} from '@app/types'
import {
  getTrainerCarCostPerMile,
  getTrainerSubsistenceCost,
  max,
} from '@app/util'

import { positions, sectors } from './org-data'

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
  salesRepresentative: Profile | null
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
  placeOrder: () => Promise<CreateOrderResponseType['order']>
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
  const fetcher = useFetcher() // TODO: migrate to urql
  const [orderId, setOrderId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableSeats, setAvailableSeats] = useState(0)
  const [course, setCourse] = useState<CourseDetails>({} as CourseDetails) // safe
  const [booking, setBooking] = useState<State>(initialState)
  const [promoCodes, setPromoCodes] = useState<PromoCodeOutput[]>([])

  const isBooked = location.pathname.startsWith('/booking/payment/')
  const internalBooking = useRef(location.state?.internalBooking)

  useMount(async () => {
    const data = await fetcher<GetTempProfileQuery>(GET_TEMP_PROFILE) // TODO: refactor to use urql
    const [profile] = data?.tempProfiles || []

    if (!profile || !profile.course) {
      setError(t('error-no-booking'))
      setReady(true)
      return
    }

    let pricing: Awaited<ReturnType<typeof GetCoursePricing>>['pricing']

    // course has custom pricing (e.g BILD)
    if (profile.course.price && profile.course.priceCurrency) {
      pricing = {
        priceAmount: profile.course.price,
        priceCurrency: profile.course.priceCurrency as Currency,
        xeroCode: '',
      }
    } else {
      const pricingResponse = await GetCoursePricing(fetcher, profile.course.id)

      if (!pricingResponse) {
        setError(t('error-no-pricing'))
      } else {
        pricing = pricingResponse.pricing
      }
    }

    const trainerExpenses =
      profile.course.expenses?.reduce((acc, { data: e }) => {
        switch (e.type) {
          case CourseExpenseType.Accommodation:
            return (
              acc +
              getTrainerSubsistenceCost(e.accommodationNights) +
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
        (profile?.course?.participants?.aggregate?.count ?? 0)
    )
    setCourse(profile.course)

    if (pricing) {
      setBooking({
        quantity: profile.quantity ?? 0,
        participants: [],
        price: pricing.priceAmount,
        currency: pricing.priceCurrency,
        vat: 20,
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
      })
    }

    setReady(true)
  })

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
            ? courseCost * promoCode.amount
            : (courseCost * promoCode.amount) / 100,
      }
    }

    setBooking(b => ({ ...b, discounts }))
  }, [booking.price, booking.quantity, booking.promoCodes, promoCodes])

  const addPromo = useCallback<ContextType['addPromo']>(
    (code: PromoCodeOutput) => {
      setPromoCodes(codes => [...codes, code])
      setBooking(b => ({ ...b, promoCodes: [...b.promoCodes, code.code] }))
    },
    []
  )

  const removePromo = useCallback<ContextType['removePromo']>(
    (code: string) => {
      setBooking(b => ({
        ...b,
        promoCodes: b.promoCodes.filter(c => c !== code),
      }))
    },
    []
  )

  const amounts: ContextType['amounts'] = useMemo(() => {
    const courseCost = !ready ? 0 : booking.price * booking.quantity
    const trainerExpenses = !ready ? 0 : booking.trainerExpenses
    const subtotal = courseCost + trainerExpenses

    const freeSpacesDiscount = !ready ? 0 : booking.price * booking.freeSpaces
    const discount = !ready
      ? 0
      : booking.promoCodes.reduce((acc, c) => {
          const isCorrectSum = acc + booking.discounts[c]?.amountCurrency
          return !isNaN(isCorrectSum) ? isCorrectSum : 0
        }, 0)

    const subtotalDiscounted = max(
      subtotal - Number(discount) - freeSpacesDiscount,
      0
    )
    const vat = (subtotalDiscounted * booking.vat) / 100
    const amountDue = subtotalDiscounted + vat

    const paymentProcessingFee =
      booking.paymentMethod === PaymentMethod.Cc
        ? round(
            stripeProcessingFeeRate.percent * subtotalDiscounted +
              stripeProcessingFeeRate.flat,
            2
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
    if (course && course.id) {
      const response = await fetcher<
        // TODO: refactor to use urql
        CreateOrderResponseType,
        CreateOrderParamsType
      >(CREATE_ORDER, {
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

      setOrderId(response.order?.id)
      return response.order
    }
  }, [booking, fetcher, course])

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
    ]
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
