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
import { PropsWithChildren, FC, useMemo, useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { CombinedError } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { CountryDropdown } from '@app/components/CountryDropdown'
import { FormPanel } from '@app/components/FormPanel'
import { OrganisationSectorDropdown } from '@app/components/OrganisationSectorDropdown'
import { CallbackOption, OrgSelector } from '@app/components/OrgSelector'
import {
  isXeroSuggestion,
  isDfeSuggestion,
  getOfstedRating,
} from '@app/components/OrgSelector/utils'
import { OrgTypeSelector } from '@app/components/OrgTypeSelector'
import { RegionDropdown } from '@app/components/RegionDropdown'
import { Sticky } from '@app/components/Sticky'
import { Organization } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { OfstedRating } from '@app/types'
import { INPUT_DATE_FORMAT } from '@app/util'

import { FormInputs, defaultValues, getFormSchema } from '../shared'

type Props = {
  isEditMode?: boolean
  onSubmit: (data: FormInputs) => void
  setXeroId?: (id: string | undefined) => void
  error?: CombinedError | undefined
  loading?: boolean
  editOrgData?: Partial<Organization>
}
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
  const schema = useMemo(() => getFormSchema(t, _t), [t, _t])
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    trigger,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues,
  })
  const values = watch()

  const onOrgSelected = useCallback(
    async (org: CallbackOption) => {
      const orgDataMap = new Map()
      !isEditMode && setXeroId
        ? setXeroId(
            org && isXeroSuggestion(org) ? (org.xeroId as string) : undefined
          )
        : null
      setValue('name', org?.name ?? '', { shouldValidate: true })
      if (isDfeSuggestion(org)) {
        Object.keys(values).map(async key => {
          if (key === 'ofstedLastInspection') {
            orgDataMap.set(
              key,
              org.ofstedLastInspection
                ? new Date(org.ofstedLastInspection)
                : null
            )
          }
          switch (key) {
            case 'addressLine1':
              return orgDataMap.set(key, org.addressLineOne ?? '')
            case 'addressLine2':
              return orgDataMap.set(key, org.addressLineTwo ?? '')
            case 'settingName':
              return orgDataMap.set(key, org.headJobTitle ?? '')
            case 'country':
              return orgDataMap.set(key, _t('UK'))
            case 'city':
              return orgDataMap.set(key, org.town ?? '')
            case 'ofstedLastInspection':
              return orgDataMap.set(
                key,
                org.ofstedLastInspection
                  ? new Date(org.ofstedLastInspection)
                  : null
              )
            case 'ofstedRating':
              return orgDataMap.set(key, getOfstedRating(org.ofstedRating))
            case 'name':
              return orgDataMap.set(key, org.name)
            default:
              null
          }
          orgDataMap.set(key, org[key as keyof CallbackOption] ?? '')
        })
        Array.from(orgDataMap).forEach(([key, value]) => {
          setValue(key, value, { shouldValidate: true })
        })
        await trigger()
      }
    },
    [_t, isEditMode, setValue, setXeroId, trigger, values]
  )
  useEffect(() => {
    if (editOrgData && isEditMode) {
      Object.entries(editOrgData).forEach(([key, value]) => {
        setValue(key as keyof FormInputs, value)
      })
    }
  }, [isEditMode, editOrgData, setValue])
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
                        required
                        {...register('name')}
                        error={errors.name?.message}
                        allowAdding
                        autocompleteMode={true}
                        onChange={onOrgSelected}
                        textFieldProps={{
                          variant: 'filled',
                        }}
                      />
                    ) : (
                      <TextField
                        required
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
                      value={values.sector ?? ''}
                      error={errors.sector?.message}
                      register={{ ...register('sector') }}
                      label={t('fields.organization-sector')}
                    />
                  </Grid>

                  <Grid item>
                    {(values.sector || '').toLowerCase() !== 'other' ? (
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
                  <Grid item>
                    <TextField
                      id="orgPhone"
                      label={t('fields.organization-phone')}
                      variant="filled"
                      error={!!errors.orgPhone}
                      helperText={errors.orgPhone?.message}
                      {...register('orgPhone')}
                      inputProps={{ 'data-testid': 'org-phone' }}
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
            {/* ORGANISATION ADDRESSES */}
            <>
              <Typography variant="subtitle1">
                {t('organization-address')}
              </Typography>

              <FormPanel>
                <Grid container gap={3} flexDirection={'column'}>
                  <Grid item>
                    <TextField
                      id="line1"
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
                      label={t('fields.addresses.city')}
                      variant="filled"
                      placeholder={t('fields.addresses.city')}
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
                      label={t('fields.addresses.postcode')}
                      variant="filled"
                      placeholder={t('fields.addresses.postcode')}
                      error={!!errors.postcode}
                      helperText={errors.postcode?.message}
                      InputLabelProps={{
                        shrink: Boolean(values.postcode),
                      }}
                      {...register('postcode')}
                      inputProps={{ 'data-testid': 'postCode' }}
                      fullWidth
                      required
                      InputProps={{
                        endAdornment: (
                          <Tooltip
                            title={_t('post-code-tooltip')}
                            data-testid="post-code-tooltip"
                          >
                            <InfoIcon color={'action'} />
                          </Tooltip>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <CountryDropdown
                      error={Boolean(errors.country)}
                      errormessage={errors.country?.message}
                      {...register('country')}
                      required
                      value={values.country ?? ''}
                      label={t('fields.addresses.country')}
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
                {t('head-of-service-org-details')}
              </Typography>
              <Box bgcolor="common.white" p={3} pb={1} mb={4} borderRadius={1}>
                <Grid container spacing={3} mb={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      id="headFirstName"
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
                      label={t('fields.head-email-address')}
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
                  <Grid item>
                    <TextField
                      id="settingName"
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

                  <Grid item>
                    <RegionDropdown
                      country={values.country}
                      onChange={value =>
                        setValue('localAuthority', value as string)
                      }
                      value={values.localAuthority ?? null}
                      label={t('fields.local-authority')}
                      disabled={Boolean(!values.country)}
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
                            select
                            label={t('fields.ofsted-rating')}
                            variant="filled"
                            error={!!errors.ofstedRating}
                            helperText={errors.ofstedRating?.message}
                            value={field.value}
                            onChange={field.onChange}
                            data-testid="ofsted-rating-select"
                            fullWidth
                          >
                            {Object.keys(OfstedRating).map(option => (
                              <MenuItem
                                key={option}
                                value={option}
                                data-testid={`ofsted-rating-option-${option}`}
                              >
                                {_t(`ofsted-rating.${option.toLowerCase()}`)}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <Controller
                        name="ofstedLastInspection"
                        control={control}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              format={INPUT_DATE_FORMAT}
                              value={field.value}
                              onChange={field.onChange}
                              slotProps={{
                                textField: {
                                  error: !!errors.ofstedRating,
                                  helperText: errors.ofstedRating?.message,
                                  label: t(
                                    'fields.ofsted-last-inspection-date'
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
