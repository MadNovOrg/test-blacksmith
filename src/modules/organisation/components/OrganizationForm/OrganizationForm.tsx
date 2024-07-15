import { yupResolver } from '@hookform/resolvers/yup'
import InfoIcon from '@mui/icons-material/Info'
import { LoadingButton } from '@mui/lab'
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Alert,
  Button,
  FormHelperText,
  useTheme,
  Tooltip,
} from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { CountryCode } from 'libphonenumber-js'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import {
  PropsWithChildren,
  FC,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { CombinedError } from 'urql'

import { BackButton } from '@app/components/BackButton'
import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { CountryDropdown } from '@app/components/CountryDropdown'
import { FormPanel } from '@app/components/FormPanel'
import { OrganisationSectorDropdown } from '@app/components/OrganisationSectorDropdown'
import { OrgSelector } from '@app/components/OrgSelector'
import {
  isXeroSuggestion,
  isDfeSuggestion,
  ofstedRating,
  CallbackOption,
} from '@app/components/OrgSelector/utils'
import { OrgTypeSelector } from '@app/components/OrgTypeSelector'
import { RegionDropdown } from '@app/components/RegionDropdown'
import { Sticky } from '@app/components/Sticky'
import { Dfe_Establishment, Organization } from '@app/generated/graphql'
import { useOrgType } from '@app/hooks/useOrgType'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import PhoneNumberInput from '@app/modules/profile/components/PhoneNumberInput'
import { OfstedRating } from '@app/types'
import { getTruthyObjectProps, INPUT_DATE_FORMAT } from '@app/util'

import {
  FormInputs,
  MapDfePropsToSchemaKeys,
  defaultValues,
  getFormSchema,
  mapDfePropsToSchema,
} from '../../utils'

type Props = {
  isEditMode?: boolean
  onSubmit: (data: FormInputs) => void
  setXeroId?: (id: string | undefined) => void
  setOtherOrgType?: (otherOrgType: boolean) => void
  error?: CombinedError | undefined
  loading?: boolean
  editOrgData?: Partial<Organization> & {
    country?: string
    countryCode?: string
    dfeEstablishment?: Partial<Dfe_Establishment> | null
  }
}

const OfstedRatingOrder = {
  0: OfstedRating.OUTSTANDING,
  1: OfstedRating.GOOD,
  2: OfstedRating.REQUIRES_IMPROVEMENT,
  3: OfstedRating.INADEQUATE,
  4: OfstedRating.SERIOUS_WEAKNESSES,
  5: OfstedRating.SPECIAL_MEASURES,
  6: OfstedRating.INSUFFICIENT_EVIDENCE,
}

type OfstedRatingOrderKey = keyof typeof OfstedRatingOrder

export const OrganizationForm: FC<PropsWithChildren<Props>> = ({
  isEditMode = false,
  onSubmit,
  setXeroId,
  error,
  loading,
  editOrgData,
}) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { t, _t } = useScopedTranslation('pages.create-organization')

  const addOrgCountriesSelectorEnabled =
    useFeatureFlagEnabled('add-organization-country') ?? true

  const {
    checkUKsCountryName,
    getLabel: getCountryLabel,
    getUKCountryCodeByCountryName,
    isUKCountry,
  } = useWorldCountries()

  const [isInUK, setIsInUK] = useState(true)
  const [specifyOtherOrgType, setSpecifyOtherOrgType] = useState<boolean>(false)
  const [sectorState, setSectorState] = useState<string | undefined | null>(
    editOrgData?.sector,
  )
  const [preFilledDfEProps, setPreFilledDfEProps] = useState<
    Set<keyof Dfe_Establishment>
  >(new Set<keyof Dfe_Establishment>())
  const [orgTypeListLoaded, setOrgTypeListLoaded] = useState<boolean>(false)
  defaultValues.country =
    getCountryLabel(defaultValues.countryCode as CountryCode) ?? ''

  const schema = useMemo(
    () => getFormSchema(t, _t, isInUK, addOrgCountriesSelectorEnabled),
    [t, _t, isInUK, addOrgCountriesSelectorEnabled],
  )
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    trigger,
    watch,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues,
  })
  const values = watch()

  const { data: orgTypes } = useOrgType(values.sector, !isInUK)

  const onOrgInputChange = useCallback(
    (value: string) => {
      if (values.dfeId) {
        ;[...preFilledDfEProps].forEach(key => {
          if (
            mapDfePropsToSchema.has(key as MapDfePropsToSchemaKeys) &&
            mapDfePropsToSchema.get(key as MapDfePropsToSchemaKeys)
          ) {
            setValue(
              mapDfePropsToSchema.get(
                key as MapDfePropsToSchemaKeys,
              ) as keyof FormInputs,
              defaultValues[
                mapDfePropsToSchema.get(key as MapDfePropsToSchemaKeys)!
              ],
              {
                shouldValidate: true,
              },
            )
          }
        })

        setPreFilledDfEProps(new Set())
        setValue('dfeId', null)
      }

      setValue('name', value ?? '', { shouldValidate: true })
    },
    [preFilledDfEProps, setValue, values.dfeId],
  )

  const onOrgSelected = useCallback(
    async (org: CallbackOption) => {
      const orgDataMap = new Map()

      if (!isEditMode && setXeroId) {
        setXeroId(
          org && isXeroSuggestion(org) ? (org.xeroId as string) : undefined,
        )
      }

      setValue('name', org?.name ?? '', { shouldValidate: true })

      if (isDfeSuggestion(org)) {
        Object.keys(values).map(async key => {
          if (key === 'ofstedLastInspection') {
            orgDataMap.set(
              key,
              org.ofstedLastInspection
                ? new Date(org.ofstedLastInspection)
                : null,
            )
          }
          switch (key) {
            case 'dfeId':
              return orgDataMap.set(key, org.id ?? null)
            case 'addressLine1':
              return orgDataMap.set(key, org.addressLineOne ?? '')
            case 'addressLine2':
              return orgDataMap.set(key, org.addressLineTwo ?? '')
            case 'settingName':
              return orgDataMap.set(key, org.headJobTitle ?? '')
            case 'countryCode':
              return
            case 'country':
              return
            case 'city':
              return orgDataMap.set(key, org.town ?? '')
            case 'headSurname':
              return orgDataMap.set(key, org.headLastName ?? '')
            case 'ofstedLastInspection':
              return orgDataMap.set(
                key,
                org.ofstedLastInspection
                  ? new Date(org.ofstedLastInspection)
                  : null,
              )
            case 'ofstedRating':
              return orgDataMap.set(
                key,
                org.ofstedRating !== undefined
                  ? (ofstedRating[
                      org.ofstedRating as keyof typeof ofstedRating
                    ] as string)
                  : '',
              )
            case 'name':
              return orgDataMap.set(key, org.name)
            default:
              null
          }
          orgDataMap.set(key, org[key as keyof CallbackOption] ?? '')

          setPreFilledDfEProps(
            getTruthyObjectProps<keyof Dfe_Establishment>(org),
          )
        })
        Array.from(orgDataMap).forEach(([key, value]) => {
          setValue(key, value, { shouldValidate: true })
        })
        await trigger()
      }
    },
    [isEditMode, setValue, setXeroId, trigger, values],
  )

  useEffect(() => {
    if (preFilledDfEProps.size === 0) {
      setValue('dfeId', null)
    }
  }, [preFilledDfEProps.size, setValue])

  useEffect(() => {
    if (schema && errors.postcode && !isInUK) {
      trigger('postcode')
    }
  }, [errors.postcode, isInUK, schema, trigger])

  useEffect(() => {
    if (editOrgData && isEditMode) {
      Object.entries(editOrgData).forEach(([key, value]) => {
        if (key === 'countryCode') {
          return
        }

        setValue(key as keyof FormInputs, value)
      })

      if (editOrgData.countryCode) {
        setValue('countryCode', editOrgData.countryCode)
        setIsInUK(isUKCountry(editOrgData.countryCode))
      } else if (
        editOrgData.country &&
        checkUKsCountryName(editOrgData.country)
      ) {
        const UKCountryCode = getUKCountryCodeByCountryName(editOrgData.country)
        if (UKCountryCode) {
          setValue('countryCode', UKCountryCode)
        }
        setIsInUK(true)
      }

      if (editOrgData.dfeEstablishment?.id) {
        setPreFilledDfEProps(getTruthyObjectProps(editOrgData.dfeEstablishment))
      }
    }
  }, [
    isEditMode,
    editOrgData,
    setValue,
    isUKCountry,
    checkUKsCountryName,
    getUKCountryCodeByCountryName,
  ])

  useEffect(() => {
    if (
      orgTypes &&
      orgTypes?.organization_type?.map(ot => ot.name).length >= 0 &&
      orgTypeListLoaded === false
    ) {
      setOrgTypeListLoaded(true)
      if (
        values?.sector?.toLocaleLowerCase() !== 'other' &&
        orgTypes?.organization_type
          .map(ot => ot.name)
          .includes(values.organisationType) &&
        values.organisationType?.toLocaleLowerCase() !== 'other'
      ) {
        setSpecifyOtherOrgType(false)
      } else if (values.organisationType === '') {
        setValue('orgTypeSpecifyOther', '')
        setValue('organisationType', '')
        setSpecifyOtherOrgType(false)
      } else {
        setSpecifyOtherOrgType(true)
        setValue('organisationType', 'Other')
        setValue('orgTypeSpecifyOther', editOrgData?.organisationType ?? '')
      }
    }
  }, [
    editOrgData?.organisationType,
    orgTypeListLoaded,
    orgTypes,
    setValue,
    values.organisationType,
    values?.sector,
  ])

  useEffect(() => {
    if (values.organisationType?.toLocaleLowerCase() === 'other') {
      setSpecifyOtherOrgType(true)
    } else {
      setSpecifyOtherOrgType(false)
    }
  }, [values.organisationType])

  useEffect(() => {
    if (values.sector && sectorState !== values.sector) {
      setValue('orgTypeSpecifyOther', '')
      setValue('organisationType', '')
      setSpecifyOtherOrgType(false)
      setSectorState(values.sector)
    }
  }, [
    values.sector,
    setValue,
    setSpecifyOtherOrgType,
    setSectorState,
    sectorState,
    values.organisationType,
  ])

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box
        display="flex"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        aria-autocomplete="none"
        sx={{ flexDirection: { md: 'row', xs: 'column' } }}
      >
        <Box width={400} display="flex" flexDirection="column" px={{ md: 6 }}>
          <Sticky top={20}>
            <Box mb={2}>
              <BackButton />
            </Box>
            <Box>
              <Typography variant="h2" mb={2}>
                {!isEditMode
                  ? t('add-new-organization')
                  : _t('pages.edit-org-details.title')}
              </Typography>
            </Box>
          </Sticky>
        </Box>

        <Box flex={1}>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            mt={{ md: 8, xs: 3 }}
          >
            {/* ORGANISATION ADDRESSES */}
            <>
              <Typography variant="subtitle1">
                {t('organization-address')}
              </Typography>

              <FormPanel>
                <Grid container gap={3} flexDirection={'column'}>
                  <Grid item>
                    {addOrgCountriesSelectorEnabled ? (
                      <CountriesSelector
                        onlyUKCountries={
                          Boolean(values.dfeId) || preFilledDfEProps.size > 0
                        }
                        onChange={(_, code) => {
                          if (code) {
                            setValue(
                              'country',
                              getCountryLabel(code as WorldCountriesCodes) ??
                                '',
                            )
                            setValue('countryCode', code)
                            setIsInUK(isUKCountry(code))

                            if (!isUKCountry(code)) {
                              setValue('localAuthority', '')
                              setValue('ofstedLastInspection', null)
                              setValue('ofstedRating', '')
                            }
                          }
                        }}
                        value={values.countryCode}
                      />
                    ) : (
                      <CountryDropdown
                        error={Boolean(errors.country)}
                        errormessage={errors.country?.message}
                        register={register('country')}
                        required
                        value={values.country ?? ''}
                        label={t('fields.addresses.country')}
                      />
                    )}
                  </Grid>
                  <Grid item>
                    <TextField
                      id="line1"
                      disabled={preFilledDfEProps.has('addressLineOne')}
                      label={t('fields.addresses.line1')}
                      variant="filled"
                      placeholder={t('fields.addresses.line1-placeholder')}
                      error={!!errors.addressLine1}
                      helperText={errors.addressLine1?.message}
                      InputLabelProps={{
                        shrink: Boolean(values.addressLine1),
                      }}
                      {...register('addressLine1')}
                      inputProps={{ 'data-testid': 'addr-line1' }}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="line2"
                      disabled={preFilledDfEProps.has('addressLineTwo')}
                      label={t('fields.addresses.line2')}
                      variant="filled"
                      placeholder={t('fields.addresses.line2-placeholder')}
                      error={!!errors.addressLine2}
                      InputLabelProps={{
                        shrink: Boolean(values.addressLine2),
                      }}
                      helperText={errors.addressLine2?.message}
                      {...register('addressLine2')}
                      inputProps={{ 'data-testid': 'addr-line2' }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="city"
                      disabled={preFilledDfEProps.has('town')}
                      label={t('fields.addresses.town-city')}
                      variant="filled"
                      placeholder={t('fields.addresses.town-city')}
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      InputLabelProps={{
                        shrink: Boolean(values.city),
                      }}
                      {...register('city')}
                      inputProps={{ 'data-testid': 'city' }}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="postcode"
                      disabled={preFilledDfEProps.has('postcode')}
                      label={t('fields.addresses.postalAndZipCode')}
                      variant="filled"
                      placeholder={t('fields.addresses.postalAndZipCode')}
                      error={!!errors.postcode}
                      helperText={errors.postcode?.message}
                      InputLabelProps={
                        isInUK
                          ? {
                              shrink: Boolean(values.postcode),
                            }
                          : {}
                      }
                      {...register('postcode')}
                      inputProps={{ 'data-testid': 'postCode' }}
                      fullWidth
                      required={isInUK}
                      InputProps={
                        isInUK
                          ? {
                              endAdornment: (
                                <Tooltip
                                  title={_t('post-code-tooltip')}
                                  data-testid="post-code-tooltip"
                                >
                                  <InfoIcon color={'action'} />
                                </Tooltip>
                              ),
                            }
                          : {}
                      }
                    />
                  </Grid>
                </Grid>
              </FormPanel>
            </>

            {/* ORGANISATION DETAILS */}
            <>
              <Typography variant="subtitle1">
                {t('organization-details')}
              </Typography>

              <FormPanel>
                <Grid container flexDirection={'column'} gap={3}>
                  <Grid item>
                    {!isEditMode ? (
                      <OrgSelector
                        data-testid="name"
                        disabled={
                          Boolean(editOrgData?.dfeEstablishment?.name) &&
                          preFilledDfEProps.has('name')
                        }
                        required
                        {...register('name')}
                        error={errors.name?.message}
                        allowAdding
                        autocompleteMode={true}
                        onChange={onOrgSelected}
                        onInputChange={onOrgInputChange}
                        textFieldProps={{
                          variant: 'filled',
                        }}
                        showDfeResults={isInUK}
                      />
                    ) : (
                      <TextField
                        required
                        disabled={
                          Boolean(editOrgData?.dfeEstablishment?.name) &&
                          preFilledDfEProps.has('name')
                        }
                        label={t('fields.organization-name')}
                        variant="filled"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        {...register('name')}
                        inputProps={{ 'data-testid': 'name' }}
                        fullWidth
                        value={values.name}
                      />
                    )}
                  </Grid>
                  <Grid item>
                    <OrganisationSectorDropdown
                      required
                      value={values.sector ?? sectorState}
                      error={errors.sector?.message}
                      register={{ ...register('sector') }}
                      label={t('fields.organization-sector')}
                    />
                  </Grid>

                  <Grid item>
                    {values.sector?.toLowerCase() !== 'other' ? (
                      <OrgTypeSelector
                        label={t('fields.organization-type')}
                        value={values.organisationType}
                        register={{ ...register('organisationType') }}
                        sector={values.sector}
                        disabled={!values.sector}
                        error={
                          errors.organisationType?.message && values.sector
                            ? errors.organisationType?.message
                            : undefined
                        }
                        required
                        international={!isUKCountry(values.countryCode)}
                      />
                    ) : (
                      <TextField
                        id="organisationType"
                        label={t('fields.organization-type-text-field')}
                        variant="filled"
                        error={!!errors.organisationType}
                        helperText={errors.organisationType?.message}
                        {...register('organisationType')}
                        inputProps={{ 'data-testid': 'organisationType' }}
                        fullWidth
                        required
                      />
                    )}
                  </Grid>
                  {specifyOtherOrgType ? (
                    <Grid item>
                      <TextField
                        id="orgTypeSpecifyOther"
                        label={t('fields.organisation-specify-other')}
                        variant="filled"
                        error={!!errors.orgTypeSpecifyOther}
                        helperText={errors.orgTypeSpecifyOther?.message}
                        {...register('orgTypeSpecifyOther')}
                        fullWidth
                        required
                      />
                    </Grid>
                  ) : null}
                  <Grid item>
                    <PhoneNumberInput
                      label={t('fields.organization-phone')}
                      variant="filled"
                      sx={{ bgcolor: 'grey.100' }}
                      inputProps={{
                        sx: { height: 40 },
                        'data-testid': 'org-phone',
                      }}
                      error={!!errors.orgPhone}
                      helperText={errors.orgPhone?.message}
                      value={{ phoneNumber: values.orgPhone, countryCode: '' }}
                      onChange={({ phoneNumber }) =>
                        setValue('orgPhone', phoneNumber, {
                          shouldValidate: true,
                        })
                      }
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="orgEmail"
                      label={t('fields.organization-email')}
                      variant="filled"
                      error={!!errors.orgEmail}
                      helperText={errors.orgEmail?.message}
                      {...register('orgEmail')}
                      inputProps={{ 'data-testid': 'org-email' }}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="website"
                      label={t('fields.organization-website')}
                      variant="filled"
                      error={!!errors.website}
                      helperText={errors.website?.message}
                      {...register('website')}
                      inputProps={{ 'data-testid': 'website' }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </FormPanel>
            </>

            {/* HEAD OF SERVICE */}
            <>
              <Typography variant="subtitle1">
                {t('additional-org-details')}
              </Typography>
              <Typography variant="subtitle2">
                {t('organisation-main-contact')}
              </Typography>
              <Box bgcolor="common.white" p={3} pb={1} mb={4} borderRadius={1}>
                <Grid container spacing={3} mb={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      id="headFirstName"
                      disabled={preFilledDfEProps.has('headFirstName')}
                      label={t('fields.head-first-name')}
                      variant="filled"
                      error={!!errors.headFirstName}
                      helperText={errors.headFirstName?.message}
                      InputLabelProps={{
                        shrink: Boolean(values.headFirstName),
                      }}
                      {...register('headFirstName')}
                      inputProps={{ 'data-testid': 'head-first-name' }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      id="headSurname"
                      disabled={preFilledDfEProps.has('headLastName')}
                      label={t('fields.head-surname')}
                      variant="filled"
                      error={!!errors.headSurname}
                      helperText={errors.headSurname?.message}
                      InputLabelProps={{
                        shrink: Boolean(values.headSurname),
                      }}
                      {...register('headSurname')}
                      inputProps={{ 'data-testid': 'head-last-name' }}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid
                  display={'flex'}
                  flexDirection={'column'}
                  container
                  gap={3}
                  width={'100%'}
                >
                  <Grid item>
                    <TextField
                      id="headEmailAddress"
                      label={t(
                        'fields.organisation-main-contact-email-address',
                      )}
                      variant="filled"
                      error={!!errors.headEmailAddress}
                      helperText={errors.headEmailAddress?.message}
                      InputLabelProps={{
                        shrink: Boolean(values.headEmailAddress),
                      }}
                      {...register('headEmailAddress')}
                      inputProps={{ 'data-testid': 'head-title' }}
                      fullWidth
                    />
                  </Grid>
                  <Grid
                    item
                    mb={isUKCountry(values.countryCode) ? undefined : 3}
                  >
                    <TextField
                      id="settingName"
                      disabled={preFilledDfEProps.has('headJobTitle')}
                      label={t('fields.setting-name')}
                      variant="filled"
                      error={!!errors.settingName}
                      helperText={errors.settingName?.message}
                      InputLabelProps={{
                        shrink: Boolean(values.settingName),
                      }}
                      {...register('settingName')}
                      inputProps={{ 'data-testid': 'head-preferred-job-title' }}
                      fullWidth
                    />
                  </Grid>

                  {isUKCountry(values.countryCode) ? (
                    <>
                      <Grid item>
                        <RegionDropdown
                          country={values.country}
                          onChange={value =>
                            setValue('localAuthority', value as string)
                          }
                          value={values.localAuthority ?? null}
                          label={t('fields.local-authority')}
                          disabled={
                            Boolean(!values.country) ||
                            preFilledDfEProps.has('localAuthority')
                          }
                        />
                      </Grid>
                      <Grid
                        sx={{ flexDirection: { md: 'row', xs: 'column' } }}
                        container
                        spacing={3}
                        mb={3}
                      >
                        <Grid item md={6}>
                          <Controller
                            name="ofstedRating"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                id="ofstedRating"
                                disabled={preFilledDfEProps.has('ofstedRating')}
                                select
                                label={t('fields.ofsted-rating')}
                                variant="filled"
                                error={!!errors.ofstedRating}
                                helperText={errors.ofstedRating?.message}
                                value={field.value}
                                onChange={field.onChange}
                                data-testid="ofsted-rating-select"
                                fullWidth
                                inputProps={{ 'data-testid': 'ofsted-rating' }}
                              >
                                {Object.keys(OfstedRating).map((val, i) => {
                                  const option = OfstedRatingOrder[
                                    i as OfstedRatingOrderKey
                                  ] as OfstedRating

                                  return (
                                    <MenuItem
                                      key={option}
                                      value={option}
                                      data-testid={`ofsted-rating-option-${option}`}
                                    >
                                      {_t(
                                        `ofsted-rating.${option.toLowerCase()}`,
                                      )}
                                    </MenuItem>
                                  )
                                })}
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name="ofstedLastInspection"
                            control={control}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  format={INPUT_DATE_FORMAT}
                                  value={field.value}
                                  onChange={field.onChange}
                                  disabled={preFilledDfEProps.has(
                                    'ofstedLastInspection',
                                  )}
                                  slotProps={{
                                    textField: {
                                      error: !!errors.ofstedLastInspection,
                                      helperText:
                                        errors.ofstedLastInspection?.message,
                                      label: t(
                                        'fields.ofsted-last-inspection-date',
                                      ),
                                      variant: 'filled',
                                      fullWidth: true,
                                    },
                                  }}
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </Grid>
                      </Grid>
                    </>
                  ) : null}
                </Grid>
              </Box>
            </>
            {/* ORGANISATION ADMIN DETAILS */}
            {!isEditMode ? (
              <>
                <Typography variant="subtitle1">
                  {t('organization-admin-details')}
                </Typography>

                <Typography variant="body1" color={theme.palette.grey[700]}>
                  {t('organization-admin-details-subtitle')}
                </Typography>

                <FormPanel>
                  <TextField
                    id="workEmail"
                    label={t('fields.work-email')}
                    variant="filled"
                    error={!!errors.workEmail}
                    helperText={errors.workEmail?.message}
                    {...register('workEmail')}
                    inputProps={{ 'data-testid': 'input-admin-email' }}
                    sx={{ bgcolor: 'grey.100' }}
                    fullWidth
                  />

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Box display="inline" fontWeight="600">
                      {`${_t('common.important')}: `}
                    </Box>
                    {t('email-alert')}
                  </Alert>
                </FormPanel>
              </>
            ) : null}
            {/* CTA */}
            <Grid
              container
              width="100%"
              display="flex"
              justifyContent="flex-end"
              gap={2}
            >
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => navigate(-1)}
              >
                {_t('common.cancel')}
              </Button>
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                color="primary"
                data-testid="create-org-form-submit-btn"
                size="large"
              >
                {_t('pages.create-organization.save-organization')}
              </LoadingButton>

              {error ? (
                <FormHelperText
                  sx={{ mt: 2 }}
                  error
                  data-testid="create-org-form-error"
                >
                  {error.message}
                </FormHelperText>
              ) : null}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
