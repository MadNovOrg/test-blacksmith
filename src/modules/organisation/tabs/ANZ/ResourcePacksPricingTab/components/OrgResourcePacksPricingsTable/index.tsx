import {
  Save as SaveIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import {
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  Course_Type_Enum,
  Currency,
  Resource_Packs_Pricing,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import {
  useSaveNewOrgResourcePacksPricing,
  useUpdateOrgResourcePacksPricing,
} from '@app/modules/organisation/hooks/useOrgResourcePacksPricing'
import { CurrencySymbol } from '@app/util'

import { useResourcePacksPricingContext } from '../../ResourcePacksPricingProvider/useResourcePacksPricingContext'
const pricesTextFieldSx = () => {
  return {
    width: 70,
    '& input': {
      textAlign: 'center',
      fontSize: '14px',
      padding: '4px',
    },
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '& input[type=number]': {
      MozAppearance: 'textfield',
    },
  }
}

const getNumberWithDigits = (number: number | string) =>
  Number(number).toFixed(2)

export const OrgResourcePacksPricingTable: React.FC = () => {
  const { acl } = useAuth()
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type.edit-pricing-modal.org-resource-packs-pricing-table',
  )

  const { id: orgId } = useParams()

  const { refetch, pricing, setSelectedPricing } =
    useResourcePacksPricingContext()

  const [, updateOrgResourcePacksPricing] = useUpdateOrgResourcePacksPricing()
  const [, saveNewOrgResourcePacksPricing] = useSaveNewOrgResourcePacksPricing()

  const cols = useMemo(() => {
    return [
      {
        id: 'resource-pack-option',
        label: t('columns.resource-pack-option'),
      },
      {
        id: 'aud-price',
        label: t('columns.price', { currency: Currency.Aud }),
      },
      {
        id: 'nzd-price',
        label: t('columns.price', { currency: Currency.Nzd }),
      },
      acl.canEditResourcePacksPricing()
        ? {
            id: 'actions',
            label: t('columns.actions'),
          }
        : null,
    ].filter(Boolean)
  }, [acl, t])

  // Update pricing values with AUD and NZD prices corresponding to the organisation
  const resourcePacksPricings = useMemo(() => {
    return pricing?.values.map(pricing => {
      const orgPricing = pricing.org_resource_packs_pricings[0]
      return {
        ...pricing,
        AUD_price: orgPricing?.AUD_price ?? pricing.AUD_price,
        NZD_price: orgPricing?.NZD_price ?? pricing.NZD_price,
      }
    })
  }, [pricing?.values])

  const [editId, setEditId] = useState<string | null>(null)
  const [tempResourcePackPricing, setTempResourcePackPricing] = useState<{
    audPrice: string
    nzdPrice: string
  }>({
    audPrice: getNumberWithDigits(0),
    nzdPrice: getNumberWithDigits(0),
  })

  const { addSnackbarMessage } = useSnackbar()

  if (!pricing) return null

  const validatePricing = (audPrice: number, nzdPrice: number) => {
    const errors: string[] = []

    if (audPrice <= 0 || nzdPrice <= 0) {
      errors.push(t('validation-errors.price-amount-required'))
    }

    return errors
  }

  const handleEdit = (pricing: Resource_Packs_Pricing) => {
    setEditId(pricing.id)
    setTempResourcePackPricing({
      audPrice: getNumberWithDigits(pricing.AUD_price),
      nzdPrice: getNumberWithDigits(pricing.NZD_price),
    })
  }

  const handleChange = (field: 'audPrice' | 'nzdPrice', value: string) => {
    // Remove any invalid characters, including "+" and "-"
    value = value.replace(/[^0-9.]/g, '')

    // Ensure only valid numeric values with a decimal point and no leading zero unless it's "0."
    if (/^(0(\.\d{0,2})?|[1-9]\d*(\.\d{0,2})?)$/.test(value) || value === '') {
      setTempResourcePackPricing(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleClose = () => {
    setEditId(null)
  }

  const handleSave = async (id: string) => {
    const validationErrors = validatePricing(
      Number(tempResourcePackPricing.audPrice),
      Number(tempResourcePackPricing.nzdPrice),
    )
    if (validationErrors.length) {
      addSnackbarMessage('resource-pack-pricing-error', {
        label: validationErrors.map(error => error),
      })
    } else {
      // check if the pricing already exists for the organisation
      const existingOrgResourcePackPricingId = pricing?.values.find(
        p => p.id === id,
      )?.org_resource_packs_pricings[0]?.id

      if (existingOrgResourcePackPricingId) {
        await updateOrgResourcePacksPricing({
          orgResourcePacksPricingId: existingOrgResourcePackPricingId,
          aud_price: tempResourcePackPricing.audPrice,
          nzd_price: tempResourcePackPricing.nzdPrice,
        })
      } else {
        await saveNewOrgResourcePacksPricing({
          input: {
            organisation_id: orgId,
            resource_packs_pricing_id: id,
            AUD_price: tempResourcePackPricing.audPrice,
            NZD_price: tempResourcePackPricing.nzdPrice,
          },
        })
      }
      refetch()
      setSelectedPricing({
        ...pricing,
        values: pricing?.values.map(p => {
          if (p.id === id) {
            return {
              ...p,
              org_resource_packs_pricings: [
                {
                  ...p.org_resource_packs_pricings[0],
                  AUD_price: tempResourcePackPricing.audPrice,
                  NZD_price: tempResourcePackPricing.nzdPrice,
                },
              ],
            }
          }
          return p
        }),
      })

      setEditId(null)
    }
  }

  return (
    <>
      <SnackbarMessage
        messageKey="resource-pack-pricing-error"
        severity="error"
        sx={{ top: 0 }}
        data-testid="snackbar-message"
      />
      {!resourcePacksPricings ? (
        <Stack sx={{ alignItems: 'center' }}>
          <CircularProgress />
        </Stack>
      ) : null}
      {resourcePacksPricings ? (
        <Table
          sx={{ mt: 1 }}
          data-testId={`resource-packs-pricing-table-${orgId}`}
        >
          <TableHead
            darker
            cols={cols}
            sx={{ '.MuiTableCell-root': { textAlign: 'center' } }}
          />
          <TableBody>
            {resourcePacksPricings.map(pricing => {
              return (
                <TableRow
                  key={pricing.id}
                  sx={{ backgroundColor: 'white' }}
                  data-testid={`row-${pricing.id}`}
                >
                  <TableCell sx={{ textAlign: 'left' }}>
                    {t(
                      `resource_packs_types.${pricing.course_type}.${
                        pricing.resource_packs_type
                      }${
                        pricing.course_type === Course_Type_Enum.Indirect &&
                        pricing.resource_packs_type !==
                          Resource_Packs_Type_Enum.DigitalWorkbook
                          ? '.' + pricing.resource_packs_delivery_type
                          : ''
                      }`,
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {editId === pricing.id ? (
                      <TextField
                        type="text"
                        size="small"
                        inputMode="decimal"
                        value={tempResourcePackPricing.audPrice}
                        inputProps={{
                          'data-testid': `edit-aud-price-${pricing.id}`,
                          pattern:
                            '^(0(\\.\\d{0,2})?|[1-9]\\d*(\\.\\d{0,2})?)$', // Disallow leading zero unless it's "0."
                        }}
                        sx={pricesTextFieldSx()}
                        onInput={e =>
                          handleChange(
                            'audPrice',
                            (e.target as HTMLInputElement).value,
                          )
                        }
                      />
                    ) : (
                      `${CurrencySymbol[Currency.Aud]}${getNumberWithDigits(
                        pricing.AUD_price,
                      )}`
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {editId === pricing.id ? (
                      <TextField
                        type="text"
                        size="small"
                        inputMode="decimal"
                        value={tempResourcePackPricing.nzdPrice}
                        inputProps={{
                          'data-testid': `edit-nzd-price-${pricing.id}`,
                          pattern:
                            '^(0(\\.\\d{0,2})?|[1-9]\\d*(\\.\\d{0,2})?)$', // Disallow leading zero unless it's "0."
                        }}
                        sx={pricesTextFieldSx()}
                        onInput={e =>
                          handleChange(
                            'nzdPrice',
                            (e.target as HTMLInputElement).value,
                          )
                        }
                      />
                    ) : (
                      `${CurrencySymbol[Currency.Nzd]}${getNumberWithDigits(
                        pricing.NZD_price,
                      )}`
                    )}
                  </TableCell>
                  {acl.canEditResourcePacksPricing() ? (
                    <TableCell sx={{ textAlign: 'center' }}>
                      {editId === pricing.id ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent={'center'}
                        >
                          <IconButton
                            data-testid={`save-pricing-${pricing.id}`}
                            color="primary"
                            size="small"
                            onClick={() => handleSave(pricing.id)}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton
                            data-testid={`cancel-pricing-${pricing.id}`}
                            color="primary"
                            size="small"
                            onClick={handleClose}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Stack>
                      ) : (
                        <IconButton
                          data-testid={`edit-pricing-${pricing.id}`}
                          color="primary"
                          onClick={() => handleEdit(pricing)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  ) : null}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : null}
    </>
  )
}
