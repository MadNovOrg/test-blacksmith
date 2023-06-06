import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InferType } from 'yup'

import { Dialog } from '@app/components/Dialog'
import { useAuth } from '@app/context/auth'
import {
  Course_Pricing,
  SetCoursePricingMutation,
  SetCoursePricingMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { MUTATION } from '@app/queries/pricing/set-course-pricing'
import { yup } from '@app/schemas'
import theme from '@app/theme'

import { getCourseAttributes } from '../utils'

export type EditPriceModalProps = {
  pricing: Course_Pricing | null
  onClose: () => void
  onSave: () => void
}

export const EditPriceModal = ({
  pricing,
  onClose,
  onSave,
}: EditPriceModalProps) => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { profile } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const schema = useMemo(() => {
    return yup
      .object({
        priceAmount: yup
          .number()
          .positive()
          .transform(value => (Number.isNaN(value) ? undefined : value))
          .required(
            t('common.validation-errors.required-field', {
              name: t('pages.course-pricing.cols-price'),
            })
          ),
      })
      .required()
  }, [t])

  const { register, handleSubmit, formState } = useForm<
    InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    defaultValues: {
      priceAmount: pricing?.priceAmount,
    },
  })

  const onFormSubmit: SubmitHandler<InferType<typeof schema>> = async data => {
    setLoading(true)

    try {
      await fetcher<
        SetCoursePricingMutation,
        SetCoursePricingMutationVariables
      >(MUTATION, {
        id: pricing?.id,
        oldPrice: pricing?.priceAmount,
        priceAmount: data.priceAmount,
        authorId: profile?.id,
      })
      onSave()
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Dialog
        open={true}
        onClose={onClose}
        title={
          <Typography variant="h3" ml={3} fontWeight={600} color="secondary">
            {t('pages.course-pricing.modal-individual-edit-title')}
          </Typography>
        }
        maxWidth={628}
      >
        <Container>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Typography sx={{ mb: 2 }} variant="body1" color="dimGrey.main">
              {t('pages.course-pricing.modal-individual-edit-description')}
            </Typography>

            <Typography variant="h4" fontWeight={500} mt={3} color="secondary">
              {t('pages.course-pricing.modal-price-label')}
            </Typography>

            <TextField
              required
              hiddenLabel
              variant="filled"
              error={!!formState.errors.priceAmount}
              helperText={formState.errors.priceAmount?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">£</InputAdornment>
                ),
              }}
              inputProps={{
                'data-testid': 'field-price-amount',
              }}
              sx={{ bgcolor: 'grey.100', my: 2 }}
              {...register('priceAmount')}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Typography
              variant="h4"
              fontWeight={500}
              mt={3}
              mb={1}
              color="secondary"
            >
              {t('pages.course-pricing.modal-details-label')}
            </Typography>

            <List sx={{ width: '100%', bgcolor: theme.palette.grey[100] }}>
              <ListItem alignItems="flex-start">
                <ListItemText sx={{ width: '50%' }}>
                  <Typography color="dimGrey.main">
                    {t('pages.course-pricing.cols-course')}
                  </Typography>
                </ListItemText>
                <ListItemText sx={{ width: '50%' }}>
                  <Typography fontWeight={600} color="secondary">
                    {pricing?.level && t(`course-levels.${pricing?.level}`)}
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemText sx={{ width: '50%' }}>
                  <Typography color="dimGrey.main">
                    {t('pages.course-pricing.cols-type')}
                  </Typography>
                </ListItemText>
                <ListItemText sx={{ width: '50%' }}>
                  <Typography fontWeight={600} color="secondary">
                    {pricing?.type && t(`course-types.${pricing?.type}`)}
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemText sx={{ width: '50%' }}>
                  <Typography color="dimGrey.main">
                    {t('pages.course-pricing.cols-attributes')}
                  </Typography>
                </ListItemText>
                <ListItemText sx={{ width: '50%' }}>
                  <Typography fontWeight={600} color="secondary">
                    {getCourseAttributes(t, pricing)}
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>

            <Box display="flex" justifyContent="end" mt={3}>
              <Button
                type="button"
                variant="text"
                color="primary"
                onClick={onClose}
              >
                {t('pages.course-pricing.modal-cancel')}
              </Button>
              <LoadingButton
                loading={loading}
                disabled={!formState.isValid}
                type="submit"
                variant="contained"
                color="primary"
                sx={{ ml: 1 }}
              >
                {t('pages.course-pricing.modal-save')}
              </LoadingButton>
            </Box>
          </form>
        </Container>
      </Dialog>
    </Container>
  )
}
