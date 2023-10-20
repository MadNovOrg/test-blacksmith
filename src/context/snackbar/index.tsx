import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export type SnackbarMessageKey =
  | 'course-created'
  | 'course-canceled'
  | 'course-evaluated'
  | 'participant-transferred'
  | 'user-invited'
  | 'course-submitted'
  | 'discount-disabled'
  | 'waitlist-participant-removed'
  | 'waitlist-participant-remove-failed'
  | 'course-approval-message'
  | 'course-approval-error'
  | 'attendance-toggle-error'
  | 'bulk-attendance-error'
export type SnackbarMessage = { label: React.ReactNode }

export type SnackbarState = {
  messages: Map<SnackbarMessageKey, SnackbarMessage>
  addSnackbarMessage: (key: SnackbarMessageKey, label: SnackbarMessage) => void
  removeSnackbarMessage: (key: SnackbarMessageKey) => void
  getSnackbarMessage: (key: SnackbarMessageKey) => SnackbarMessage | undefined
}

const SnackbarContext = React.createContext<SnackbarState | undefined>(
  undefined
)

export const SnackbarProvider: React.FC<
  React.PropsWithChildren<{
    initialMessages?: SnackbarState['messages']
  }>
> = ({ children, initialMessages }) => {
  const [messages, setMessages] = useState<SnackbarState['messages']>(
    initialMessages ?? new Map()
  )

  const messagesRef = useRef(messages)

  const addSnackbarMessage: SnackbarState['addSnackbarMessage'] = useCallback(
    (key, options) => {
      setMessages(messages => new Map(messages.set(key, options)))
    },
    []
  )

  const getSnackbarMessage: SnackbarState['getSnackbarMessage'] = useCallback(
    key => {
      return messages.get(key)
    },
    [messages]
  )

  const removeSnackbarMessage: SnackbarState['removeSnackbarMessage'] =
    useCallback(key => {
      messagesRef.current.delete(key)

      setMessages(messagesRef.current)
    }, [])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const value = useMemo(
    () => ({
      messages,
      addSnackbarMessage,
      removeSnackbarMessage,
      getSnackbarMessage,
    }),
    [messages, addSnackbarMessage, removeSnackbarMessage, getSnackbarMessage]
  )

  return (
    <SnackbarContext.Provider value={value}>
      {children}
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => {
  const context = useContext(SnackbarContext)

  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }

  return context
}
