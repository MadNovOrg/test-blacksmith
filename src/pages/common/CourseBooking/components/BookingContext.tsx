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

import { positions, sectors } from './org-data'

export type Sector = keyof typeof sectors | ''

type CourseDetails = ResponseType['tempProfiles'][0]['course']

type State = {
  emails: string[]
  quantity: number
  price: number
  vat: number
  promoCodes: string[]
  orgId: string | null
  sector: Sector
  position: string
  otherPosition: string
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
  const [course, setCourse] = useState<CourseDetails>({} as CourseDetails) // safe
  const [booking, setBooking] = useState<State>(initialState)
  const { data } = useSWR<ResponseType>(QUERY)
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
      positions,
      sectors,
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
