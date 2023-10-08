import {
  Box,
  Stack,
  CircularProgress,
} from '@mui/material'
import { useEffect } from 'react'
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'

export const LogoutPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const callbackUrl = searchParams.get('callbackUrl')

  useEffect(() => {
    const logoutAndRedirect = async () => {
      await logout()
      if (callbackUrl) {
        navigate(callbackUrl)
      } else {
        navigate('/')
      }
    };

    logoutAndRedirect();
  }, [callbackUrl, navigate, logout]);

  return (
    <AppLayoutMinimal>
      <Box component="section" mt={4}>
        <Stack
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Stack>
      </Box>
    </AppLayoutMinimal>
  )
}
