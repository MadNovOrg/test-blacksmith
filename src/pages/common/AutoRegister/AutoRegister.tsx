import { Typography, Box, useTheme, useMediaQuery } from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from 'urql'

import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { useAuth } from '@app/context/auth'
import {
  GetOrgByIdQuery,
  GetOrgByIdQueryVariables,
} from '@app/generated/graphql'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'
import { GET_ORG_BY_ID } from '@app/queries/organization/get-org-by-id'

import { Form } from './components/Form'

export const AutoRegisterPage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { profile } = useAuth()
  const { t } = useTranslation()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const continueUrl = searchParams.get('continue')
  const orgId = searchParams.get('orgId')

  const [{ data, error }] = useQuery<GetOrgByIdQuery, GetOrgByIdQueryVariables>(
    {
      query: GET_ORG_BY_ID,
      variables: { id: orgId },
      pause: !token || !orgId || orgId === '',
      context: useMemo(
        () => ({
          fetchOptions: {
            headers: { 'x-auth': `Bearer ${token}` },
          },
        }),
        [token]
      ),
    }
  )

  const organizationData = data?.organization[0]

  const handleSuccess = () => {
    navigate(`/auto-login?token=${token}&continue=${continueUrl}`, {
      replace: true,
    })
  }

  if (profile || !token || error) return <SuspenseLoading />

  return (
    <AppLayoutMinimal width={628}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography
          variant="h3"
          fontWeight="600"
          color="secondary"
          mb={1}
          align={isMobile ? 'center' : 'left'}
          data-testid="page-title"
        >
          {t('create-free-account')}
        </Typography>
      </Box>

      <Form
        onSuccess={handleSuccess}
        token={token}
        organizationData={organizationData}
        isNewUser={true}
      />
    </AppLayoutMinimal>
  )
}
