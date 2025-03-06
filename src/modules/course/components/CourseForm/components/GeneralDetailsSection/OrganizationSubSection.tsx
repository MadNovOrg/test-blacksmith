import { Grid, Typography, TextField } from '@mui/material'
import { useCallback, useMemo, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useUpdateEffect } from 'react-use'
import { useQuery } from 'urql'

import { OrgSelector as ANZOrgSelector } from '@app/components/OrgSelector/ANZ'
import { OrgSelector as UKOrgSelector } from '@app/components/OrgSelector/UK'
import { CallbackOption, isHubOrg } from '@app/components/OrgSelector/UK/utils'
import {
  Profile as UserSelectorProfile,
  UserSelector,
} from '@app/components/UserSelector'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Type_Enum,
  GetNotDetailedProfileQuery,
  GetNotDetailedProfileQueryVariables,
  Org_Created_From_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { QUERY as GET_NOT_DETAILED_PROFILE } from '@app/modules/profile/queries/get-not-detailed-profile'
import { RoleName, type CourseInput } from '@app/types'

import { DisabledFields } from '../..'

type Props = {
  disabledFields: Set<DisabledFields>
}

export const OrganizationSubSection = ({ disabledFields }: Props) => {
  const { activeRole, acl } = useAuth()
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<CourseInput>()
  const { t, _t } = useScopedTranslation('components.course-form')
  const courseType = useWatch({ control, name: 'type' }) as Course_Type_Enum
  const accreditedBy = useWatch({ control, name: 'accreditedBy' })
  const organization = useWatch({ control, name: 'organization' })
  const [bookingContact, organizationKeyContact] = useWatch({
    control,
    name: ['bookingContact', 'organizationKeyContact'],
  })

  const isIndirectCourse = courseType === Course_Type_Enum.Indirect
  const isClosedCourse = courseType === Course_Type_Enum.Closed
  const isBild = accreditedBy === Accreditors_Enum.Bild
  const usesAOL =
    useWatch({ control, name: 'usesAOL' }) && isIndirectCourse && !isBild
  const hasOrg = [Course_Type_Enum.Closed, Course_Type_Enum.Indirect].includes(
    courseType,
  )
  const showTrainerOrgOnly =
    !usesAOL && isIndirectCourse && activeRole === RoleName.TRAINER

  const keyContactField: Record<
    Course_Type_Enum,
    'bookingContact' | 'organizationKeyContact' | null
  > = useMemo(() => {
    return {
      [Course_Type_Enum.Closed]: 'bookingContact',
      [Course_Type_Enum.Indirect]: 'organizationKeyContact',
      [Course_Type_Enum.Open]: null,
    }
  }, [])

  const currentContact: Record<
    Course_Type_Enum,
    typeof bookingContact | typeof organizationKeyContact | null
  > = useMemo(() => {
    return {
      [Course_Type_Enum.Closed]: bookingContact,
      [Course_Type_Enum.Indirect]: organizationKeyContact,
      [Course_Type_Enum.Open]: null,
    }
  }, [bookingContact, organizationKeyContact])

  const contactData = useRef({
    firstName: '',
    lastName: '',
    email: '',
  }).current

  const [{ data: foundProfileData }, reexecuteQuery] = useQuery<
    GetNotDetailedProfileQuery,
    GetNotDetailedProfileQueryVariables
  >({
    query: GET_NOT_DETAILED_PROFILE,
    variables: {
      where: { email: { _eq: currentContact[courseType]?.email } },
    },
    pause: true,
  })

  const handleOrgSelectorChange = useCallback(
    (org: CallbackOption) => {
      if (!org) {
        setValue('organization', null, {
          shouldValidate: true,
        })
        return
      }

      if (isHubOrg(org)) {
        setValue('organization', org, {
          shouldValidate: true,
        })
      }
    },
    [setValue],
  )

  const handleContactChange = useCallback(
    (field: 'bookingContact' | 'organizationKeyContact' = 'bookingContact') =>
      (value: string | UserSelectorProfile) => {
        const isEmail = typeof value === 'string'

        if (typeof value !== 'string') {
          Object.assign(contactData, {
            firstName: value?.givenName,
            lastName: value?.familyName,
            email: value?.email,
          })

          setValue(`${field}.firstName`, contactData.firstName, {
            shouldValidate: true,
          })
          setValue(`${field}.lastName`, contactData.lastName, {
            shouldValidate: true,
          })
          setValue(`${field}.email`, contactData.email, {
            shouldValidate: true,
          })
        } else {
          setValue(`${field}.email`, value, {
            shouldValidate: true,
          })
        }

        setValue(`${field}.profileId`, isEmail ? undefined : value?.id)
      },
    [contactData, setValue],
  )

  const onBlurUserSelector = useCallback(async () => {
    if (keyContactField[courseType]) {
      const isValidEmail =
        !errors[keyContactField[courseType]]?.email?.message &&
        currentContact[courseType]?.email

      const isNotAlreadyFetched = Boolean(
        !foundProfileData?.profiles.length ||
          (foundProfileData?.profiles.length &&
            foundProfileData?.profiles[0].email !==
              currentContact[courseType]?.email),
      )

      if (isValidEmail && isNotAlreadyFetched) {
        reexecuteQuery({ requestPolicy: 'network-only' })
      } else if (isValidEmail && !isNotAlreadyFetched) {
        const contactChange = handleContactChange(keyContactField[courseType])
        contactChange(foundProfileData?.profiles[0] as UserSelectorProfile)
      }
    }
  }, [
    currentContact,
    errors,
    foundProfileData?.profiles,
    handleContactChange,
    reexecuteQuery,
    courseType,
    keyContactField,
  ])

  useUpdateEffect(() => {
    if (keyContactField[courseType] && foundProfileData?.profiles.length) {
      const contactChange = handleContactChange(keyContactField[courseType])
      contactChange(foundProfileData?.profiles[0])
    }
  }, [foundProfileData])

  return (
    <>
      {hasOrg && (
        <>
          <Typography my={2} fontWeight={600}>
            {t('organization-label')}
          </Typography>
          {acl.isUK() ? (
            <UKOrgSelector
              required
              {...register('organization')}
              autocompleteMode={showTrainerOrgOnly}
              showTrainerOrgOnly={showTrainerOrgOnly}
              error={errors.organization?.message}
              allowAdding
              value={organization ?? undefined}
              onChange={handleOrgSelectorChange}
              textFieldProps={{
                variant: 'filled',
              }}
              sx={{ marginBottom: 2 }}
              disabled={disabledFields.has('organization')}
              createdFrom={Org_Created_From_Enum.CreateCoursePage}
            />
          ) : (
            <ANZOrgSelector
              required
              {...register('organization')}
              autocompleteMode={showTrainerOrgOnly}
              showTrainerOrgOnly={showTrainerOrgOnly}
              error={errors.organization?.message}
              allowAdding
              value={organization ?? undefined}
              onChange={handleOrgSelectorChange}
              textFieldProps={{
                variant: 'filled',
              }}
              sx={{ marginBottom: 2 }}
              disabled={disabledFields.has('organization')}
              createdFrom={Org_Created_From_Enum.CreateCoursePage}
            />
          )}
        </>
      )}

      {isIndirectCourse ? (
        <>
          <Typography mb={2} fontWeight={600}>
            {t('organization-key-contact-label')}
          </Typography>

          <Grid container spacing={2} mb={3}>
            <Grid item md={12} xs={12}>
              <UserSelector
                {...register(`organizationKeyContact`)}
                required
                value={organizationKeyContact?.email ?? undefined}
                onChange={handleContactChange('organizationKeyContact')}
                onEmailChange={handleContactChange('organizationKeyContact')}
                organisationId={getValues('organization')?.id ?? ''}
                textFieldProps={{ variant: 'filled' }}
                error={errors.organizationKeyContact?.email?.message}
                disabled={disabledFields.has('organizationKeyContact')}
                onBlur={onBlurUserSelector}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                required
                label={_t('first-name')}
                variant="filled"
                placeholder={_t('first-name-placeholder')}
                {...register(`organizationKeyContact.firstName`)}
                error={!!errors.organizationKeyContact?.firstName}
                helperText={
                  errors.organizationKeyContact?.firstName?.message ?? ''
                }
                disabled={disabledFields.has('organizationKeyContact')}
                InputLabelProps={{
                  shrink: !!organizationKeyContact?.firstName,
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                required
                label={_t('surname')}
                variant="filled"
                placeholder={_t('surname-placeholder')}
                {...register(`organizationKeyContact.lastName`)}
                error={!!errors.organizationKeyContact?.lastName}
                helperText={
                  errors.organizationKeyContact?.lastName?.message ?? ''
                }
                disabled={disabledFields.has('organizationKeyContact')}
                InputLabelProps={{
                  shrink: !!organizationKeyContact?.lastName,
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </>
      ) : null}

      {isClosedCourse ? (
        <>
          <Typography mb={2} fontWeight={600}>
            {t('contact-person-label')}
          </Typography>

          <Grid container spacing={2} mb={3}>
            <Grid item md={12} xs={12}>
              <UserSelector
                {...register(`bookingContact`)}
                required
                value={bookingContact?.email ?? undefined}
                onChange={handleContactChange()}
                onEmailChange={handleContactChange()}
                organisationId={getValues('organization')?.id ?? ''}
                textFieldProps={{ variant: 'filled' }}
                error={errors.bookingContact?.email?.message}
                disabled={
                  !getValues('organization') ||
                  disabledFields.has('bookingContact')
                }
                onBlur={onBlurUserSelector}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                required
                label={_t('first-name')}
                variant="filled"
                placeholder={_t('first-name-placeholder')}
                {...register(`bookingContact.firstName`)}
                error={!!errors.bookingContact?.firstName}
                helperText={errors.bookingContact?.firstName?.message ?? ''}
                disabled={
                  !organization ||
                  disabledFields.has('bookingContact') ||
                  !!bookingContact?.profileId
                }
                InputLabelProps={{
                  shrink: !!bookingContact?.firstName,
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                required
                label={_t('surname')}
                variant="filled"
                placeholder={_t('surname-placeholder')}
                {...register(`bookingContact.lastName`)}
                error={!!errors.bookingContact?.lastName}
                helperText={errors.bookingContact?.lastName?.message ?? ''}
                disabled={
                  !getValues('organization') ||
                  disabledFields.has('bookingContact') ||
                  !!getValues('bookingContact')?.profileId
                }
                InputLabelProps={{
                  shrink: !!bookingContact?.lastName,
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </>
      ) : null}
    </>
  )
}
