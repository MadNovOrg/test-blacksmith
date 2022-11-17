import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Container, TextField, Typography, Stack } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BackButton } from '@app/components/BackButton'
import { FullHeightPage } from '@app/components/FullHeightPage'
import theme from '@app/theme'

import { ExternalResourceCard } from './components/ExternalResourceCard'

export const ResourceDetails = () => {
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState('')

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]} pb={3}>
      <Container maxWidth="lg" sx={{ py: 5 }} disableGutters>
        <Box display="flex">
          <Box width={300}>
            <BackButton
              label={t('pages.resources.resource-details.back-to-resources')}
              to="/resources"
            />
            <Typography variant="h1" sx={{ mb: 1, mt: 2 }}>
              Legislation, research & guidance
            </Typography>
            <Typography lineHeight="28px">
              Useful internal and external research and guidance documents on
              positive handling strategies and techniques, including national
              government legislation and guidance.
            </Typography>
          </Box>
          <Box width={630} sx={{ ml: 1, maxHeight: '85vh', overflow: 'auto' }}>
            <Box sx={{ pt: 2 }}>
              <TextField
                value={keyword}
                variant="filled"
                size="small"
                placeholder={t('search')}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: 'grey.500', mr: 0.5 }} />
                  ),
                }}
                onChange={e => setKeyword(e.target.value)}
                hiddenLabel
                fullWidth
              />

              <Stack spacing={2} sx={{ mt: 5 }}>
                <ExternalResourceCard
                  icon={<PictureAsPdfIcon color="success" fontSize="small" />}
                  text="2015 Children Homes Standards Summary"
                />
                <ExternalResourceCard
                  icon={<PictureAsPdfIcon color="success" fontSize="small" />}
                  text="2015 Children Homes Standards Summary"
                />
                <ExternalResourceCard
                  icon={<PictureAsPdfIcon color="success" fontSize="small" />}
                  text="2015 Children Homes Standards Summary"
                />
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </FullHeightPage>
  )
}
