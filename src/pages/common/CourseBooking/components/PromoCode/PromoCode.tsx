import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  codes: string[]
  onAdd: (_: string) => void
  onRemove: (_: string) => void
}

export const PromoCode: React.FC<Props> = ({ codes, onAdd, onRemove }) => {
  const { t } = useTranslation()
  const [adding, setAdding] = useState(false)
  const [value, setValue] = useState('')

  const handleApply = () => {
    onAdd(value)
    setValue('')
    setAdding(false)
  }

  return (
    <Stack>
      <Box>
        {codes.map(c => (
          <Box
            key={c}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <Typography
                variant="body1"
                color="grey.700"
                textTransform="uppercase"
              >
                {t('code')}: {c}
              </Typography>
              <LoadingButton
                loading={false}
                variant="text"
                color="primary"
                size="small"
                sx={{ ml: 2 }}
                onClick={() => onRemove(c)}
              >
                {t('remove')}
              </LoadingButton>
            </Box>
            <Typography variant="body1" color="grey.700">
              - {t('currency', { amount: 2 })}
            </Typography>
          </Box>
        ))}
      </Box>

      {adding && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box pr={2} flex={1}>
            <TextField
              autoFocus
              variant="standard"
              label={t('enter-promo-code')}
              placeholder={t('promo-code')}
              fullWidth
              sx={{ bgcolor: 'grey.100' }}
              onChange={e => setValue(e.target.value)}
              value={value}
            />
          </Box>
          {value.trim().length ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleApply}
            >
              {t('apply')}
            </Button>
          ) : (
            <Button variant="text" color="primary" size="small">
              {t('cancel')}
            </Button>
          )}
        </Box>
      )}

      <Box display="flex" justifyContent="flex-end" mr={-1} mt={2}>
        <Button
          size="small"
          variant="text"
          color="primary"
          sx={{ fontWeight: '600' }}
          onClick={() => setAdding(true)}
        >
          {t('pages.book-course.apply-promo')}
        </Button>
      </Box>
    </Stack>
  )
}
