import { CircularProgress, Stack, Typography } from '@mui/material'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION,
  ResponseType as InsertOrderResponseType,
  ParamsType as InsertOrderParamsType,
} from '@app/queries/order/insert-order'
import { QUERY, ResponseType } from '@app/queries/profile/get-temp-profile'
import { Order, PaymentMethod } from '@app/types'

import { positions, sectors } from './org-data'

export type Sector = keyof typeof sectors | ''

type CourseDetails = ResponseType['tempProfiles'][0]['course']

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
  course: CourseDetails
  booking: State
  ready: boolean
  availableSeats: number
  totalPrice: number
  positions: typeof positions
  sectors: typeof sectors
  setBooking: (_: Partial<State>) => void
  addPromo: (_: string) => void
  removePromo: (_: string) => void
  placeOrder: () => Promise<Order | null>
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
  const [ready, setReady] = useState(false)
  const [availableSeats, setAvailableSeats] = useState(0)
  const [course, setCourse] = useState<CourseDetails>({} as CourseDetails) // safe
  const [booking, setBooking] = useState<State>(initialState)
  const { data, error } = useSWR<ResponseType>(QUERY)
  const loading = !data && !error
  const [profile] = data?.tempProfiles || []

  useEffect(() => {
    if (!profile) return

    setAvailableSeats(
      profile.course.maxParticipants -
        profile.course.participants.aggregate.count
    )
    setCourse(profile.course)
    setBooking({
      quantity: profile.quantity,
      emails: [],
      price: 100,
      vat: 20,
      promoCodes: [],
      orgId: '',
      sector: '',
      position: '',
      otherPosition: '',
      paymentMethod: PaymentMethod.INVOICE,
    })
    setReady(true)
  }, [profile, t])

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

  const totalPrice = useMemo(() => {
    if (!ready) return 0

    return (
      booking.price * booking.quantity +
      (booking.price * booking.quantity * booking.vat) / 100 -
      booking.promoCodes.reduce(acc => acc + 2, 0)
    )
  }, [ready, booking])

  const placeOrder = useCallback(async () => {
    // TODO: Fix for CC
    if (!booking.invoiceDetails) return null

    const response = await fetcher<
      InsertOrderResponseType,
      InsertOrderParamsType
    >(MUTATION, {
      input: {
        courseId: course.id,
        quantity: booking.quantity,
        paymentMethod: booking.paymentMethod,
        billingAddress: booking.invoiceDetails.billingAddress,
        billingGivenName: booking.invoiceDetails.firstName,
        billingFamilyName: booking.invoiceDetails.surname,
        billingEmail: booking.invoiceDetails.email,
        billingPhone: booking.invoiceDetails.phone,
        registrants: booking.emails,
        organizationId: booking.orgId,
      },
    })

    return response.order
  }, [booking, fetcher, course])

  const value = useMemo<ContextType>(
    () => ({
      totalPrice,
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
      ready,
      booking,
      course,
      addPromo,
      removePromo,
      totalPrice,
      availableSeats,
      placeOrder,
    ]
  )

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    )
  }

  if (error || !ready) {
    return <Typography>{t('no-booking')}</Typography>
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useBooking() {
  return useContext(Context)
}
