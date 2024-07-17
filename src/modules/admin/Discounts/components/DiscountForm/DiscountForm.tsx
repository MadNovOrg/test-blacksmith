import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  MenuItem,
  Radio,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { endOfDay, startOfDay } from 'date-fns'
import { omit } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'
import { useDebounce, useDebouncedCallback } from 'use-debounce'

import { Dialog } from '@app/components/dialogs'
import { SelectCourses } from '@app/components/SelectCourses'
import { SelectLevels } from '@app/components/SelectLevels'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  Course_Type_Enum,
  DisablePromoCodeMutation,
  DisablePromoCodeMutationVariables,
  FindProfilesQuery,
  GetPromoCodesQuery,
  GetPromoCodesQueryVariables,
  Promo_Code_Type_Enum,
  UpsertPromoCodeMutation,
  UpsertPromoCodeMutationVariables,
} from '@app/generated/graphql'
import { ProfileSelector } from '@app/modules/profile/components/ProfileSelector'
import { NotFound } from '@app/pages/common/NotFound'
import { DISABLE_PROMO_CODE } from '@app/queries/promo-codes/disable-promo-code'
import { GET_PROMO_CODES } from '@app/queries/promo-codes/get-promo-codes'
import { UPSERT_PROMO_CODE } from '@app/queries/promo-codes/upsert-promo-code'
import { Profile } from '@app/types'
import { INPUT_DATE_FORMAT } from '@app/util'

import {
  AMOUNT_PRESET_VALUE,
  AMOUNT_PRESETS,
  APPLIES_TO,
  DEFAULT_AMOUNT_PER_TYPE,
  FormInputs,
  getAmountPreset,
  requiresApproval,
  schema,
} from './helpers'
import { Wrapper } from './Wrapper'

