import { Alert, AlertColor, Snackbar, SnackbarOrigin } from '@mui/material'
import React, { useState, SyntheticEvent, useMemo, useCallback } from 'react'

type SnackbarOptions = {
  message: string
  autoHideDuration?: number
  color?: AlertColor
  origin?: SnackbarOrigin
}

type SnackbarContextType = {
  showSnackbar: (options: SnackbarOptions) => void
}

export const SnackbarContext = React.createContext({} as SnackbarContextType)
export const useSnackbar = () => {
  const context = React.useContext(SnackbarContext)

  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }

  return context
}

const DEFAULT_OPTIONS: SnackbarOptions = {
  message: '',
  autoHideDuration: 3000,
  color: 'success',
  origin: {
    vertical: 'top',
    horizontal: 'center',
  } as SnackbarOrigin,
}

export const SnackbarProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<SnackbarOptions>(DEFAULT_OPTIONS)

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setIsOpen(false)
  }

  const showSnackbar = useCallback((options: SnackbarOptions) => {
    setIsOpen(true)
    setOptions({ ...DEFAULT_OPTIONS, ...options })
  }, [])

  const value = useMemo(() => {
    return {
      showSnackbar,
    }
  }, [showSnackbar])

  return (
    <SnackbarContext.Provider value={value}>
      <Snackbar
        open={isOpen}
        anchorOrigin={options.origin}
        autoHideDuration={options.autoHideDuration}
        onClose={handleClose}
      >
        <Alert variant="outlined" color={options.color}>
          {options.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  )
}
