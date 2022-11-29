import { CircularProgress, Stack } from '@mui/material'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMount } from 'react-use'

import { PaymentMethod, Promo_Code } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { stripeProcessingFeeRate } from '@app/lib/stripe'
import { GetCoursePricing } from '@app/queries/courses/get-course-pricing'
import {
  MUTATION as CREATE_ORDER,
  ParamsType as CreateOrderParamsType,
  ResponseType as CreateOrderResponseType,
} from '@app/queries/order/create-order'
import {
  QUERY as GET_TEMP_PROFILE,
  ResponseType as GetTempProfileResponseType,
} from '@app/queries/profile/get-temp-profile'
import {
  CourseExpenseType,
  CourseType,
  Currency,
  InvoiceDetails,
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

type CourseDetails = GetTempProfileResponseType['tempProfiles'][0]['course']

type State = {
  emails: string[]
  quantity: number
  price: number
  currency: Currency
  vat: number
  promoCodes: string[]
  discounts: Discounts
  orgId: string
  sector: Sector
  position: string
  otherPosition: string
  paymentMethod: PaymentMethod
  freeSpaces: number
  trainerExpenses: number
  courseType: CourseType

  invoiceDetails?: InvoiceDetails
}

export type ContextType = {
  error: string | null
  orderId: string | null
  course: CourseDetails
  booking: State
  ready: boolean
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
  addPromo: (_: string) => void
  removePromo: (_: string) => void
  placeOrder: () => Promise<CreateOrderResponseType['order']>
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

export const BookingProvider: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [availableSeats, setAvailableSeats] = useState(0)
  const [course, setCourse] = useState<CourseDetails>({} as CourseDetails) // safe
  const [booking, setBooking] = useState<State>(initialState)

  useMount(async () => {
    const data = await fetcher<GetTempProfileResponseType>(GET_TEMP_PROFILE)
    const [profile] = data?.tempProfiles || []

    if (!profile || !profile.course) {
      setError(t('error-no-booking'))
      setReady(true)
      return
    }

    const { pricing } = await GetCoursePricing(fetcher, profile.course.id)
    if (!pricing) {
      setError(t('error-no-pricing'))
      setReady(true)
      return
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
        profile.course.participants.aggregate.count
    )
    setCourse(profile.course)
    setBooking({
      quantity: profile.quantity,
      emails: [],
      price: pricing.priceAmount,
      currency: pricing.priceCurrency,
      vat: 20,
      promoCodes: [],
      discounts: {},
      orgId: '',
      sector: '',
      position: '',
      otherPosition: '',
      paymentMethod: PaymentMethod.Invoice,
      freeSpaces: profile.course.freeSpaces ?? 0,
      trainerExpenses,
      courseType: profile.course.type,
    })

    setReady(true)
  })

  /* Disabled because of TTHP-817.
   * This needs to be rewritten so that the whole promo code validation
   * happens on backend. More info in the ticket.
  const { promoCodes, isLoading: arePromoCodesLoading } = usePromoCodes({
    sort: { by: 'code', dir: 'asc' },
    filters: { code: booking.promoCodes },
    limit: booking.promoCodes.length,
    offset: 0,
  })

  useEffect(() => {
    if (arePromoCodesLoading) {
      return
    }

    const discounts: Discounts = {}
    for (const code of booking.promoCodes) {
      const promoCode = promoCodes.find(pc => pc.code === code)
      if (!promoCode) {
        console.warn(`Promo code ${code} not found`)
        continue
      }

      discounts[code] = {
        amount: promoCode.amount,
        type: promoCode.type,
        amountCurrency:
          promoCode.type === Promo_Code_Type_Enum.FreePlaces
            ? booking.price * promoCode.amount
            : (booking.price * promoCode.amount) / 100,
      }
    }

    setBooking(b => ({ ...b, discounts }))
  }, [arePromoCodesLoading, booking.price, booking.promoCodes, promoCodes])
   */

  const addPromo = useCallback<ContextType['addPromo']>((code: string) => {
    setBooking(b =>
      b.promoCodes.includes(code)
        ? b
        : { ...b, promoCodes: [...b.promoCodes, code] }
    )
  }, [])

  const removePromo = useCallback<ContextType['addPromo']>((code: string) => {
    setBooking(b => ({
      ...b,
      promoCodes: b.promoCodes.filter(c => c !== code),
    }))
  }, [])

  const amounts: ContextType['amounts'] = useMemo(() => {
    const courseCost = !ready ? 0 : booking.price * booking.quantity
    const trainerExpenses = !ready ? 0 : booking.trainerExpenses
    const subtotal = courseCost + trainerExpenses

    const freeSpacesDiscount = !ready ? 0 : booking.price * booking.freeSpaces
    const discount = !ready
      ? 0
      : booking.promoCodes.reduce(
          (acc, c) => acc + booking.discounts[c]?.amountCurrency ?? 0,
          0
        )

    const subtotalDiscounted = max(subtotal - discount - freeSpacesDiscount, 0)
    const vat = (subtotalDiscounted * booking.vat) / 100
    const amountDue = subtotalDiscounted + vat

    const paymentProcessingFee =
      booking.paymentMethod === PaymentMethod.Cc
        ? stripeProcessingFeeRate.percent * amountDue +
          stripeProcessingFeeRate.flat
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
      booking.courseType !== CourseType.CLOSED ? booking.promoCodes : []

    const response = await fetcher<
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
        registrants: booking.emails,
        organizationId: booking.orgId,
        promoCodes,
      },
    })

    setOrderId(response.order?.id)
    return response.order
  }, [booking, fetcher, course])

  const value = useMemo<ContextType>(
    () => ({
      error,
      orderId,
      amounts,
      course,
      ready,
      booking,
      availableSeats,
      positions,
      sectors,
      setBooking: s => setBooking(prev => ({ ...prev, ...s })),
      addPromo,
      removePromo,
      placeOrder,
    }),
    [
      error,
      orderId,
      ready,
      booking,
      course,
      addPromo,
      removePromo,
      amounts,
      availableSeats,
      placeOrder,
    ]
  )

  if (!ready) {
    return (
      <Stack alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    )
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useBooking() {
  return useContext(Context)
}
