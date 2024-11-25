import { yupResolver } from '@hookform/resolvers/yup'
import InfoIcon from '@mui/icons-material/Info'
import { LoadingButton } from '@mui/lab'
import {
  Button,
  TextField,
  Tooltip,
  Grid,
  Typography,
  Alert,
} from '@mui/material'
import { CountryCode } from 'libphonenumber-js'
import { useEffect, useMemo, FC, PropsWithChildren, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { useClient } from 'urql'
import { v4 as uuidv4 } from 'uuid'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries, {
  ExceptionsCountriesCode,
  UKsCountriesCode,
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { Dialog } from '@app/components/dialogs'
import { OrganisationSectorDropdown } from '@app/components/OrganisationSectorDropdown/UK'
import { isDfeSuggestion } from '@app/components/OrgSelector/UK/utils'
import { OrgTypeSelector } from '@app/components/OrgTypeSelector'
import {
  GetDfeRegisteredOrganisationQuery,
  GetDfeRegisteredOrganisationQueryVariables,
  InsertOrgLeadMutation,
  InsertOrgLeadMutationVariables,
} from '@app/generated/graphql'
import { useInsertNewOrganization } from '@app/hooks/useInsertNewOrganisationLead'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import PhoneNumberInput, {
  PhoneNumberSelection,
} from '@app/modules/profile/components/PhoneNumberInput'
import { Address, Establishment } from '@app/types'
import { saveNewOrganizationDataInLocalState } from '@app/util'

import { GET_DFE_REGISTERED_ORGANISATION } from './queries'
import {
  getSchema,
  getDefaultValues,
  AddNewOrganizationFormInputs as FormInput,
} from './utils'

type Props = {
  onSuccess: (org: InsertOrgLeadMutation['org']) => void
  onClose: VoidFunction
  option: Establishment | { name: string }
  countryCode: CountryCode | UKsCountriesCode | ExceptionsCountriesCode
}

export const AddOrg: FC<PropsWithChildren<Props>> = function ({
  option,
  countryCode,
  onSuccess,
  onClose,
}) {
  const { t, _t } = useScopedTranslation('components.add-organisation')
  const [
    { data: organisationData, fetching: loading, error },
    insertOrganisation,
  ] = useInsertNewOrganization()

  const { pathname } = useLocation()
  const client = useClient()

  const { getLabel: getCountryLabel, isUKCountry } = useWorldCountries()

  const [isInUK, setIsInUK] = useState(isUKCountry(countryCode))
  const [specifyOther, setSpecifyOther] = useState(false)
  const isDFESuggestion = isDfeSuggestion(option)

  const schema = getSchema({
    t: _t,
    isInUK,
    isDfeSuggestion: isDFESuggestion,
  })

  const defaultValues = useMemo(
    () => getDefaultValues({ option, countryCode, getCountryLabel }),
    [countryCode, getCountryLabel, option],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const values = watch()

  const onSubmit = async (data: FormInput) => {
    const vars: InsertOrgLeadMutationVariables = {
      name: data.organisationName,
      sector: data.sector,
      orgType: !specifyOther
        ? data.organisationType
        : (data.orgTypeSpecifyOther as string),
      address: {
        line1: data.addressLine1,
        line2: data.addressLine2,
        city: data.city,
        country: data.country,
        countryCode: data.countryCode,
        postCode: data.postCode,
      } as Address,
      attributes: {
        email: data.organisationEmail,
        ...(isDFESuggestion
          ? {
              phone: data.organisationPhoneNumber,
              localAuthority: option.localAuthority,
              headFirstName: option.headFirstName,
              headLastName: option.headLastName,
              headTitle: option.headTitle,
              headPreferredJobTitle: option.headJobTitle,
              ofstedRating: option.ofstedRating
                ?.toUpperCase()
                .replace(' ', '_'),
              ofstedLastInspection: option.ofstedLastInspection,
            }
          : null),
      },
      dfeId: isDFESuggestion ? option.id : undefined,
    }

    if (['/registration', '/auto-register'].includes(pathname)) {
      onClose()
      saveNewOrganizationDataInLocalState(vars)

      onSuccess({ id: uuidv4(), ...vars })
      return
    }

    if (isDFESuggestion) {
      await client
        .query<
          GetDfeRegisteredOrganisationQuery,
          GetDfeRegisteredOrganisationQueryVariables
        >(GET_DFE_REGISTERED_ORGANISATION, {
          name: data.organisationName,
          postcode: data.postCode,
        })
        .toPromise()
        .then(async organization => {
          if (!organization.data?.dfe_establishment[0].registered) {
            await insertOrganisation(vars)
          } else
            onSuccess({
              id: organization.data.dfe_establishment[0].organizations[0].id,
              ...vars,
            })
        })
    } else {
      await insertOrganisation(vars)
    }
  }

  useEffect(() => {
    if (schema && errors.postCode && !isInUK) {
      trigger('postCode')
    }
  }, [errors.postCode, isInUK, schema, trigger])

  useEffect(() => {
    setValue('organisationType', '')
  }, [setValue, values.sector])

  useEffect(() => {
    onSuccess(organisationData?.org)
  }, [onSuccess, organisationData?.org, organisationData?.org?.name])

  useEffect(() => {
    setSpecifyOther(
      values.sector !== 'other' &&
        values.organisationType?.toLocaleLowerCase() === 'other',
    )
  }, [setSpecifyOther, specifyOther, values.organisationType, values.sector])

  return (
    <Dialog
      open
      onClose={onClose}
      slots={{
        Title: () => <>{t('component-title')}</>,
      }}
      maxWidth={800}
    >
      <form noValidate autoComplete="off">
        <Typography mb={2}>{_t('org-address')}</Typography>
        <Grid container gap={3} mb={3} flexDirection={'column'}>
          <Grid item>
            <CountriesSelector
              onChange={(_, code) => {
                if (code) {
                  setValue(
                    'country',
                    getCountryLabel(code as WorldCountriesCodes) ?? '',
                  )
                  setValue('countryCode', code)
                  setIsInUK(isUKCountry(code as CountryCode))
                }
              }}
              value={values.countryCode}
              onlyUKCountries={isDFESuggestion}
            />
          </Grid>
          <Grid item>
            <TextField
              id="primaryAddressLine"
              label={t('fields.primary-address-line')}
              variant="filled"
              error={!!errors.addressLine1}
              disabled={Boolean(isDFESuggestion && defaultValues.addressLine1)}
              helperText={errors.addressLine1?.message}
              {...register('addressLine1')}
              inputProps={{ 'data-testid': 'addr-line2' }}
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <TextField
              id="secondaryAddressLine"
              label={t('fields.secondary-address-line')}
              disabled={Boolean(isDFESuggestion && defaultValues.addressLine2)}
              variant="filled"
              {...register('addressLine2')}
              inputProps={{ 'data-testid': 'addr-line2' }}
              fullWidth
            />
          </Grid>

          <Grid item>
            <TextField
              id="city"
              label={t('fields.city')}
              variant="filled"
              placeholder={t('addr.city')}
              error={!!errors.city}
              disabled={Boolean(isDFESuggestion && defaultValues.city)}
              helperText={errors.city?.message}
              {...register('city')}
              inputProps={{ 'data-testid': 'city' }}
              fullWidth
              required
            />
          </Grid>

          <Grid item>
            <TextField
              id={'postCode'}
              label={_t(
                'pages.create-organization.fields.addresses.postalAndZipCode',
              )}
              variant="filled"
              error={!!errors.postCode}
              disabled={Boolean(isDFESuggestion && defaultValues.postCode)}
              helperText={errors.postCode?.message}
              {...register('postCode')}
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

        <Typography mb={2}>{_t('org-details')}</Typography>
        <Grid
          sx={{ width: { md: 400, xs: '100%' } }}
          container
          flexDirection={'column'}
          gap={3}
        >
          <Grid item>
            <TextField
              id="organisationName"
              label={t('fields.organisation-name')}
              variant="filled"
              placeholder={t('org-name-placeholder')}
              error={!!errors.organisationName}
              disabled={Boolean(isDFESuggestion && defaultValues.city)}
              helperText={errors.organisationName?.message}
              {...register('organisationName')}
              inputProps={{ 'data-testid': 'org-name' }}
              autoFocus
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <OrganisationSectorDropdown
              register={{ ...register('sector') }}
              label={t('fields.sector')}
              required
              value={values.sector}
              error={errors.sector?.message}
            />
          </Grid>
          <Grid item>
            {values.sector !== 'other' ? (
              <OrgTypeSelector
                sector={values.sector}
                register={{ ...register('organisationType') }}
                label={t('fields.organisation-type')}
                required
                value={values.organisationType}
                disabled={!values.sector}
                error={errors.organisationType?.message}
                international={!isInUK}
              />
            ) : (
              <TextField
                id="sector"
                label={t('fields.organisation-type')}
                variant="filled"
                error={!!errors.organisationType}
                helperText={errors.organisationType?.message}
                {...register('organisationType')}
                inputProps={{ 'data-testid': 'org-type' }}
                fullWidth
                required
              />
            )}
          </Grid>
          {specifyOther ? (
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
            <TextField
              id="organisationEmail"
              label={t('fields.organisation-email')}
              variant="filled"
              error={!!errors.organisationEmail}
              helperText={errors.organisationEmail?.message}
              {...register('organisationEmail')}
              inputProps={{ 'data-testid': 'org-email' }}
              fullWidth
              required
            />
          </Grid>
          {isDFESuggestion ? (
            <Grid item>
              <PhoneNumberInput
                label={t('fields.organisation-phone')}
                variant="filled"
                sx={{ bgcolor: 'grey.100' }}
                inputProps={{
                  sx: { height: 40 },
                  'data-testid': 'org-phone',
                }}
                error={!!errors.organisationPhoneNumber}
                helperText={errors.organisationPhoneNumber?.message}
                value={{
                  phoneNumber: values.organisationPhoneNumber ?? '',
                  countryCode: '',
                }}
                onChange={({
                  phoneNumber,
                  countryCallingCode,
                }: PhoneNumberSelection) => {
                  setValue('countryCallingCode', `+${countryCallingCode}`)
                  setValue('organisationPhoneNumber', phoneNumber, {
                    shouldValidate: true,
                  })
                }}
                fullWidth
              />
            </Grid>
          ) : null}
          {error?.message ? (
            <Grid item>
              <Alert severity="error">
                <Typography>{t('already-exists')}</Typography>
              </Alert>
            </Grid>
          ) : null}
        </Grid>

        <Grid mt={3} display="flex" justifyContent="flex-end" item>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            {_t('cancel')}
          </Button>
          <LoadingButton
            loading={loading}
            data-testid="add-org-form-submit-btn"
            variant="contained"
            color="primary"
            sx={{ ml: 1 }}
            onClick={handleSubmit(onSubmit)}
          >
            {_t('submit')}
          </LoadingButton>
        </Grid>
      </form>
    </Dialog>
  )
}
