import { yupResolver } from '@hookform/resolvers/yup'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  Link,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { subYears } from 'date-fns'
import { uniq } from 'lodash-es'
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useMutation } from 'urql'
import * as yup from 'yup'
import { InferType } from 'yup'

import { Avatar } from '@app/components/Avatar'
import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { ConfirmDialog, Dialog } from '@app/components/dialogs'
import { JobTitleSelector } from '@app/components/JobTitleSelector'
import { CallbackOption, OrgSelector } from '@app/components/OrgSelector'
import PhoneNumberInput, {
  DEFAULT_PHONE_COUNTRY,
} from '@app/components/PhoneNumberInput'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { useAuth } from '@app/context/auth'
import {
  GetProfileDetailsQuery,
  ImportLegacyCertificateMutation,
  Organization,
  Profile_Role_Insert_Input,
  Profile_Trainer_Role_Type_Insert_Input,
  RemoveOrgMemberMutation,
  RemoveOrgMemberMutationVariables,
  UpdateOrgMemberMutation,
  UpdateOrgMemberMutationVariables,
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  UpdateProfileRolesMutation,
  UpdateProfileRolesMutationVariables,
  UpdateTrainerRoleTypeMutation,
  UpdateTrainerRoleTypeMutationVariables,
} from '@app/generated/graphql'
import { useJobTitles } from '@app/hooks/useJobTitles'
import useProfile from '@app/hooks/useProfile'
import useRoles from '@app/hooks/useRoles'
import useTrainerRoleTypes from '@app/hooks/useTrainerRoleTypes'
import { positions } from '@app/pages/common/CourseBooking/components/org-data'
import { ImportCertificateModal } from '@app/pages/common/profile/components/ImportCertificateModal'
import { MUTATION as REMOVE_ORG_MEMBER_MUTATION } from '@app/queries/organization/remove-org-member'
import { MUTATION as UPDATE_ORG_MEMBER_MUTATION } from '@app/queries/organization/update-org-member'
import { MUTATION as UPDATE_PROFILE_MUTATION } from '@app/queries/profile/update-profile'
import { MUTATION as UPDATE_PROFILE_ROLES_MUTATION } from '@app/queries/profile/update-profile-roles'
import { MUTATION as UPDATE_PROFILE_TRAINER_ROLE_TYPES } from '@app/queries/trainer/update-trainer-role-types'
import { schemas } from '@app/schemas'
import { RoleName, TrainerRoleTypeName } from '@app/types'
import { INPUT_DATE_FORMAT } from '@app/util'

import {
  avatarSize,
  BILDRolesNames,
  defaultTrainerRoles,
  DietaryRestrictionRadioValues,
  DisabilitiesRadioValues,
  employeeRole,
  EmployeeRoleName,
  employeeRolesNames,
  maxAvatarFileSizeBytes,
  OrgMemberType,
  salesRole,
  salesRolesNames,
  trainerRolesNames,
  UserRoleName,
  userRolesNames,
  userSubRoles,
} from '../'
import { CertificationsAlerts } from '../components/CertificationsAlerts'
import {
  EditRoles,
  RolesFields,
  rolesFormSchema,
} from '../components/EditRoles'
import { InviteUserToOrganisation } from '../components/InviteUserToOrganisation'
import { UserGo1License } from '../components/UserGo1License'

