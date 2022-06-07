import { CircularProgress, Stack } from '@mui/material'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMount } from 'react-use'

import { useFetcher } from '@app/hooks/use-fetcher'
import { GetCoursePricing } from '@app/queries/courses/get-course-pricing'
import {
  QUERY as GET_ORDER,
  ResponseType as GetOrderResp,
} from '@app/queries/order/get-order'
import {
  MUTATION as INSERT_ORDER,
  ResponseType as InsertOrderResponseType,
  ParamsType as InsertOrderParamsType,
} from '@app/queries/order/insert-order'
import {
  QUERY as GET_TEMP_PROFILE,
  ResponseType as GetTempProfileResponseType,
} from '@app/queries/profile/get-temp-profile'
import { Currency, Order, PaymentMethod } from '@app/types'

import { positions, sectors } from './org-data'

export type Sector = keyof typeof sectors | ''

type CourseDetails = GetTempProfileResponseType['tempProfiles'][0]['course']

export type InvoiceDetails = {
  orgId: string | null
  billingAddress: string
  firstName: string
  surname: string
  email: string
  phone: string
  purchaseOrder: string
}

type State = {
  emails: string[]
  quantity: number
  price: number
  currency: Currency
  vat: number
  promoCodes: string[]
  orgId: string
  sector: Sector
  position: string
  otherPosition: string
  paymentMethod: PaymentMethod

  invoiceDetails?: InvoiceDetails
}

type ContextType = {
  error: string | null
  orderId: string | null
  course: CourseDetails
  booking: State
  ready: boolean
  availableSeats: number
  amounts: {
    subtotal: number
    discount: number
    subtotalDiscounted: number
    vat: number
    total: number
  }
  positions: typeof positions
  sectors: typeof sectors
  setBooking: (_: Partial<State>) => void
  addPromo: (_: string) => void
  removePromo: (_: string) => void
  placeOrder: () => Promise<Pick<Order, 'id'>>
}

const initialContext = {}

// We anyway dont render anything until state is read, forcing type
// like this removes the need for unnecessary checks everywhere
const initialState = {
  promoCodes: [],
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
      orgId: '',
      sector: '',
      position: '',
      otherPosition: '',
      paymentMethod: PaymentMethod.INVOICE,
    })

    setReady(true)
  })

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
    const subtotal = !ready ? 0 : booking.price * booking.quantity
    const discount = !ready ? 0 : booking.promoCodes.reduce(acc => acc + 2, 0)
    const subtotalDiscounted = subtotal - discount
    const vat = subtotalDiscounted * (booking.vat / 100)
    const total = subtotalDiscounted + vat
    return { subtotal, discount, subtotalDiscounted, vat, total }
  }, [booking, ready])

  const waitForOrderEnriched = useCallback(
    async (orderId: string, tries = 0, maxTries = 5): Promise<void> => {
      const { order } = await fetcher<GetOrderResp>(GET_ORDER, { orderId })
      if (tries === maxTries) return

      if (!order.orderTotal) {
        await new Promise(res => setTimeout(res, 500))
        return waitForOrderEnriched(orderId, tries + 1)
      }
    },
    [fetcher]
  )

  const placeOrder = useCallback(async () => {
    const response = await fetcher<
      InsertOrderResponseType,
      InsertOrderParamsType
    >(INSERT_ORDER, {
      input: {
        courseId: course.id,
        quantity: booking.quantity,
        paymentMethod: booking.paymentMethod,
        billingAddress: booking.invoiceDetails?.billingAddress ?? '',
        billingGivenName: booking.invoiceDetails?.firstName ?? '',
        billingFamilyName: booking.invoiceDetails?.surname ?? '',
        billingEmail: booking.invoiceDetails?.email ?? '',
        billingPhone: booking.invoiceDetails?.phone ?? '',
        registrants: booking.emails,
        organizationId: booking.orgId,
        promoCodes: booking.promoCodes,
      },
    })

    await waitForOrderEnriched(response.order.id)

    setOrderId(response.order.id)
    return response.order
  }, [booking, fetcher, course, waitForOrderEnriched])

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
