import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { FullHeightPage } from '@app/components/FullHeightPage'

type Props = {
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

export const Wrapper: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onSubmit,
}) => {
  const { t } = useTranslation()
  return (
    <FullHeightPage bgcolor="grey.100">
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box display="flex" gap={4}>
          <Box width={300}>
            <Typography variant="h2" mb={2}>
              {t(`pages.promoCodes.new-title`)}
            </Typography>
            <Typography variant="body2">{t('validation-notice')}</Typography>
          </Box>

          <Box
            component="form"
            flex={1}
            noValidate
            autoComplete="off"
            onSubmit={onSubmit}
          >
            {children}
          </Box>
        </Box>
      </Container>
    </FullHeightPage>
  )
}