export const EditProfilePage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const [avatarError, setAvatarError] = useState('')
  const [displayOrgSelector, setDisplayOrgSelector] = useState(false)
  const [isManualFormError, setIsManualFormError] = useState(false)

  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { profile: currentUserProfile, reloadCurrentProfile, acl } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const jobTitles = useJobTitles()
  const orgId = searchParams.get('orgId')
  const minimalAge = subYears(new Date(), 16)
  const importCertificateModalRef = useRef<
    ImportLegacyCertificateMutation | undefined
  >()

  const [{ fetching: updateProfileFetching }, updateProfile] = useMutation<
    UpdateProfileMutation,
    UpdateProfileMutationVariables
  >(UPDATE_PROFILE_MUTATION)
  const [{ fetching: updateProfileRolesFetching }, updateProfileRoles] =
    useMutation<
      UpdateProfileRolesMutation,
      UpdateProfileRolesMutationVariables
    >(UPDATE_PROFILE_ROLES_MUTATION)
  const [{ fetching: updateTrainerRolesFetching }, updateProfileTrainerRoles] =
    useMutation<
      UpdateTrainerRoleTypeMutation,
      UpdateTrainerRoleTypeMutationVariables
    >(UPDATE_PROFILE_TRAINER_ROLE_TYPES)
  const [{ fetching: updateOrgMemberFetching }, updateOrgMember] = useMutation<
    UpdateOrgMemberMutation,
    UpdateOrgMemberMutationVariables
  >(UPDATE_ORG_MEMBER_MUTATION)
  const [{ fetching: removeOrgMemberFetching }, removeOrgMember] = useMutation<
    RemoveOrgMemberMutation,
    RemoveOrgMemberMutationVariables
  >(REMOVE_ORG_MEMBER_MUTATION)

  const [callProfileParams, setCallProfileParams] = useState({
    id: id ?? currentUserProfile?.id,
    courseId: undefined,
    orgId: orgId ?? undefined,
    userCourses: false,
    refreshProfileData: false,
  })

  const { profile, certifications, go1Licenses, updateAvatar } = useProfile(
    callProfileParams.id,
    callProfileParams.courseId,
    callProfileParams.orgId,
    callProfileParams.userCourses,
    callProfileParams.refreshProfileData
  )

  /**
   * @see https://behaviourhub.atlassian.net/browse/TTHP-3402
   *
   * The OrgSelector component does a mutation on the model 'organization_member'
   * and cacheExchange invalidates the queries that use that __typename from useProfile,
   * which causes a form reset mid-completion.
   */
  const isProfileStaleRef = useRef(false)
  const { roles: systemRoles } = useRoles()
  const { trainerRoleTypes: systemTrainerRoleTypes } = useTrainerRoleTypes()
  const isMyProfile = !id

  const [dietaryRestrictionsRadioValue, setDietaryRestrictionsRadioValue] =
    useState<DietaryRestrictionRadioValues | null>(null)
  const [disabilitiesRadioValue, setDisabilitiesRadioValue] =
    useState<DisabilitiesRadioValues | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showInviteOrgModal, setShowInviteOrgModal] = useState(false)

  const [orgToLeave, setOrgToLeave] = useState<OrgMemberType>()

  const ratherNotSayText = t<string>('rather-not-say')

  const canEditRoles = acl.isTTAdmin() || acl.isTTOps()
  const canEditNamesAndDOB =
    acl.isTTAdmin() || acl.isTTOps() || acl.isSalesAdmin()

  useEffect(() => {
    const restriction = profile?.dietaryRestrictions
    const disabilities = profile?.disabilities

    //If dietaryRestrictions or disabilities is empty string, it means the user as submited those fields, and choose option 'No'

    if ((restriction || restriction === '') && !dietaryRestrictionsRadioValue) {
      setDietaryRestrictionsRadioValue(
        restriction
          ? DietaryRestrictionRadioValues.YES
          : DietaryRestrictionRadioValues.NO
      )
    }
    if ((disabilities || disabilities === '') && !disabilitiesRadioValue) {
      setDisabilitiesRadioValue(
        disabilities
          ? disabilities === ratherNotSayText
            ? DisabilitiesRadioValues.RATHER_NOT_SAY
            : DisabilitiesRadioValues.YES
          : DisabilitiesRadioValues.NO
      )
    }
  }, [
    dietaryRestrictionsRadioValue,
    disabilitiesRadioValue,
    profile,
    ratherNotSayText,
  ])

  const formSchema = useMemo(() => {
    const disabilitiesSchema =
      disabilitiesRadioValue === DisabilitiesRadioValues.YES
        ? yup
            .string()
            .required(
              t('validation-errors.required-field', { name: t('disabilities') })
            )
        : yup.string().nullable()
    const dietaryRestrictionsSchema =
      dietaryRestrictionsRadioValue === DietaryRestrictionRadioValues.YES
        ? yup.string().required(
            t('validation-errors.required-field', {
              name: t('dietary-restrictions'),
            })
          )
        : yup.string().nullable()
    return yup
      .object({
        avatar: yup.string().nullable(),
        firstName: yup
          .string()
          .required(
            t('validation-errors.required-field', { name: t('first-name') })
          ),
        surname: yup
          .string()
          .required(
            t('validation-errors.required-field', { name: t('surname') })
          ),
        countryCode: yup.string(),
        country: yup.string().required(
          t('validation-errors.required-field', {
            name: t('country'),
          })
        ),
        phone: schemas.phone(t),
        phoneCountryCode: yup.string().optional(),
        dob: yup
          .date()
          .nullable()
          .max(subYears(new Date(), 16), t('validation-errors.date-too-early')),
        jobTitle: yup
          .string()
          .required(
            t('validation-errors.required-field', { name: t('job-title') })
          ),
        otherJobTitle: yup.string().when('jobTitle', ([jobTitle], schema) => {
          return jobTitle === 'Other'
            ? schema.required(t('validation-errors.other-job-title-required'))
            : schema
        }),
        org: yup.array().of(
          yup.object({
            isAdmin: yup.boolean().required(),
            id: yup.string().required(),
          })
        ),
        organization: yup
          .object<Partial<Organization>>()
          .shape({
            id: yup.string(),
            name: yup.string(),
            moderatorRole: yup.boolean(),
          })
          .required(t('components.course-form.organisation-required')),
        disabilities: disabilitiesSchema,
        dietaryRestrictions: dietaryRestrictionsSchema,
        roles: rolesFormSchema(),
      })
      .required()
  }, [disabilitiesRadioValue, t, dietaryRestrictionsRadioValue])

  const methods = useForm<InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      avatar: '',
      firstName: '',
      surname: '',
      countryCode: '',
      phone: '',
      phoneCountryCode: DEFAULT_PHONE_COUNTRY,
      dob: null,
      jobTitle: '',
      disabilities: null,
      dietaryRestrictions: null,
      roles: [
        {
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: defaultTrainerRoles,
        },
      ],
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = methods

  const values = watch()

  const orgSelectorOnChange = useCallback(
    (organization: CallbackOption) => {
      if (organization) {
        setValue('organization', organization as Organization, {
          shouldValidate: true,
        })
        return
      }
    },
    [setValue]
  )

  const refreshData = useCallback(async () => {
    if (isMyProfile) {
      isProfileStaleRef.current = false
      await reloadCurrentProfile()
    }
  }, [isMyProfile, reloadCurrentProfile])

  const isOtherJobTitle = useMemo(() => {
    return Boolean(profile?.jobTitle && !jobTitles.includes(profile.jobTitle))
  }, [jobTitles, profile?.jobTitle])

  useEffect(() => {
    if (profile && !isProfileStaleRef.current) {
      isProfileStaleRef.current = true
      setValue('avatar', profile.avatar as string)
      setValue('firstName', profile.givenName ?? '')
      setValue('surname', profile.familyName ?? '')
      setValue('phone', profile.phone ?? '')
      setValue('dob', profile.dob ? new Date(profile.dob) : null)
      setValue('disabilities', profile.disabilities ?? '')
      setValue('dietaryRestrictions', profile.dietaryRestrictions ?? '')
      setValue('org', [])
      setValue('country', profile.country ?? '')
      setValue('countryCode', profile.countryCode ?? '')
      setValue('phoneCountryCode', profile.phoneCountryCode ?? '')

      if (isOtherJobTitle) {
        setValue('jobTitle', 'Other')

        setValue('otherJobTitle', profile.jobTitle as string)
      } else if (profile?.jobTitle) {
        setValue('jobTitle', profile.jobTitle)
      }

      if (profile.roles.length) {
        const isEmployeeRole = (roleName: EmployeeRoleName) =>
          employeeRolesNames.some(name => name == roleName)

        const isSalesRole = (roleName: RoleName) =>
          salesRolesNames.some(name => name == roleName)

        const formattedTrainerRoleTypes = profile.trainer_role_types.reduce(
          (formattedTrainerRoleTypes, obj) => {
            if (
              trainerRolesNames.includes(
                obj.trainer_role_type.name as TrainerRoleTypeName
              )
            ) {
              formattedTrainerRoleTypes.trainerRole = [
                ...formattedTrainerRoleTypes.trainerRole,
                obj.trainer_role_type.name,
              ]
            } else if (
              BILDRolesNames.includes(
                obj.trainer_role_type.name as TrainerRoleTypeName
              )
            ) {
              formattedTrainerRoleTypes.BILDRole = obj.trainer_role_type.name
            } else if (
              obj.trainer_role_type.name == TrainerRoleTypeName.MODERATOR
            ) {
              formattedTrainerRoleTypes.moderatorRole = true
            }
            return formattedTrainerRoleTypes
          },
          {
            ...defaultTrainerRoles,
          }
        )

        const formattedRoles = [] as RolesFields

        profile.roles.map(obj => {
          const existingEmployeeRole = formattedRoles.find(
            obj => obj.userRole === employeeRole.name
          )
          if (obj.role.name === RoleName.TRAINER) {
            formattedRoles.push({
              userRole: obj.role.name as UserRoleName,
              employeeRoles: [],
              salesRoles: [],
              trainerRoles: formattedTrainerRoleTypes,
            })
          } else if (isEmployeeRole(obj.role.name as EmployeeRoleName)) {
            if (existingEmployeeRole) {
              existingEmployeeRole.employeeRoles.push(
                obj.role.name as EmployeeRoleName
              )
            } else {
              formattedRoles.push({
                userRole: employeeRole.name,
                employeeRoles: [obj.role.name as EmployeeRoleName],
                salesRoles: [],
                trainerRoles: defaultTrainerRoles,
              })
            }
          } else if (isSalesRole(obj.role.name as RoleName)) {
            if (existingEmployeeRole) {
              if (!existingEmployeeRole.employeeRoles.includes('sales')) {
                existingEmployeeRole.employeeRoles.push('sales')
              }
              existingEmployeeRole.salesRoles.push(obj.role.name as RoleName)
            } else {
              formattedRoles.push({
                userRole: employeeRole.name,
                employeeRoles: [salesRole.name],
                salesRoles: [obj.role.name as RoleName],
                trainerRoles: defaultTrainerRoles,
              })
            }
          } else if (userRolesNames.includes(obj.role.name as UserRoleName)) {
            formattedRoles.push({
              userRole: obj.role.name as UserRoleName,
              employeeRoles: [],
              salesRoles: [],
              trainerRoles: defaultTrainerRoles,
            })
          }
        })

        /**
         * TODO Add default Individual role on edit
         * @description Add default Individual role for the user who has only
         * booking or organisation key contact roles stored explicit in the db.
         * @see https://behaviourhub.atlassian.net/jira/software/projects/TTHP/issues/TTHP-3387
         */
        if (
          !formattedRoles.length &&
          profile.roles.some(r =>
            userSubRoles.includes(r.role.name as RoleName)
          )
        ) {
          formattedRoles.push({
            userRole: RoleName.USER,
            employeeRoles: [],
            salesRoles: [],
            trainerRoles: defaultTrainerRoles,
          })
        }

        setValue('roles', formattedRoles)
      } else {
        setValue('roles', [
          {
            userRole: RoleName.USER,
            employeeRoles: [],
            salesRoles: [],
            trainerRoles: defaultTrainerRoles,
          },
        ])
      }
    }
  }, [isOtherJobTitle, profile, setValue])

  const navigateBackPath = orgId ? `../?orgId=${orgId}` : '..'

  const updateIsAdmin = useCallback(
    async (orgAdmin: {
      id: string
      member: {
        isAdmin: boolean
      }
    }) => {
      await updateOrgMember(orgAdmin)
      await refreshData()
    },
    [updateOrgMember, refreshData]
  )

  useEffect(() => {
    if (!values.roles.some(role => role.userRole === RoleName.TRAINER)) {
      if (
        importCertificateModalRef.current?.importLegacyCertificate
          ?.trainerRoleAdded
      ) {
        setValue('roles', [
          ...values.roles,
          {
            userRole: RoleName.TRAINER,
            employeeRoles: [],
            salesRoles: [],
            trainerRoles: defaultTrainerRoles,
          },
        ])
      }
    }
  }, [
    importCertificateModalRef.current?.importLegacyCertificate
      ?.trainerRoleAdded,
    setValue,
    values.roles,
  ])

  const onSubmitImportCertificate = useCallback(async () => {
    setCallProfileParams(prev => ({ ...prev, refreshProfileData: true }))
    setShowImportModal(false)
  }, [])

  const onSubmit = async (data: InferType<typeof formSchema>) => {
    if (!profile || isManualFormError) return

    try {
      await updateProfile({
        input: {
          profileId: profile.id,
          avatar: data.avatar,
          ...(canEditNamesAndDOB
            ? {
                givenName: data.firstName,
                familyName: data.surname,
                dob: data.dob?.toISOString(),
              }
            : null),
          phone: data.phone,
          orgId: data.organization.id,
          jobTitle:
            data.jobTitle === 'Other' ? data.otherJobTitle : data.jobTitle,
          disabilities: data.disabilities,
          dietaryRestrictions: data.dietaryRestrictions,
          country: data.country,
          countryCode: data.countryCode,
          phoneCountryCode: data.phoneCountryCode ?? '',
        },
      })

      if (values.org?.length) {
        await Promise.all(
          values?.org.map(({ isAdmin, id }) =>
            updateIsAdmin({
              id,
              member: {
                isAdmin,
              },
            })
          )
        )
      }

      if (canEditRoles) {
        const updatedRoles: string[] = []
        const updatedTrainerRoles: unknown[] = []
        data.roles.map(obj => {
          if (obj.userRole === RoleName.TRAINER) {
            updatedTrainerRoles.push(
              obj.trainerRoles.trainerRole,
              obj.trainerRoles.BILDRole,
              obj.trainerRoles.moderatorRole
                ? TrainerRoleTypeName.MODERATOR
                : undefined
            )
          }

          updatedRoles.push(
            obj.userRole,
            ...(obj.employeeRoles as EmployeeRoleName[]),
            ...(obj.salesRoles as RoleName[])
          )
        })
        const filteredRoles = systemRoles?.reduce(
          (filteredRoles, systemRole) => {
            if (updatedRoles.find(role => role === systemRole.name)) {
              filteredRoles.push({
                role_id: systemRole.id,
                profile_id: profile.id,
              })
            }

            return filteredRoles
          },
          [] as Profile_Role_Insert_Input[]
        )

        /**
         * TODO Add the profile's booking contact and organisation key contact roles.
         * @author ion.mereuta@amdaris.com
         * @link https://behaviourhub.atlassian.net/jira/software/projects/TTHP/issues/TTHP-3325
         * As the above roles are not editable and because the roles update involves all roles
         * replacement we add the booking contact and organisation key contact roles to
         * not be to be deleted because of profile's roles replacement.
         */

        const profilesIndividualSubRoles = profile.roles.filter(roleData =>
          [
            RoleName.BOOKING_CONTACT,
            RoleName.ORGANIZATION_KEY_CONTACT,
          ].includes(roleData.role.name as RoleName)
        )

        profilesIndividualSubRoles.forEach(roleData => {
          filteredRoles?.push({
            role_id: roleData.role.id,
            profile_id: profile.id,
          })
        })

        const filteredTrainerRoleTypes = systemTrainerRoleTypes?.reduce(
          (filteredTrainerRoleTypes, systemTrainerRoleType) => {
            if (
              updatedTrainerRoles
                .flat()
                .find(role => role === systemTrainerRoleType.name)
            ) {
              filteredTrainerRoleTypes.push({
                trainer_role_type_id: systemTrainerRoleType.id,
                profile_id: profile.id,
              })
            }
            return filteredTrainerRoleTypes
          },
          [] as Profile_Trainer_Role_Type_Insert_Input[]
        )

        await updateProfileRoles({
          id: profile?.id,
          roles: filteredRoles ?? [],
        })

        await updateProfileTrainerRoles({
          id: profile?.id,
          trainerRoleTypes: filteredTrainerRoleTypes ?? [],
        })
      }

      await refreshData()
      navigate(navigateBackPath, { replace: true })
    } catch (err) {
      return err
    }
  }
  const { getLabel: getCountryLabel } = useWorldCountries()
  const allPositions = useMemo(() => {
    return uniq([
      ...positions.edu,
      ...positions.hsc_child,
      ...positions.hsc_adult,
      ...positions.other,
    ])
  }, [])

  const updatePosition = useCallback(
    async (orgMember: OrgMemberType, position: string) => {
      await updateOrgMember({
        id: orgMember.id,
        member: {
          position: position,
        },
      })
    },
    [updateOrgMember]
  )

  const deleteOrgMember = useCallback(
    async (orgMember: OrgMemberType) => {
      await removeOrgMember({
        id: orgMember.id,
      })
      setOrgToLeave(undefined)
    },
    [removeOrgMember]
  )

  const handleAvatarUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files[0]) {
        return
      }

      const file = e.target.files[0]
      if (file.size > maxAvatarFileSizeBytes) {
        setAvatarError(
          t('avatar-too-large', {
            maxSize: maxAvatarFileSizeBytes / (1024 * 1024),
          })
        )
        return
      }

      try {
        setAvatarError('')
        const buffer = await file.arrayBuffer()
        const data = Array.from(new Uint8Array(buffer))

        const response = await updateAvatar(data)
        setValue('avatar', response?.avatar as string)
      } catch (err) {
        console.error(err)
        setAvatarError(t('unknown-error'))
      }
    },
    [setAvatarError, setValue, t, updateAvatar]
  )
  const loading = useMemo(
    () =>
      [
        updateProfileFetching,
        updateProfileRolesFetching,
        updateTrainerRolesFetching,
        updateOrgMemberFetching,
        removeOrgMemberFetching,
      ].some(v => v),
    [
      updateProfileFetching,
      updateProfileRolesFetching,
      updateTrainerRolesFetching,
      updateOrgMemberFetching,
      removeOrgMemberFetching,
    ]
  )

  if (!profile || !systemRoles) return null

  if (!acl.canEditProfiles() && !isMyProfile) {
    return <Navigate to=".." />
  }

  return (
    <Box bgcolor="grey.100" pb={6} pt={3}>
      <Container>
        <SnackbarMessage
          messageKey="user-invited"
          sx={{ marginTop: '3em', position: 'absolute' }}
          autoHideDuration={3000}
        />
        <FormProvider {...methods}>
          <Grid
            container
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            data-testid="EditProfileForm"
            noValidate
            autoComplete="off"
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Grid
              item
              md={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Button
                component="label"
                sx={{
                  alignItems: 'normal',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0)' },
                  borderRadius: '50%',
                  width: `${avatarSize}px`,
                  height: `${avatarSize}px`,
                  marginBottom: 4,
                  padding: 0,
                }}
              >
                <Avatar
                  src={values.avatar ?? undefined}
                  name={`${values.firstName} ${values.surname}`}
                  size={avatarSize}
                  sx={{
                    mb: 4,
                    opacity: loading ? 0.3 : 1,
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarUpload}
                />
              </Button>
              {avatarError ? (
                <Typography variant="caption" color="error">
                  {avatarError}
                </Typography>
              ) : null}
              <Typography
                variant="h1"
                whiteSpace="nowrap"
                sx={{
                  maxWidth: '240px',
                  overflowWrap: 'break-word',
                  whiteSpace: 'initial',
                }}
              >
                {profile.fullName}
              </Typography>
              <Typography variant="body1" color="grey.700">
                {profile.email}
              </Typography>
              <Box mt={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth={isMobile}
                  onClick={() => navigate(navigateBackPath, { replace: true })}
                >
                  {t('cancel')}
                </Button>
                <LoadingButton
                  variant="contained"
                  fullWidth={isMobile}
                  color="primary"
                  sx={{ ml: isMobile ? 0 : 1, mt: isMobile ? 2 : 0 }}
                  type="submit"
                  loading={loading}
                  data-testid="save-changes-button"
                >
                  {t('save-changes')}
                </LoadingButton>
              </Box>
              <Box m={2}>
                {acl.canInviteToOrganizations() && !profile.archived ? (
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setShowInviteOrgModal(true)}
                    data-testid="edit-invite-user-to-org"
                  >
                    {t(
                      'pages.org-details.tabs.users.invite-individual-to-organization'
                    )}
                  </Button>
                ) : undefined}
              </Box>
            </Grid>

            <Grid item md={8}>
              <Typography variant="subtitle2" mb={1}>
                {t('personal-details')}
              </Typography>

              <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
                <Grid container spacing={3} mb={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      id="firstName"
                      label={t('first-name')}
                      variant="filled"
                      placeholder={t('first-name-placeholder')}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      {...register('firstName')}
                      inputProps={{ 'data-testid': 'first-name' }}
                      autoFocus
                      fullWidth
                      disabled={!canEditNamesAndDOB}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      id="surname"
                      label={t('surname')}
                      variant="filled"
                      placeholder={t('surname-placeholder')}
                      error={!!errors.surname}
                      helperText={errors.surname?.message}
                      {...register('surname')}
                      inputProps={{ 'data-testid': 'surname' }}
                      fullWidth
                      disabled={!canEditNamesAndDOB}
                    />
                  </Grid>
                </Grid>

                <Box mb={3}>
                  <TextField
                    id="email"
                    label={t('email')}
                    variant="filled"
                    value={profile.email}
                    inputProps={{ 'data-testid': 'email' }}
                    disabled
                    fullWidth
                  />
                </Box>

                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <CountriesSelector
                      label={t('residing-country')}
                      variant="filled"
                      required
                      onChange={(_, code) => {
                        if (code) {
                          setValue(
                            'country',
                            getCountryLabel(code as WorldCountriesCodes) ?? '',
                            { shouldValidate: true }
                          )
                          setValue('countryCode', code)
                          profile.countryCode = code
                        }
                      }}
                      error={!!errors.country}
                      helperText={errors.country?.message || ''}
                      value={profile.countryCode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <PhoneNumberInput
                      label={t('phone')}
                      variant="filled"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      handleManualError={isError =>
                        setIsManualFormError(isError)
                      }
                      value={{
                        phoneNumber: values.phone ?? '',
                        countryCode: values.phoneCountryCode ?? '',
                      }}
                      onChange={({ phoneNumber, countryCode }) => {
                        setValue('phone', phoneNumber, { shouldValidate: true })
                        setValue('phoneCountryCode', countryCode)
                      }}
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3} mb={3}>
                  <Grid item md={6} xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        format={INPUT_DATE_FORMAT}
                        value={values.dob}
                        disabled={!canEditNamesAndDOB}
                        maxDate={minimalAge}
                        onChange={(d: Date | null) => setValue('dob', d)}
                        slotProps={{
                          textField: {
                            // @ts-expect-error no arbitrary props are allowed by types, which is wrong
                            'data-testid': 'dob-input',
                            label: t('dob'),
                            variant: 'filled',
                            fullWidth: true,
                            error: !!errors.dob,
                            helperText: errors.dob?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <JobTitleSelector
                      errors={{
                        jobTitle: errors.jobTitle?.message,
                        otherJobTitle: errors.otherJobTitle?.message,
                      }}
                      register={{
                        jobTitle: { ...register('jobTitle') },
                        otherJobTitle: { ...register('otherJobTitle') },
                      }}
                      values={{ jobTitle: values.jobTitle }}
                    />
                  </Grid>
                </Grid>
                {!canEditNamesAndDOB ? (
                  <Alert severity="info" variant="outlined">
                    {t('cant-update-personal-info-warning')}{' '}
                    <Link
                      underline="always"
                      href={`mailto:${
                        import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS
                      }`}
                      component="a"
                    >
                      {import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS}
                    </Link>
                  </Alert>
                ) : null}
                <Grid item md={12} pt={2}>
                  <FormControl>
                    <Typography variant="body1" fontWeight={600}>
                      {t('dietary-restrictions-question')}
                    </Typography>
                    <RadioGroup
                      onChange={(_, newValue: string) => {
                        setDietaryRestrictionsRadioValue(
                          newValue as DietaryRestrictionRadioValues
                        )
                        setValue('dietaryRestrictions', '')
                      }}
                      row={!isMobile}
                      value={dietaryRestrictionsRadioValue}
                    >
                      <FormControlLabel
                        value={DietaryRestrictionRadioValues.NO}
                        control={<Radio />}
                        label={t<string>('no')}
                      />
                      <FormControlLabel
                        value={DietaryRestrictionRadioValues.YES}
                        control={<Radio />}
                        label={t<string>('yes')}
                      />
                    </RadioGroup>
                    {dietaryRestrictionsRadioValue ===
                    DietaryRestrictionRadioValues.YES ? (
                      <Box>
                        <TextField
                          onChange={event =>
                            setValue('dietaryRestrictions', event.target.value)
                          }
                          label={t('dietary-restrictions-text-label')}
                          variant="filled"
                          fullWidth
                          required
                          error={!!errors.dietaryRestrictions}
                          helperText={errors.dietaryRestrictions?.message}
                          value={values.dietaryRestrictions}
                        />
                      </Box>
                    ) : null}
                  </FormControl>
                </Grid>

                <Grid item md={12} pt={2}>
                  <FormControl>
                    <Typography variant="body1" fontWeight={600}>
                      {t('disabilities-question')}
                    </Typography>
                    <RadioGroup
                      onChange={(event, newValue: string) => {
                        setValue(
                          'disabilities',
                          newValue === DisabilitiesRadioValues.RATHER_NOT_SAY
                            ? ratherNotSayText
                            : ''
                        )
                        setDisabilitiesRadioValue(
                          newValue as DisabilitiesRadioValues
                        )
                      }}
                      row={!isMobile}
                      value={disabilitiesRadioValue}
                    >
                      <FormControlLabel
                        value={DisabilitiesRadioValues.NO}
                        control={<Radio />}
                        label={t<string>('no')}
                      />
                      <FormControlLabel
                        value={DisabilitiesRadioValues.YES}
                        control={<Radio />}
                        label={t<string>('yes')}
                      />
                      <FormControlLabel
                        value={DisabilitiesRadioValues.RATHER_NOT_SAY}
                        control={<Radio />}
                        label={ratherNotSayText}
                      />
                    </RadioGroup>
                    {disabilitiesRadioValue === DisabilitiesRadioValues.YES ? (
                      <Box>
                        <TextField
                          onChange={event =>
                            setValue('disabilities', event.target.value)
                          }
                          label={t('disabilities-text-label')}
                          variant="filled"
                          fullWidth
                          required
                          error={!!errors.disabilities}
                          helperText={errors.disabilities?.message}
                          value={values.disabilities}
                        />
                      </Box>
                    ) : null}
                  </FormControl>
                </Grid>
              </Box>

              {acl.canSeeProfileRoles() && canEditRoles ? (
                <>
                  <Typography variant="subtitle2" mb={1} mt={3}>
                    {t('pages.view-profile.connect-access')}
                  </Typography>
                  <EditRoles />
                </>
              ) : null}

              <Grid item my={3}>
                <Grid
                  container
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  my={2}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={displayOrgSelector ? 12 : 5}
                    lg={5}
                    mx={2}
                  >
                    <Typography variant="subtitle2" my={2}>
                      {t('pages.my-profile.organization-details')}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={displayOrgSelector ? 12 : 5}
                    lg={5}
                    mx={2}
                    display={displayOrgSelector ? '' : 'flex'}
                    justifyContent={
                      displayOrgSelector
                        ? ''
                        : isMobile
                        ? 'flex-start'
                        : 'flex-end'
                    }
                  >
                    {displayOrgSelector ? (
                      <OrgSelector
                        required
                        {...register('organization')}
                        autocompleteMode={false}
                        showTrainerOrgOnly={false}
                        error={errors.organization?.message}
                        isEditProfile={true}
                        userOrgIds={profile?.organizations.map(
                          org => org.organization.id
                        )}
                        allowAdding
                        value={
                          (values.organization as unknown as Pick<
                            Organization,
                            'name' | 'id'
                          >) ?? null
                        }
                        onChange={orgSelectorOnChange}
                        textFieldProps={{
                          variant: 'filled',
                        }}
                        isShallowRetrieval
                      />
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => {
                          setDisplayOrgSelector(true)
                        }}
                      >
                        {t('pages.my-profile.add-new-organization-button')}
                      </Button>
                    )}
                  </Grid>
                </Grid>

                {profile.organizations.length > 0 ? (
                  <>
                    <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
                      {profile.organizations.map((orgMember, index) => {
                        const isAdminEditable =
                          acl.isTTAdmin() || orgMember.isAdmin

                        const editable = !id || isAdminEditable

                        return (
                          <Box key={orgMember.id}>
                            <Grid
                              container
                              direction="row"
                              justifyContent="space-between"
                              align-items="stretch"
                            >
                              <Box>
                                <Typography variant="body1" fontWeight="600">
                                  {orgMember.organization.name}
                                </Typography>
                              </Box>
                              <Button
                                variant="outlined"
                                color="primary"
                                disabled={!acl.canEditOrgUser()}
                                onClick={() => setOrgToLeave(orgMember)}
                              >
                                {t('common.leave')}
                              </Button>
                            </Grid>

                            <Autocomplete
                              value={orgMember.position}
                              disabled={!editable}
                              options={allPositions}
                              onChange={(_, value) =>
                                updatePosition(orgMember, value ?? '')
                              }
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  variant="filled"
                                  label={t('common.position')}
                                  inputProps={{
                                    ...params.inputProps,
                                    sx: { height: 40 },
                                  }}
                                  sx={{ bgcolor: 'grey.100', my: 2 }}
                                />
                              )}
                            />
                            <FormControlLabel
                              sx={{ py: 2 }}
                              control={
                                <Switch
                                  disabled={!isAdminEditable}
                                  checked={
                                    values?.org && values?.org[index]
                                      ? values?.org[index].isAdmin
                                      : Boolean(orgMember.isAdmin)
                                  }
                                  onChange={e => {
                                    setValue(
                                      `org.${index}.isAdmin`,
                                      e.target.checked
                                    )
                                    setValue(`org.${index}.id`, orgMember.id)
                                  }}
                                  sx={{ px: 2 }}
                                />
                              }
                              label={
                                <Typography variant="body1">
                                  {t(
                                    'pages.org-details.tabs.users.edit-user-modal.organization-admin'
                                  )}
                                </Typography>
                              }
                            />
                          </Box>
                        )
                      })}
                    </Box>
                  </>
                ) : null}
              </Grid>
              <Grid
                mt={3}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item xs={9}>
                  <Typography variant="subtitle2">
                    {t('certifications')}
                  </Typography>
                  <Typography variant="body1" color="grey.700">
                    {t('course-certificate.import-certificate-description')}
                  </Typography>
                </Grid>
                <Grid item alignSelf={'end'}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setShowImportModal(true)}
                  >
                    {t('pages.my-profile.add-certificate')}
                  </Button>
                </Grid>
              </Grid>

              {(
                (certifications as GetProfileDetailsQuery['certificates']) ?? []
              ).map((certificate, index) => (
                <CertificationsAlerts
                  key={`${certificate.id}*${index}`}
                  certificate={certificate}
                  index={index}
                />
              ))}

              {go1Licenses?.length ? (
                <Box mt={3}>
                  <UserGo1License license={go1Licenses[0]} editable={true} />
                </Box>
              ) : null}

              <Box
                mt={2}
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                flexDirection={isMobile ? 'column' : 'row'}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(navigateBackPath, { replace: true })}
                  fullWidth={isMobile}
                >
                  {t('cancel')}
                </Button>

                <LoadingButton
                  variant="contained"
                  color="primary"
                  sx={{ ml: isMobile ? 0 : 1, mt: isMobile ? 2 : 0 }}
                  type="submit"
                  loading={loading}
                  data-testid="profile-save-changes"
                  fullWidth={isMobile}
                >
                  {t('save-changes')}
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>

      <ImportCertificateModal
        onCancel={() => setShowImportModal(false)}
        onSubmit={onSubmitImportCertificate}
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        profileId={id}
        ref={importCertificateModalRef}
      />

      <Dialog
        open={showInviteOrgModal}
        onClose={() => setShowInviteOrgModal(false)}
        slots={{
          Title: () => <>{t('pages.invite-to-org.title')}</>,
        }}
        maxWidth={600}
        minWidth={400}
      >
        <InviteUserToOrganisation
          userProfile={profile}
          onClose={() => setShowInviteOrgModal(false)}
        />
      </Dialog>

      {orgToLeave ? (
        <ConfirmDialog
          open={Boolean(orgToLeave)}
          message={t('pages.my-profile.org-leave-confirm-message', {
            name: orgToLeave.organization.name,
          })}
          onCancel={() => setOrgToLeave(undefined)}
          onOk={() => deleteOrgMember(orgToLeave)}
        />
      ) : null}
    </Box>
  )
}
