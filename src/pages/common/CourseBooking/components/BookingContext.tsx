import { CircularProgress, Stack } from '@mui/material'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import useSWR from 'swr'

import { QUERY, ResponseType } from '@app/queries/profile/get-temp-profile'
import { Course } from '@app/types'

type State = {
  emails: string[]
  quantity: number
  price: number
  vat: number
  promoCodes: string[]
}

type ContextType = {
  course: Course
  booking: State
  ready: boolean
  availableSeats: number
  totalPrice: number
  setBooking: (_: Partial<State>) => void
  addPromo: (_: string) => void
  removePromo: (_: string) => void
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
  const [ready, setReady] = useState(false)
  const [availableSeats, setAvailableSeats] = useState(0)
  const [course, setCourse] = useState<Course>({} as Course) // safe
  const [booking, setBooking] = useState<State>(initialState)
  const { data } = useSWR<ResponseType>(QUERY)
  const [profile] = data?.tempProfiles || []

  useEffect(() => {
    if (!profile) return

    setAvailableSeats(5)
    setCourse(profile.course)
    setBooking({
      quantity: profile.quantity,
      emails: [],
      price: 100,
      vat: 20,
      promoCodes: [],
    })
    setReady(true)
  }, [profile])

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
      booking.price +
      (booking.price * booking.vat) / 100 -
      booking.promoCodes.reduce(acc => acc + 2, 0)
    )
  }, [ready, booking])

  const value = useMemo<ContextType>(
    () => ({
      totalPrice,
      course,
      ready,
      booking,
      availableSeats,
      setBooking: s => setBooking(prev => ({ ...prev, ...s })),
      addPromo,
      removePromo,
    }),
    [ready, booking, course, addPromo, removePromo, totalPrice, availableSeats]
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
