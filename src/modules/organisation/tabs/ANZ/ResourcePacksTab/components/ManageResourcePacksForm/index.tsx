import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { TFunction } from 'i18next'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'urql'
import { InferType } from 'yup'

import { NumericTextField } from '@app/components/NumericTextField'
import {
  ManageOrgResourcePacksMutation,
  ManageOrgResourcePacksMutationVariables,
  Resource_Packs_Type_Enum,
  ResourcePacksTypeEnum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useOrgResourcePacks } from '@app/modules/course/hooks/useOrgResourcePacks'
import MANAGE_ORG_RESOURCE_PACKS from '@app/modules/organisation/queries/resource-packs-manage'
import { yup } from '@app/schemas'

enum ManageResourcePacksAction {
  Add = 'Add',
  Remove = 'Remove',
}

function schema(
  t: TFunction,
  totalBalance: ReturnType<typeof useOrgResourcePacks>['resourcePacks'],
) {
  return yup.object({
    amount: yup
      .number()
      .typeError(
        t('pages.org-details.tabs.licenses.form.error-amount-positive'),
      )
      .positive(t('pages.org-details.tabs.licenses.form.error-amount-positive'))
      .test('valid-amount', function (value) {
        const { type, resourcePacksType } = this.parent
        if (typeof value !== 'number') return false

        const balance =
          totalBalance.balance[resourcePacksType as Resource_Packs_Type_Enum] ||
          0

        if (type === ManageResourcePacksAction.Remove) {
          if (Math.abs(value) > balance) {
            return this.createError({
              message: t(
                'pages.org-details.tabs.resource-packs.form.error-amount-max',
                { max: balance },
              ),
            })
          }
        }

        return true
      })
      .required(
        t('pages.org-details.tabs.licenses.form.error-amount-required'),
      ),
    invoiceNumber: yup.string().when('type', {
      is: ManageResourcePacksAction.Add,
      then: schema => schema.required(t('error-invoice-required')),
      otherwise: schema => schema.notRequired(),
    }),
    note: yup.string(),
    resourcePacksType: yup
      .mixed()
      .oneOf(Object.values(Resource_Packs_Type_Enum))
      .required(
        t(
          'pages.org-details.tabs.resource-packs.form.error-resource-packs-type-required',
        ),
      ),
    type: yup
      .mixed()
      .oneOf(Object.values(ManageResourcePacksAction))
      .required(),
  })
}

export type FormData = InferType<ReturnType<typeof schema>>

type ManageResourcePacksFormProps = {
  onCancel: () => void
  onSuccess: () => void
  orgId: string
}

