import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton, DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import {
  Box,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Radio,
  Button,
  FormHelperText,
  Checkbox,
  MenuItem,
  InputAdornment,
  Alert,
} from '@mui/material'
import { startOfDay, endOfDay } from 'date-fns'
import { omit } from 'lodash-es'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'

import { Dialog } from '@app/components/Dialog'
import { ProfileSelector } from '@app/components/ProfileSelector'
import { SelectCourses } from '@app/components/SelectCourses'
import { SelectLevels } from '@app/components/SelectLevels'
import { useAuth } from '@app/context/auth'
import { Promo_Code_Type_Enum } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { QUERY as GET_PROMOCODES } from '@app/queries/promo-codes/get-promo-codes'
import INSERT_PROMO_CODE from '@app/queries/promo-codes/insert-promo-code'
import { INPUT_DATE_FORMAT } from '@app/util'

import {
  DEFAULT_AMOUNT_PER_TYPE,
  FormInputs,
  schema,
  requiresApproval,
  APPLIES_TO,
  AMOUNT_PRESETS,
  AMOUNT_PRESET_VALUE,
} from './helpers'
import { Wrapper } from './Wrapper'

export const NewDiscount: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const fetcher = useFetcher()

  const [saving, setSaving] = useState(false)

  const { profile } = useAuth()
  const [createdBy, setCreatedBy] = useState(profile)

  const amountInputRef = useRef<HTMLInputElement>()
  const [amountPreset, setAmountPreset] = useState(AMOUNT_PRESETS.FIVE)

  const [limitBookings, setLimitBookings] = useState(false)

  const [showApprovalNotice, setShowApprovalNotice] = useState(false)

  const minDate = startOfDay(new Date())

  const {
    register,
    watch,
    formState,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema({ t, minDate })),
    defaultValues: {
      code: '',
      description: '',
      type: Promo_Code_Type_Enum.Percent,
      amount: DEFAULT_AMOUNT_PER_TYPE[Promo_Code_Type_Enum.Percent],
      appliesTo: APPLIES_TO.ALL,
      levels: [],
      courses: [],
      validFrom: minDate,
      validTo: null,
      usesMax: null,
      bookerSingleUse: true,
      createdBy: profile?.id,
    },
  })

  const values = watch()
  const appliesToRadio = values.appliesTo

  const checkDuplicateCode = useDebouncedCallback(async () => {
    try {
      const where = { code: { _eq: values.code } }
      const { promoCodes } = await fetcher(GET_PROMOCODES, { where })
      if (promoCodes.length) {
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
    if (createdBy) setValue('createdBy', createdBy.id)
    else setCreatedBy(profile)
  }, [createdBy, setCreatedBy, setValue, profile])

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
        label={t(`pages.promoCodes.type-${value}`)}
        data-testid={`discount-type-${value}`}
        control={
          <Radio
            value={value}
            checked={values.type === value}
            onChange={typeRadioChange}
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
          />
        }
      />
    )
  }

  const limitBookingsChange = (_: unknown, checked: boolean) => {
    setLimitBookings(checked)
    setValue('usesMax', checked ? 1 : null)
  }

  const insertPromoCode = async () => {
    setSaving(true)

    try {
      const promoCode = omit(values, 'appliesTo')
      await fetcher(INSERT_PROMO_CODE, { promoCode })
      return navigate('..')
    } catch (err) {
      console.error((err as Error).message)
    }

    setSaving(false)
  }

  const onSubmitValid = async () => {
    if (requiresApproval(values)) {
      setShowApprovalNotice(true)
    } else {
      return insertPromoCode()
    }
  }

  return (
    <Wrapper onSubmit={handleSubmit(onSubmitValid)}>
      <Typography variant="body1" fontWeight="bold">
        {t('pages.promoCodes.new-section-general')}
      </Typography>
      <Stack gap={3} flex={1} sx={{ p: 4, backgroundColor: '#fff' }}>
        {/* CREATED BY */}
        <Box>
          <Typography fontWeight="bold">
            {t('pages.promoCodes.fld-createdBy-label')}
          </Typography>
          <ProfileSelector value={createdBy} onChange={setCreatedBy} />
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
                variant="filled"
                inputProps={{
                  inputMode: 'numeric',
                  'data-testid': 'fld-amount-freeplaces',
                }}
                {...register('amount')}
                error={!!formState.errors.amount}
                sx={{ maxWidth: 130 }}
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
          ) : null}
          {appliesToRadio === APPLIES_TO.COURSES ? (
            <>
              <SelectCourses
                value={values.courses}
                onChange={ev => setValue('courses', ev.target.value)}
                titleHint={t('pages.promoCodes.selectCourses-titleHint')}
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
                inputFormat={INPUT_DATE_FORMAT}
                value={values.validFrom}
                onChange={d => {
                  setValue('validFrom', d ? startOfDay(d) : null)
                }}
                minDate={minDate}
                maxDate={values.validTo}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={t('pages.promoCodes.fld-validFrom-label')}
                    variant="filled"
                    fullWidth
                    inputProps={{
                      ...params.inputProps,
                      'data-testid': 'fld-validFrom',
                    }}
                    error={!!formState.errors.validFrom}
                    helperText={
                      formState.errors.validFrom?.message ??
                      t('pages.promoCodes.fld-validFrom-hint')
                    }
                  />
                )}
              />
              <DatePicker
                inputFormat={INPUT_DATE_FORMAT}
                value={values.validTo}
                onChange={d => {
                  setValue('validTo', d ? endOfDay(d) : null)
                }}
                minDate={values.validFrom}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={t('pages.promoCodes.fld-validTo-label')}
                    variant="filled"
                    fullWidth
                    inputProps={{
                      ...params.inputProps,
                      'data-testid': 'fld-validTo',
                    }}
                    error={!!formState.errors.validTo}
                    helperText={
                      formState.errors.validTo?.message ??
                      t('pages.promoCodes.fld-validTo-hint')
                    }
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Stack>

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

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button data-testid="btn-cancel" onClick={() => navigate('..')}>
          {t('cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          type="submit"
          loading={saving}
          data-testid="btn-submit"
        >
          {t('pages.promoCodes.new-submit')}
        </LoadingButton>
      </Box>

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
            loading={saving}
            onClick={insertPromoCode}
          >
            {t('pages.promoCodes.approvalNeeded-submit')}
          </LoadingButton>
        </Box>
      </Dialog>
    </Wrapper>
  )
}
