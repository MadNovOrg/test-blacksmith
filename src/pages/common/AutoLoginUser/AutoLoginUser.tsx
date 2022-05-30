import { CircularProgress } from '@mui/material'
import { Auth } from 'aws-amplify'
import React from 'react'
import { useMount } from 'react-use'

import { useAuth } from '@app/context/auth'

export const AutoLoginUser = () => {
  const { loadProfile } = useAuth()

  useMount(async () => {
    const currentUser = await Auth.currentUserPoolUser()
    await loadProfile(currentUser)
  })

  return <CircularProgress size={50} />
}