export const DiscountForm: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { id } = useParams()
  const isEdit = !!id
  const { activeRole, acl, profile } = useAuth()
  const { addSnackbarMessage } = useSnackbar()

  const [createdBy, setCreatedBy] = useState<
    Profile | FindProfilesQuery['profiles'][0]
  >()

  const amountInputRef = useRef<HTMLInputElement>()
  const [amountPreset, setAmountPreset] = useState(AMOUNT_PRESETS.FIVE)

  const [limitBookings, setLimitBookings] = useState(false)

  const [showApprovalNotice, setShowApprovalNotice] = useState(false)
  const [showDisableModal, setShowDisableModal] = useState(false)
  const {
    register,
    watch,
    formState,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema({ t })),
    defaultValues: {
      code: '',
      description: '',
      type: Promo_Code_Type_Enum.Percent,
      amount: DEFAULT_AMOUNT_PER_TYPE[Promo_Code_Type_Enum.Percent],
      appliesTo: APPLIES_TO.ALL,
      levels: [],
      courses: [],
      validFrom: startOfDay(new Date()),
      validTo: null,
      usesMax: null,
      bookerSingleUse: true,
      createdBy: profile?.id,
    },
  })
  const values = watch()
  const [debouncedCode] = useDebounce(values.code, 300)

  const [{ data, error, fetching: promoCodesFetching }] = useQuery<
    GetPromoCodesQuery,
    GetPromoCodesQueryVariables
  >({
    query: GET_PROMO_CODES,
    variables: {
      where: { id: { _eq: id } },
    },
    pause: !id,
  })
  const isLoading = isEdit && promoCodesFetching

  const [{ data: promoCodes, fetching: promocodesFetching }] = useQuery<
    GetPromoCodesQuery,
    GetPromoCodesQueryVariables
  >({
    query: GET_PROMO_CODES,
    variables: { where: { code: { _eq: debouncedCode } } },
    pause: !debouncedCode,
  })
  const [{ fetching: disablePromoCodeLoading }, disablePromoCodeMutation] =
    useMutation<DisablePromoCodeMutation, DisablePromoCodeMutationVariables>(
      DISABLE_PROMO_CODE,
    )

  const [{ fetching: upsertPromoCodeLoading }, upsertPromoCodeMutation] =
    useMutation<UpsertPromoCodeMutation, UpsertPromoCodeMutationVariables>(
      UPSERT_PROMO_CODE,
    )

  useEffect(() => {
    if (data) {
      if (data.promoCodes.length > 0) {
        const promoCode = data?.promoCodes[0]
        setValue('code', promoCode.code)
        setValue('description', promoCode.description ?? '')
        setValue('type', promoCode.type)
        setValue('amount', promoCode.amount)
        if (promoCode.courses?.length > 0) {
          setValue('appliesTo', APPLIES_TO.COURSES)
        } else if (promoCode?.levels?.length > 0) {
          setValue('appliesTo', APPLIES_TO.LEVELS)
        }
        setValue('levels', promoCode.levels)
        setValue(
          'courses',
          promoCode.courses.map(c => c.course?.id ?? 0),
        )
        if (promoCode?.validFrom) {
          setValue('validFrom', new Date(promoCode.validFrom))
        }
        if (promoCode?.validTo) {
          setValue('validTo', new Date(promoCode.validTo))
        }
        setValue('usesMax', promoCode.usesMax)
        setValue('bookerSingleUse', promoCode.bookerSingleUse)
        if (promoCode.creator) {
          setCreatedBy(promoCode.creator as Profile)
        }
        setAmountPreset(getAmountPreset(promoCode.amount))
      }
    }
  }, [data, setValue])

  const disabled = data?.promoCodes[0].disabled
  const appliesToRadio = values.appliesTo

  const checkDuplicateCode = useDebouncedCallback(async () => {
    if (data && data.promoCodes[0].code === values.code) return
    try {
      if (promoCodes?.promoCodes.length) {
        setError('code', { message: t('pages.promoCodes.fld-code-dup') })
      } else {
        clearErrors('code')
      }
    } catch (err) {
      setError('code', { message: t('pages.promoCodes.fld-code-dup-failed') })
    }
  }, 2000)

  useEffect(() => {
    if (values.code) {
      clearErrors('code')
      checkDuplicateCode()
    }
  }, [values.code, checkDuplicateCode, clearErrors])

  useEffect(() => {
    if (!createdBy && !isEdit) {
      setCreatedBy(profile)
    } else if (createdBy && values.createdBy !== createdBy.id) {
      setValue('createdBy', createdBy.id)
    }
  }, [createdBy, data, isEdit, profile, setValue, values.createdBy])

  const typeRadioChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const type = ev.target.value as Promo_Code_Type_Enum
    setValue('type', type)
    setValue('amount', DEFAULT_AMOUNT_PER_TYPE[type])
    if (type === Promo_Code_Type_Enum.Percent) {
      setAmountPreset(AMOUNT_PRESETS.FIVE)
    }
    if (type === Promo_Code_Type_Enum.FreePlaces) {
      amountInputRef.current?.focus()
    }
  }

  const renderTypeRadio = (value: Promo_Code_Type_Enum) => {
    return (
      <FormControlLabel
        label={t(`pages.promoCodes.fld-type-${value}`)}
        data-testid={`discount-type-${value}`}
        control={
          <Radio
            value={value}
            checked={values.type === value}
            onChange={typeRadioChange}
            disabled={disabled}
          />
        }
      />
    )
  }

  const amountRadioChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value as AMOUNT_PRESETS
    setAmountPreset(value)
    if (value === AMOUNT_PRESETS.OTHER) {
      setValue('amount', 20)
      amountInputRef.current?.focus()
    } else {
      setValue('amount', AMOUNT_PRESET_VALUE[value])
    }
  }

  const appliesToRadioChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value as APPLIES_TO
    setValue('appliesTo', value)
    if (value === APPLIES_TO.ALL) {
      setValue('levels', [])
      setValue('courses', [])
    }

    if (value === APPLIES_TO.LEVELS) {
      setValue('courses', [])
    }

    if (value === APPLIES_TO.COURSES) {
      setValue('levels', [])
    }
  }

  const renderAppliesToRadio = (value: APPLIES_TO) => {
    return (
      <FormControlLabel
        label={t(`pages.promoCodes.appliesTo-${value}`)}
        data-testid={`appliesTo-${value}`}
        control={
          <Radio
            value={value}
            checked={appliesToRadio === value}
            onChange={appliesToRadioChange}
            disabled={disabled}
          />
        }
      />
    )
  }

  const limitBookingsChange = (_: unknown, checked: boolean) => {
    setLimitBookings(checked)
    setValue('usesMax', checked ? 1 : null)
  }

  const sendForApproval = useMemo(() => {
    const amountModified = data?.promoCodes[0].amount !== values.amount
    return amountModified && requiresApproval(values, activeRole)
  }, [activeRole, data?.promoCodes, values])

  const upsertPromoCode = async () => {
    const promoCode = omit(values, ['appliesTo', 'courses'])
    const { data } = await upsertPromoCodeMutation({
      promoCondition: isEdit ? { id: { _eq: id } } : { id: { _is_null: true } },
      promoCode: {
        id: isEdit ? id : undefined,
        ...promoCode,
        approvedBy: sendForApproval ? null : profile?.id,
        courses: {
          data: values.courses.map(c => {
            return { course_id: c }
          }),
        },
      },
    })
    if (data) return navigate('..')
  }

  const disablePromoCode = useCallback(async () => {
    await disablePromoCodeMutation({ id })
    addSnackbarMessage('discount-disabled', {
      label: t('pages.promoCodes.discount-has-been-disabled'),
    })
    navigate('..')
  }, [addSnackbarMessage, disablePromoCodeMutation, id, navigate, t])

  const onSubmitValid = async () => {
    if (sendForApproval) {
      setShowApprovalNotice(true)
    } else {
      await upsertPromoCode()
    }
  }

  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="promocode-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  } else if (isEdit && (error || data?.promoCodes?.length === 0)) {
    return <NotFound />
  }

  return (
    <Wrapper
      onSubmit={handleSubmit(onSubmitValid)}
      title={
        isEdit
          ? t(`pages.promoCodes.edit-title`)
          : t(`pages.promoCodes.new-title`)
      }
    >
      <Helmet>
        <title>{t('pages.browser-tab-titles.admin.new-discount')}</title>
      </Helmet>
      <Typography variant="body1" fontWeight="bold">
        {t('pages.promoCodes.new-section-general')}
      </Typography>
      <Stack gap={3} flex={1} sx={{ p: 4, backgroundColor: '#fff' }}>
        {disabled ? (
          <Alert severity="warning" variant="outlined">
            {t('pages.promoCodes.alert-disabled')}
          </Alert>
        ) : null}

        {/* CREATED BY */}
        <Box>
          <Typography fontWeight="bold">
            {t('pages.promoCodes.fld-createdBy-label')}
          </Typography>
          {createdBy ? (
            <ProfileSelector
              value={createdBy}
              onChange={setCreatedBy}
              disabled={disabled}
            />
          ) : null}
        </Box>

        {/* CODE + DESCRIPTION */}
        <Box>
          <Typography fontWeight="bold">
            {t('pages.promoCodes.fld-code-label')}
          </Typography>
          <Typography variant="body2">
            {t('pages.promoCodes.fld-code-hint')}
          </Typography>
          <TextField
            variant="filled"
            fullWidth
            hiddenLabel
            placeholder={t('pages.promoCodes.fld-code-label')}
            inputProps={{ 'data-testid': 'fld-code' }}
            {...register('code')}
            error={!!formState.errors.code}
            helperText={formState.errors.code?.message ?? ' '}
            disabled={disabled}
          />
          <TextField
            variant="filled"
            multiline
            maxRows={4}
            fullWidth
            hiddenLabel
            placeholder={t('pages.promoCodes.fld-description-label')}
            inputProps={{ 'data-testid': 'fld-description' }}
            {...register('description')}
            error={!!formState.errors.description}
            helperText={formState.errors.description?.message ?? ''}
            disabled={disabled}
          />
        </Box>

        {/* TYPE + AMOUNT */}
        <Box>
          <Typography fontWeight="bold">
            {t('pages.promoCodes.fld-type-label')}
          </Typography>
          <Box>
            {renderTypeRadio(Promo_Code_Type_Enum.Percent)}
            {renderTypeRadio(Promo_Code_Type_Enum.FreePlaces)}
          </Box>

          {values.type === Promo_Code_Type_Enum.Percent ? (
            <>
              <Box display="flex" alignItems="center">
                <TextField
                  select
                  hiddenLabel
                  variant="filled"
                  value={amountPreset}
                  onChange={amountRadioChange}
                  sx={{ minWidth: 130 }}
                  data-testid="percent-shortcuts"
                  disabled={disabled}
                >
                  <MenuItem
                    value={AMOUNT_PRESETS.FIVE}
                    data-testid={`percent-shortcut-${AMOUNT_PRESETS.FIVE}`}
                  >
                    5%
                  </MenuItem>
                  <MenuItem
                    value={AMOUNT_PRESETS.TEN}
                    data-testid={`percent-shortcut-${AMOUNT_PRESETS.TEN}`}
                  >
                    10%
                  </MenuItem>
                  <MenuItem
                    value={AMOUNT_PRESETS.FIFTEEN}
                    data-testid={`percent-shortcut-${AMOUNT_PRESETS.FIFTEEN}`}
                  >
                    15%
                  </MenuItem>
                  <MenuItem
                    value={AMOUNT_PRESETS.OTHER}
                    data-testid={`percent-shortcut-${AMOUNT_PRESETS.OTHER}`}
                  >
                    {t('other')}
                  </MenuItem>
                </TextField>

                <TextField
                  inputRef={input => (amountInputRef.current = input)}
                  hiddenLabel
                  placeholder="Amount"
                  variant="filled"
                  inputProps={{
                    inputMode: 'numeric',
                    style: { textAlign: 'right' },
                    'data-testid': 'fld-amount-percent',
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  {...register('amount')}
                  error={!!formState.errors.amount}
                  sx={{
                    ml: 2,
                    maxWidth: 70,
                    opacity: amountPreset === AMOUNT_PRESETS.OTHER ? 1 : 0,
                  }}
                  disabled={disabled}
                />

                <FormHelperText error sx={{ ml: 2 }}>
                  {formState.errors.amount?.message ?? ' '}
                </FormHelperText>
              </Box>
              <Typography variant="body2" mt={1}>
                {t('pages.promoCodes.fld-amount-percent-hint')}
              </Typography>
            </>
          ) : null}
          {values.type === Promo_Code_Type_Enum.FreePlaces ? (
            <Box display="flex" alignItems="center">
              <TextField
                inputRef={input => (amountInputRef.current = input)}
                hiddenLabel
                placeholder="Free places"
                variant="filled"
                inputProps={{
                  inputMode: 'numeric',
                  'data-testid': 'fld-amount-freeplaces',
                }}
                {...register('amount')}
                error={!!formState.errors.amount}
                sx={{ maxWidth: 130 }}
                disabled={disabled}
              />
              <FormHelperText error sx={{ ml: 2 }}>
                {formState.errors.amount?.message ?? ' '}
              </FormHelperText>
            </Box>
          ) : null}
        </Box>

        {/* APPLIES TO */}
        <Box>
          <Typography fontWeight="bold">
            {t('pages.promoCodes.courses-title')}
          </Typography>
          <Box display="flex" gap={4}>
            {renderAppliesToRadio(APPLIES_TO.ALL)}
            {renderAppliesToRadio(APPLIES_TO.LEVELS)}
            {renderAppliesToRadio(APPLIES_TO.COURSES)}
          </Box>
          {appliesToRadio === APPLIES_TO.LEVELS ? (
            <>
              {!disabled ? (
                <>
                  <SelectLevels
                    value={values.levels}
                    onChange={ev => setValue('levels', ev.target.value)}
                  />
                  <FormHelperText error>
                    {formState.errors.levels
                      ? t('pages.promoCodes.appliesTo-LEVELS-required')
                      : ' '}
                  </FormHelperText>
                </>
              ) : (
                <Box>
                  {values.levels.map(l => (
                    <Chip label={l} key={l} />
                  ))}
                </Box>
              )}
            </>
          ) : null}
          {appliesToRadio === APPLIES_TO.COURSES ? (
            <>
              <SelectCourses
                value={values.courses}
                onChange={ev => setValue('courses', ev.target.value)}
                titleHint={t('pages.promoCodes.selectCourses-titleHint')}
                where={{
                  type: { _eq: Course_Type_Enum.Open },
                  schedule: {
                    start: {
                      _gte: isEdit ? undefined : startOfDay(new Date()),
                    },
                  },
                }}
                disabled={disabled}
              />
              <FormHelperText error>
                {formState.errors.courses
                  ? t('pages.promoCodes.appliesTo-COURSES-required')
                  : ' '}
              </FormHelperText>
            </>
          ) : null}
        </Box>

        {/* VALID FROM / TO */}
        <Box>
          <Typography fontWeight="bold">
            {t('pages.promoCodes.dates-title')}
          </Typography>
          <Box display="flex" gap={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format={INPUT_DATE_FORMAT}
                value={values.validFrom}
                onChange={d => {
                  setValue('validFrom', d ? startOfDay(d) : null)
                }}
                maxDate={values.validTo}
                slotProps={{
                  textField: {
                    // @ts-expect-error no arbitrary props are allowed by types, which is wrong
                    'data-testid': 'valid-from',
                    label: t('pages.promoCodes.fld-validFrom-label'),
                    variant: 'filled',
                    fullWidth: true,
                    inputProps: {
                      'data-testid': 'fld-validFrom',
                    },
                    error: !!formState.errors.validFrom,
                    helperText:
                      formState.errors.validFrom?.message ??
                      t('pages.promoCodes.fld-validFrom-hint'),
                  },
                }}
                disabled={disabled}
              />
              <DatePicker
                format={INPUT_DATE_FORMAT}
                value={values.validTo}
                onChange={d => {
                  setValue('validTo', d ? endOfDay(d) : null)
                }}
                minDate={values.validFrom}
                slotProps={{
                  textField: {
                    label: t('pages.promoCodes.fld-validTo-label'),
                    variant: 'filled',
                    fullWidth: true,
                    inputProps: {
                      'data-testid': 'fld-validTo',
                    },
                    error: !!formState.errors.validTo,
                    helperText:
                      formState.errors.validTo?.message ??
                      t('pages.promoCodes.fld-validTo-hint'),
                  },
                }}
                disabled={disabled}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Stack>

      {!disabled ? (
        <>
          <Typography variant="body1" fontWeight="bold" mt={4}>
            {t('pages.promoCodes.new-section-usage')}
          </Typography>
          <Stack gap={2} flex={1} sx={{ p: 4, backgroundColor: '#fff' }}>
            {/* BOOKER SINGLE USE */}
            <Box>
              <FormControlLabel
                label={t('pages.promoCodes.fld-bookerSingleUse-label')}
                control={<Checkbox />}
                checked={values.bookerSingleUse}
                onChange={(_, on) => setValue('bookerSingleUse', on)}
                sx={{ userSelect: 'none' }}
              />
            </Box>

            {/* MAX USAGE */}
            <Box>
              <FormControlLabel
                label={t('pages.promoCodes.fld-limitBookings-label')}
                control={<Checkbox data-testid="fld-limitBookings" />}
                checked={limitBookings}
                onChange={limitBookingsChange}
                sx={{ userSelect: 'none' }}
              />
              {limitBookings ? (
                <TextField
                  variant="filled"
                  label={t('pages.promoCodes.fld-usesMax-label')}
                  inputProps={{ 'data-testid': 'fld-usesMax' }}
                  {...register('usesMax')}
                  error={!!formState.errors.usesMax}
                  helperText={formState.errors.usesMax?.message ?? ' '}
                  sx={{ display: 'block' }}
                />
              ) : null}
            </Box>
          </Stack>

          {isEdit && acl.canDisableDiscounts() ? (
            <>
              <Typography variant="body1" fontWeight="bold" mt={4}>
                {t('pages.promoCodes.disable-this-discount')}
              </Typography>
              <Stack gap={2} flex={1} sx={{ p: 4, backgroundColor: 'white' }}>
                <Typography variant="body2">
                  {t('pages.promoCodes.disable-description')}
                </Typography>

                <Box display="flex">
                  <Button
                    variant="outlined"
                    data-testid="btn-disable"
                    onClick={() => setShowDisableModal(true)}
                  >
                    {t('pages.promoCodes.disable-discount')}
                  </Button>
                </Box>
              </Stack>
            </>
          ) : null}

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button data-testid="btn-cancel" onClick={() => navigate('..')}>
              {t('cancel')}
            </Button>
            <LoadingButton
              variant="contained"
              type="submit"
              loading={
                disablePromoCodeLoading ||
                upsertPromoCodeLoading ||
                promocodesFetching
              }
              data-testid="btn-submit"
            >
              {isEdit
                ? t('common.save-details')
                : t('pages.promoCodes.new-submit')}
            </LoadingButton>
          </Box>
        </>
      ) : (
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            data-testid="btn-back"
            variant="outlined"
            onClick={() => navigate('..')}
          >
            {t('back')}
          </Button>
        </Box>
      )}

      {/* APPROVAL NEEDED */}
      <Dialog
        title={t('pages.promoCodes.approvalNeeded-title')}
        open={showApprovalNotice}
        onClose={() => setShowApprovalNotice(false)}
        showClose={false}
      >
        <Alert variant="outlined" severity="warning">
          {t('pages.promoCodes.approvalNeeded-intro')}
          <Box component="ul" pl={2}>
            <li data-testid={`approvalNeeded-reason-${values.type}`}>
              {t(`pages.promoCodes.approvalNeeded-reason-${values.type}`)}
            </li>
          </Box>
        </Alert>
        <Box
          sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
        >
          <Button
            variant="outlined"
            onClick={() => setShowApprovalNotice(false)}
          >
            {t('cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            loading={
              disablePromoCodeLoading ||
              upsertPromoCodeLoading ||
              promocodesFetching
            }
            onClick={upsertPromoCode}
          >
            {t('pages.promoCodes.approvalNeeded-submit')}
          </LoadingButton>
        </Box>
      </Dialog>

      <Dialog
        title={t('pages.promoCodes.disable-modal-title', { code: values.code })}
        open={showDisableModal}
        onClose={() => setShowDisableModal(false)}
        showClose={false}
        minWidth={500}
      >
        <Typography variant="body2">
          {t('pages.promoCodes.disable-modal-description')}
        </Typography>
        <Box
          sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
        >
          <Button variant="outlined" onClick={() => setShowDisableModal(false)}>
            {t('cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            loading={disablePromoCodeLoading || upsertPromoCodeLoading}
            onClick={disablePromoCode}
          >
            {t('pages.promoCodes.disable')}
          </LoadingButton>
        </Box>
      </Dialog>
    </Wrapper>
  )
}
