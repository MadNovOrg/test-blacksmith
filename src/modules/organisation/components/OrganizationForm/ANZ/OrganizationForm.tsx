import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Alert,
  Button,
  FormHelperText,
  useTheme,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { CountryCode } from 'libphonenumber-js'
import {
  PropsWithChildren,
  FC,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { CombinedError } from 'urql'

import { BackButton } from '@app/components/BackButton'
import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { FormPanel } from '@app/components/FormPanel'
import { OrganisationSectorDropdown } from '@app/components/OrganisationSectorDropdown/ANZ'
import { OrgSelector } from '@app/components/OrgSelector/ANZ'
import {
  isXeroSuggestion,
  CallbackOption,
} from '@app/components/OrgSelector/ANZ/utils'
import { OrgTypeSelector } from '@app/components/OrgTypeSelector'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { Organization } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useOrgType } from '@app/modules/organisation/hooks/useOrgType'
import {
  FormInputs,
  defaultValues,
  getFormSchema,
} from '@app/modules/organisation/utils/ANZ'
import PhoneNumberInput, {
  DEFAULT_AUSTRALIA_PHONE_COUNTRY,
} from '@app/modules/profile/components/PhoneNumberInput'

import { RegionSelector } from '../../RegionSelector/RegionSelector'

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
    mainOrgName?: string
    affiliatedOrgCount?: number
  }
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

  const { acl } = useAuth()
  const isAustraliaRegion = acl.isAustralia()

  const { getLabel: getCountryLabel } = useWorldCountries()

  const [specifyOtherOrgType, setSpecifyOtherOrgType] = useState<boolean>(false)
  const [sectorState, setSectorState] = useState<string | undefined | null>(
    editOrgData?.sector,
  )

  const [orgTypeListLoaded, setOrgTypeListLoaded] = useState<boolean>(false)
  const [linkToMainOrg, setLinkToMainOrg] = useState<boolean>(
    isEditMode ? Boolean(editOrgData?.main_organisation_id) : true,
  )

  defaultValues.country =
    getCountryLabel(defaultValues.countryCode as CountryCode) ?? ''

  const schema = useMemo(
    () => getFormSchema(t, _t, linkToMainOrg),
    [t, _t, linkToMainOrg],
  )
  const {
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
  const { data: orgTypes } = useOrgType(values.sector, true)

  const mainOrganisation: Pick<Organization, 'id' | 'name'> = {
    id: values.mainOrgId ?? '',
    name: values.mainOrgName ?? '',
  }

  const onOrgInputChange = useCallback(
    (value: string) => {
      setValue('name', value ?? '', { shouldValidate: true })
    },
    [setValue],
  )

  const onMainOrgInputChange = useCallback(
    (value: string) => {
      setValue('mainOrgName', value ?? '', { shouldValidate: true })
    },
    [setValue],
  )
  const handleCheckboxChange = useCallback(() => {
    setLinkToMainOrg(!linkToMainOrg)
    if (!linkToMainOrg) {
      setValue('mainOrgId', '')
      setValue('mainOrgName', '')
    }
  }, [linkToMainOrg, setValue])

  const onOrgSelected = useCallback(
    async (org: CallbackOption) => {
      if (!isEditMode && setXeroId) {
        setXeroId(
          org && isXeroSuggestion(org) ? (org.xeroId as string) : undefined,
        )
      }

      setValue('name', org?.name ?? '', { shouldValidate: true })
    },
    [isEditMode, setValue, setXeroId],
  )
  const onMainOrgSelected = useCallback(
    async (org: CallbackOption) => {
      setValue('mainOrgId', org?.id ?? '')
      setValue('mainOrgName', org?.name ?? '', { shouldValidate: true })
    },
    [setValue],
  )

  useEffect(() => {
    if (schema && errors.postcode) {
      trigger('postcode')
    }
  }, [errors.postcode, schema, trigger])

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
      }
    }
  }, [isEditMode, editOrgData, setValue])
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

  const isMainOrg = Boolean(editOrgData?.affiliatedOrgCount)
  const isAffiliatedOrg = Boolean(editOrgData?.main_organisation_id)

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
                    <CountriesSelector
                      disabled={isEditMode && (isMainOrg || isAffiliatedOrg)}
                      onlyUKCountries={false}
                      onChange={(_, code) => {
                        if (code) {
                          setValue(
                            'country',
                            getCountryLabel(code as WorldCountriesCodes) ?? '',
                          )
                          setValue('countryCode', code)
                          setValue('region', '', { shouldValidate: true })
                        }
                      }}
                      value={values.countryCode}
                    />
                  </Grid>
                  {isMainOrg ? (
                    <Alert
                      severity="warning"
                      sx={{ backgroundColor: '#fdedb5' }}
                    >
                      {t('edit-main-with-affiliate-warning')}
                    </Alert>
                  ) : null}
                  {isAffiliatedOrg ? (
                    <Alert
                      severity="warning"
                      sx={{ backgroundColor: '#fdedb5' }}
                    >
                      {t('edit-affiliated-warning')}
                    </Alert>
                  ) : null}
                  <RegionSelector
                    countryCode={values.countryCode}
                    error={Boolean(errors.region)}
                    errormessage={errors.region?.message}
                    register={register('region')}
                    required
                    value={values.region ?? ''}
                  />
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
                      label={t(
                        `fields.addresses.${
                          isAustraliaRegion ? 'postcode' : 'postalAndZipCode'
                        }`,
                      )}
                      variant="filled"
                      placeholder={t(
                        `fields.addresses.${
                          isAustraliaRegion ? 'postcode' : 'postalAndZipCode'
                        }`,
                      )}
                      error={!!errors.postcode}
                      helperText={errors.postcode?.message}
                      {...register('postcode')}
                      inputProps={{ 'data-testid': 'postCode' }}
                      fullWidth
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
                        showDfeResults={false}
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        onClick={handleCheckboxChange}
                        checked={linkToMainOrg}
                        data-testid="link-to-main-org-checkbox"
                        disabled={isEditMode}
                      />
                    }
                    label={t('fields.link-to-main-organisation')}
                  />
                  {linkToMainOrg ? (
                    <OrgSelector
                      data-testid="main-org"
                      label={t('fields.select-main-organisation')}
                      required
                      value={mainOrganisation}
                      {...register('mainOrgName')}
                      error={errors.mainOrgName?.message}
                      allowAdding
                      autocompleteMode={true}
                      onChange={onMainOrgSelected}
                      disabled={isEditMode}
                      onInputChange={onMainOrgInputChange}
                      textFieldProps={{
                        variant: 'filled',
                      }}
                      showDfeResults={false}
                      showOnlyMainOrgs={true}
                      allowedOrgCountryCode={values.countryCode}
                    />
                  ) : null}
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
                        international={true}
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
                      defaultCountry={DEFAULT_AUSTRALIA_PHONE_COUNTRY}
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
                  <Grid item mb={3}>
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