export const ManageResourcePacksForm = ({
  onCancel,
  onSuccess,
  orgId,
}: ManageResourcePacksFormProps) => {
  const { t, _t } = useScopedTranslation(
    'pages.org-details.tabs.resource-packs',
  )

  const { resourcePacks: orgResourcePacks } = useOrgResourcePacks({ orgId })

  const resourcePacksTypeOptions = useMemo(() => {
    return Object.values(Resource_Packs_Type_Enum).map(value => ({
      key: value,
      value: t(`form.options.${value}`),
    }))
  }, [t])

  const {
    clearErrors,
    control,
    formState: { errors, isValid },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: { amount: 0, type: ManageResourcePacksAction.Add },
    mode: 'onChange',
    resolver: yupResolver(schema(_t, orgResourcePacks)),
  })

  const values = watch()

  const [{ fetching: loading, data }, manageOrgResourcePacks] = useMutation<
    ManageOrgResourcePacksMutation,
    ManageOrgResourcePacksMutationVariables
  >(MANAGE_ORG_RESOURCE_PACKS)

  useEffect(() => {
    if (data?.addResourcePacks?.success) {
      onSuccess()
      onCancel()
    }
  }, [data?.addResourcePacks?.success, onCancel, onSuccess])

  useEffect(() => {
    clearErrors('amount')
  }, [clearErrors, values.type, values.resourcePacksType])

  useEffect(() => {
    if (
      values.type === ManageResourcePacksAction.Remove &&
      values.amount >
        (orgResourcePacks.balance[
          values.resourcePacksType as Resource_Packs_Type_Enum
        ] ?? 0)
    ) {
      setValue('amount', 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    orgResourcePacks.balance,
    setValue,
    values.resourcePacksType,
    values.type,
  ])

  const submit = useCallback(
    async (data: FormData) => {
      await manageOrgResourcePacks({
        input: {
          amount:
            data.amount *
            (data.type === ManageResourcePacksAction.Remove ? -1 : 1),
          invoiceNumber: data.invoiceNumber ?? '',
          note: data.note,
          orgId,
          resourcePackType: data.resourcePacksType as ResourcePacksTypeEnum,
        },
      })
    },
    [manageOrgResourcePacks, orgId],
  )

  return (
    <form onSubmit={handleSubmit(submit)}>
      {data?.addResourcePacks?.error ||
      data?.addResourcePacks?.success === false ? (
        <Alert severity="error" sx={{ mb: 1 }}>
          {_t('unknown-error')}
        </Alert>
      ) : null}

      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <RadioGroup row {...field}>
            <FormControlLabel
              control={<Radio />}
              label={t('form.add')}
              value={ManageResourcePacksAction.Add}
            />
            <FormControlLabel
              control={<Radio />}
              label={t('form.remove')}
              value={ManageResourcePacksAction.Remove}
            />
          </RadioGroup>
        )}
      />

      <FormControl fullWidth variant="filled">
        <InputLabel required>
          {t('form.resource-packs-type-placeholder')}
        </InputLabel>
        <Controller
          name="resourcePacksType"
          control={control}
          render={({ field }) => (
            <Select {...field} data-testid="resource-packs-type-select">
              {resourcePacksTypeOptions.map(({ key, value }) => {
                return (
                  <MenuItem
                    key={key}
                    value={key}
                    data-testid={`resource-packs-type-select-option-${key}`}
                  >
                    {value}
                  </MenuItem>
                )
              })}
            </Select>
          )}
        />
        {errors.resourcePacksType?.message ? (
          <FormHelperText error>
            {errors.resourcePacksType?.message}
          </FormHelperText>
        ) : null}
      </FormControl>

      <Grid container columnSpacing={2} sx={{ mt: 2 }}>
        <Grid item xs={values.type === ManageResourcePacksAction.Add ? 6 : 12}>
          <NumericTextField
            {...register('amount')}
            disabled={!values.resourcePacksType}
            error={Boolean(errors.amount?.message)}
            fullWidth
            helperText={errors.amount?.message}
            label={t('form.amount-placeholder')}
            required
            variant="filled"
            inputProps={{ 'data-testid': 'resource-packs-manage-form-amount' }}
          />
        </Grid>
        {values.type === ManageResourcePacksAction.Add ? (
          <Grid item xs={6}>
            <TextField
              {...register('invoiceNumber')}
              error={Boolean(errors.invoiceNumber?.message)}
              fullWidth
              helperText={errors.invoiceNumber?.message}
              label={t('form.invoice-placeholder')}
              required
              variant="filled"
              inputProps={{
                'data-testid': 'resource-packs-manage-form-invoice-number',
              }}
            />
          </Grid>
        ) : null}
      </Grid>

      {values.resourcePacksType ? (
        <Typography variant="body2" mt={1}>
          {t('form.total-remaining-resource-packs', {
            balance: Math.max(
              (orgResourcePacks.balance[
                values.resourcePacksType as Resource_Packs_Type_Enum
              ] ?? 0) +
                +values.amount *
                  (values.type === ManageResourcePacksAction.Remove ? -1 : 1),
              0,
            ).toString(),
            resourcePacksType: t(
              `form.${values.resourcePacksType as Resource_Packs_Type_Enum}`,
            ),
          }).replace(/&amp;/g, '&')}
        </Typography>
      ) : null}

      <TextField
        {...register('note')}
        fullWidth
        label={t('form.note-placeholder')}
        sx={{ mt: 2 }}
        variant="filled"
      />

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button onClick={onCancel} sx={{ marginRight: 2 }}>
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          type="submit"
          disabled={!isValid}
        >
          Save details
        </LoadingButton>
      </Box>
    </form>
  )
}
