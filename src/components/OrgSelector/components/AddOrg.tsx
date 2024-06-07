import { yupResolver } from '@hookform/resolvers/yup'
import InfoIcon from '@mui/icons-material/Info'
import { LoadingButton } from '@mui/lab'
import { Button, TextField, Tooltip, Grid, Typography } from '@mui/material'
import { CountryCode } from 'libphonenumber-js'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useEffect, useMemo, FC, PropsWithChildren, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries, {
  ExceptionsCountriesCode,
  UKsCountriesCode,
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { CountryDropdown } from '@app/components/CountryDropdown/CountryDropdown'
import { Dialog } from '@app/components/dialogs'
import { OrganisationSectorDropdown } from '@app/components/OrganisationSectorDropdown'
import { isDfeSuggestion } from '@app/components/OrgSelector/utils'
import { OrgTypeSelector } from '@app/components/OrgTypeSelector'
import {
  InsertOrgLeadMutation,
  InsertOrgLeadMutationVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { CreateNewOrgType } from '@app/pages/common/AutoRegister/components/Form'
import { MUTATION as INSERT_ORG_MUTATION } from '@app/queries/organization/insert-org-lead'
import { yup } from '@app/schemas'
import { Address, Establishment } from '@app/types'
import { isValidUKPostalCode } from '@app/util'

type Props = {
  onSuccess: (org: InsertOrgLeadMutation['org']) => void
  onClose: VoidFunction
  option: Establishment | { name: string }
  countryCode: CountryCode | UKsCountriesCode | ExceptionsCountriesCode
  isNewUser?: boolean
  storeNewOrgData?: (value: CreateNewOrgType) => void
}

type FormInput = {
  id?: string | null
  organisationName: string
  sector: string
  organisationType: string
  orgTypeSpecifyOther?: string
  organisationEmail: string
  addressLine1: string
  addressLine2: string
  city: string
  postCode: string
  country: string
  countryCode: string
}

export const AddOrg: FC<PropsWithChildren<Props>> = function ({
  option,
  countryCode,
  onSuccess,
  onClose,
  isNewUser,
  storeNewOrgData,
}) {
  const { t, _t } = useScopedTranslation('components.add-organisation')
  const [{ data: organisationData, fetching: loading }, insertOrganisation] =
    useMutation<InsertOrgLeadMutation, InsertOrgLeadMutationVariables>(
      INSERT_ORG_MUTATION
    )
  const addOrgCountriesSelectorEnabled = useFeatureFlagEnabled(
    'add-organization-country'
  )

  const { getLabel: getCountryLabel, isUKCountry } = useWorldCountries()

  const [isInUK, setIsInUK] = useState(isUKCountry(countryCode))
  const [specifyOther, setSpecifyOther] = useState(false)

  const schema = useMemo(() => {
    return yup.object({
      organisationName: yup.string().required(
        _t('validation-errors.required-field', {
          name: t('fields.organisation-name'),
        })
      ),
      sector: yup.string().required(
        _t('validation-errors.required-field', {
          name: t('fields.sector'),
        })
      ),
      organisationType: yup.string().required(
        _t('validation-errors.required-field', {
          name: t('fields.organisation-type'),
        })
      ),
      orgTypeSpecifyOther: yup.string().when('specifyOther', {
        is: true,
        then: ot =>
          ot.required(
            _t('validation-errors.required-field', {
              name: t('fields.organisation-specify-other'),
            })
          ),
      }),
      organisationEmail: yup
        .string()
        .required(
          _t('validation-errors.required-field', {
            name: t('fields.organisation-email'),
          })
        )
        .email(_t('validation-errors.email-invalid')),
      addressLine1: yup.string().required(
        _t('validation-errors.required-field', {
          name: t('fields.primary-address-line'),
        })
      ),
      addressLine2: yup.string(),
      city: yup.string().required(
        _t('validation-errors.required-composed-field', {
          field1: t('fields.addresses.town'),
          field2: t('fields.addresses.city'),
        })
      ),
      ...(addOrgCountriesSelectorEnabled
        ? {
            ...(isInUK
              ? {
                  postCode: yup
                    .string()
                    .required(
                      _t('validation-errors.required-field', {
                        name: t('fields.postCode'),
                      })
                    )
                    .test(
                      'is-uk-postcode',
                      _t('validation-errors.invalid-postcode'),
                      isValidUKPostalCode
                    ),
                }
              : {
                  postCode: yup.string(),
                }),
          }
        : {
            postCode: yup
              .string()
              .required(
                _t('validation-errors.required-field', {
                  name: t('fields.postCode'),
                })
              )
              .test(
                'is-uk-postcode',
                _t('validation-errors.invalid-postcode'),
                isValidUKPostalCode
              ),
          }),

      country: yup.string().required(
        _t('validation-errors.required-field', {
          name: t('fields.country'),
        })
      ),
    })
  }, [_t, addOrgCountriesSelectorEnabled, isInUK, t])

  const defaultValues: Partial<FormInput> = isDfeSuggestion(option)
    ? {
        organisationName: option.name,
        addressLine1: option.addressLineOne ?? '',
        addressLine2: option.addressLineTwo ?? '',
        city: option.town ?? '',
        country: getCountryLabel(countryCode),
        countryCode: countryCode,
        postCode: option.postcode ?? '',
        sector: '',
        organisationType: '',
      }
    : {
        organisationName: option.name,
        addressLine1: '',
        sector: '',
        addressLine2: '',
        city: '',
        country: getCountryLabel(countryCode),
        countryCode: countryCode,
        organisationType: '',
        postCode: '',
      }

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
    const vars = {
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
        ...(isDfeSuggestion(option)
          ? {
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
    }

    if (isNewUser && storeNewOrgData) {
      const payload = { ...vars, id: null }
      storeNewOrgData(payload)
      onClose()
      return
    }

    await insertOrganisation(vars)
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
        values.organisationType?.toLocaleLowerCase() === 'other'
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
            {addOrgCountriesSelectorEnabled ? (
              <CountriesSelector
                onChange={(_, code) => {
                  if (code) {
                    setValue(
                      'country',
                      getCountryLabel(code as WorldCountriesCodes) ?? ''
                    )
                    setValue('countryCode', code)
                    setIsInUK(isUKCountry(code as CountryCode))
                  }
                }}
                value={values.countryCode}
              />
            ) : (
              <CountryDropdown
                register={register('country')}
                required
                error={Boolean(errors.country)}
                errormessage={errors.country?.message}
                value={values.country}
                label={t('fields.residing-country')}
              />
            )}
          </Grid>
          <Grid item>
            <TextField
              id="primaryAddressLine"
              label={t('fields.primary-address-line')}
              variant="filled"
              error={!!errors.addressLine1}
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
              label={isInUK ? t('fields.postCode') : t('fields.zipCode')}
              variant="filled"
              error={!!errors.postCode}
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
