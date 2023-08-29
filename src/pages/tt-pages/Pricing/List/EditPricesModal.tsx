import { yupResolver } from '@hookform/resolvers/yup'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InferType } from 'yup'

import { Dialog } from '@app/components/dialogs'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import {
  Course_Pricing,
  Course_Pricing_Changelog_Insert_Input,
} from '@app/generated/graphql'
import {
  SetCoursePricingBulkMutation,
  SetCoursePricingBulkMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { MUTATION } from '@app/queries/pricing/set-course-pricings'
import { yup } from '@app/schemas'

import { getCourseAttributes } from '../utils'

export type EditPricesModalProps = {
  pricings: Course_Pricing[] | null
  onClose: () => void
  onSave: () => void
}

export const EditPricesModal = ({
  pricings,
  onClose,
  onSave,
}: EditPricesModalProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const fetcher = useFetcher()
  const { profile } = useAuth()

  const [selectedPricings, setSelectedPricings] = useState<
    Course_Pricing[] | null
  >(pricings)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [existsPriceReduction, setExistsPriceReduction] = useState(false)

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

  const { watch, register, handleSubmit, formState } = useForm<
    InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    defaultValues: {
      priceAmount: undefined,
    },
  })

  const formPriceAmount = watch('priceAmount')

  const removeSinglePricing = (id: string) => {
    const newPricings = selectedPricings?.filter(pricing => pricing.id !== id)
    if (newPricings) {
      setSelectedPricings(newPricings)
    }
  }

  const removeAllPriceReductions = () => {
    const newPricings = selectedPricings?.filter(
      pricing => pricing.priceAmount <= formPriceAmount
    )
    if (newPricings) {
      setSelectedPricings(newPricings)
    }
  }

  const getCellStyle = (
    formPriceAmount: number | null,
    pricingPriceAmount: number
  ): { fontWeight: string } => ({
    fontWeight:
      formPriceAmount && pricingPriceAmount > formPriceAmount
        ? '600'
        : 'inherit',
  })

  useEffect(() => {
    const result =
      !!formPriceAmount &&
      !!selectedPricings?.some(pricing => pricing.priceAmount > formPriceAmount)
    setExistsPriceReduction(result)
  }, [formPriceAmount, selectedPricings])

  const onFormSubmit: SubmitHandler<InferType<typeof schema>> = async data => {
    setLoading(true)

    const coursePricingIdsToUpdate = selectedPricings?.map(
      ({ id }) => id
    ) as string[]

    const coursePricingChangeLogs = selectedPricings?.map(
      ({ id, priceAmount }) => {
        return {
          coursePricingId: id,
          oldPrice: priceAmount,
          newPrice: data.priceAmount,
          authorId: profile?.id,
        }
      }
    ) as Course_Pricing_Changelog_Insert_Input[]

    try {
      await fetcher<
        SetCoursePricingBulkMutation,
        SetCoursePricingBulkMutationVariables
      >(MUTATION, {
        coursePricingIds: coursePricingIdsToUpdate,
        coursePricingChangelogs: coursePricingChangeLogs,
        newPrice: data.priceAmount,
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
            {t('pages.course-pricing.modal-multiple-edit-title')}
          </Typography>
        }
        maxWidth={800}
      >
        <Container>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Typography sx={{ mb: 2 }} variant="body1" color="dimGrey.main">
              <Typography component="span" sx={{ fontWeight: 'bold' }}>
                {t('pages.course-pricing.modal-multiple-edit-intro')}
              </Typography>
              <Typography component="span" sx={{ ml: 0.5 }}>
                {t('pages.course-pricing.modal-multiple-edit-notice')}
              </Typography>
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
              sx={{ bgcolor: 'grey.100', mt: 1, mb: 2 }}
              {...register('priceAmount')}
            />

            {existsPriceReduction && (
              <Alert
                action={
                  <Button
                    color="inherit"
                    size="medium"
                    sx={{
                      textDecoration: 'underline',
                      py: 0,
                    }}
                    onClick={() => {
                      removeAllPriceReductions()
                    }}
                  >
                    {t(
                      'pages.course-pricing.modal-multiple-edit-remove-errors'
                    )}
                  </Button>
                }
                severity="error"
                sx={{ mt: 2, mb: 4 }}
              >
                <Typography fontWeight={500} fontSize="14px">
                  {t(
                    'pages.course-pricing.modal-multiple-edit-price-reduction'
                  )}
                </Typography>
              </Alert>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('pages.course-pricing.cols-course')}</TableCell>
                  <TableCell>{t('pages.course-pricing.cols-type')}</TableCell>
                  <TableCell>
                    {t('pages.course-pricing.cols-attributes')}
                  </TableCell>
                  <TableCell>{t('pages.course-pricing.cols-was')}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{t('pages.course-pricing.cols-now')}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableNoRows
                  noRecords={!selectedPricings?.length}
                  colSpan={7}
                />
                {selectedPricings?.map(pricing => (
                  <TableRow
                    key={pricing.id}
                    sx={{
                      backgroundColor:
                        formPriceAmount && pricing.priceAmount > formPriceAmount
                          ? theme.palette.error.light
                          : 'inherit',
                    }}
                  >
                    <TableCell
                      sx={getCellStyle(formPriceAmount, pricing.priceAmount)}
                    >
                      {t(`course-levels.${pricing?.level}`)}
                    </TableCell>
                    <TableCell
                      sx={getCellStyle(formPriceAmount, pricing.priceAmount)}
                    >
                      {t(`course-types.${pricing?.type}`)}
                    </TableCell>
                    <TableCell
                      sx={getCellStyle(formPriceAmount, pricing.priceAmount)}
                    >
                      {getCourseAttributes(t, pricing)}
                    </TableCell>
                    <TableCell
                      width="auto"
                      align="left"
                      sx={getCellStyle(formPriceAmount, pricing.priceAmount)}
                    >
                      {t('currency', {
                        amount: pricing?.priceAmount,
                        currency: pricing?.priceCurrency,
                      })}
                    </TableCell>
                    <TableCell>
                      <ArrowForwardIcon
                        style={{ color: theme.palette.grey[500] }}
                      />
                    </TableCell>
                    <TableCell
                      sx={getCellStyle(formPriceAmount, pricing.priceAmount)}
                    >
                      {formPriceAmount
                        ? t('currency', {
                            amount: formPriceAmount,
                            currency: pricing?.priceCurrency,
                          })
                        : null}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        sx={{ whiteSpace: 'nowrap' }}
                        onClick={() => removeSinglePricing(pricing.id)}
                        startIcon={<DeleteIcon />}
                      ></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box display="flex" justifyContent="end" mt={4}>
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
                disabled={!formState.isValid || !selectedPricings?.length}
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
