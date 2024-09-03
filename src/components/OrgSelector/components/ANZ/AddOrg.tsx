import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Button, TextField, Grid, Typography } from '@mui/material'
import { CountryCode } from 'libphonenumber-js'
import { useEffect, useMemo, FC, PropsWithChildren, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries, {
  ExceptionsCountriesCode,
  UKsCountriesCode,
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { Dialog } from '@app/components/dialogs'
import { OrganisationSectorDropdown } from '@app/components/OrganisationSectorDropdown/ANZ'
import { OrgTypeSelector } from '@app/components/OrgTypeSelector'
import { useAuth } from '@app/context/auth'
import {
  InsertOrgLeadMutation,
  InsertOrgLeadMutationVariables,
} from '@app/generated/graphql'
import { useInsertNewOrganization } from '@app/hooks/useInsertNewOrganisationLead'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { RegionSelector } from '@app/modules/organisation/components/RegionSelector'
import { Address } from '@app/types'
import { saveNewOrganizationDataInLocalState } from '@app/util'

import { getSchema, getDefaultValues, FormInputs } from './utils'

type Props = {
  onSuccess: (org: InsertOrgLeadMutation['org']) => void
  onClose: VoidFunction
  orgName: string
  countryCode: CountryCode | UKsCountriesCode | ExceptionsCountriesCode
}

export const AddOrg: FC<PropsWithChildren<Props>> = function ({
  orgName,
  countryCode,
  onSuccess,
  onClose,
}) {
  const { t, _t } = useScopedTranslation('components.add-organisation')
  const [{ data: organisationData, fetching: loading }, insertOrganisation] =
    useInsertNewOrganization()
  const { acl } = useAuth()
  const isAustraliaRegion = acl.isAustralia()

  const { pathname } = useLocation()

  const { getLabel: getCountryLabel } = useWorldCountries()
  const [specifyOther, setSpecifyOther] = useState(false)
  const schema = getSchema({
    t: _t,
  })

  const defaultValues = useMemo(
    () => getDefaultValues({ orgName, countryCode, getCountryLabel }),
    [countryCode, getCountryLabel, orgName],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const values = watch()

  const onSubmit = async (data: FormInputs) => {
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
        region: data.region,
      } as Address,
      attributes: {
        email: data.organisationEmail,
      },
    }

    if (['/registration', '/auto-register'].includes(pathname)) {
      onClose()
      saveNewOrganizationDataInLocalState(vars)

      onSuccess({ id: uuidv4(), ...vars })
      return
    }

    await insertOrganisation(vars)
  }

  useEffect(() => {
    if (schema && errors.postCode) {
      trigger('postCode')
    }
  }, [errors.postCode, schema, trigger])

  useEffect(() => {
    setValue('organisationType', '')
  }, [setValue, values.sector])

  useEffect(() => {
    onSuccess(organisationData?.org)
  }, [onSuccess, organisationData?.org, organisationData?.org?.name])

  useEffect(() => {
    setSpecifyOther(values.organisationType?.toLocaleLowerCase() === 'other')
  }, [setSpecifyOther, specifyOther, values.organisationType])

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
                  setValue('region', '', { shouldValidate: true })
                }
              }}
              value={values.countryCode}
              onlyUKCountries={false}
            />
          </Grid>
          <Grid item>
            <RegionSelector
              countryCode={values.countryCode}
              error={Boolean(errors.region)}
              errormessage={errors.region?.message}
              register={register('region')}
              required
              value={values.region ?? ''}
            />
          </Grid>
          <Grid item>
            <TextField
              id="primaryAddressLine"
              label={t('fields.primary-address-line')}
              variant="filled"
              error={!!errors.addressLine1}
              disabled={false}
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
              disabled={false}
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
              disabled={false}
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
                `pages.create-organization.fields.addresses.${
                  isAustraliaRegion ? 'postcode' : 'postalAndZipCode'
                }`,
              )}
              variant="filled"
              error={!!errors.postCode}
              disabled={false}
              helperText={errors.postCode?.message}
              {...register('postCode')}
              inputProps={{ 'data-testid': 'postCode' }}
              fullWidth
              required={false}
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
              disabled={false}
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
                international={true}
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
