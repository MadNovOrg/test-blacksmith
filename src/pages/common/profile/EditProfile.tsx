import { yupResolver } from '@hookform/resolvers/yup'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Switch,
  TextField as MuiTextField,
  Typography,
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { styled } from '@mui/system'
import { formatDistanceToNow, isPast } from 'date-fns'
import { uniq } from 'lodash-es'
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import * as yup from 'yup'
import { InferType } from 'yup'

import { Avatar } from '@app/components/Avatar'
import { ConfirmDialog } from '@app/components/ConfirmDialog'
import { DetailsRow } from '@app/components/DetailsRow'
import { Dialog } from '@app/components/Dialog'
import { useAuth } from '@app/context/auth'
import {
  Profile_Role_Insert_Input,
  Profile_Trainer_Role_Type_Insert_Input,
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
  UpdateProfileRolesMutation,
  UpdateProfileRolesMutationVariables,
  UpdateTrainerRoleTypeMutation,
  UpdateTrainerRoleTypeMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useProfile from '@app/hooks/useProfile'
import useRoles from '@app/hooks/useRoles'
import useTrainerRoleTypes from '@app/hooks/useTrainerRoleTypes'
import { positions } from '@app/pages/common/CourseBooking/components/org-data'
import ImportCertificateModal from '@app/pages/common/profile/ImportCertificateModal'
import {
  MUTATION as RemoveOrgMemberQuery,
  ParamsType as RemoveOrgMemberParamsType,
} from '@app/queries/organization/remove-org-member'
import {
  MUTATION as UpdateOrgMemberQuery,
  ParamsType as UpdateOrgMemberParamsType,
} from '@app/queries/organization/update-org-member'
import { MUTATION as UPDATE_PROFILE_MUTATION } from '@app/queries/profile/update-profile'
import { MUTATION as UPDATE_PROFILE_ROLES_MUTATION } from '@app/queries/profile/update-profile-roles'
import { MUTATION as UPDATE_PROFILE_TRAINER_ROLE_TYPES } from '@app/queries/trainer/update-trainer-role-types'
import theme from '@app/theme'
import { RoleName, TrainerRoleType } from '@app/types'

import { EditRoles, RolesFields, rolesFormSchema } from './components/EditRoles'
import { UserGo1License } from './components/UserGo1License'
import { getRoleColor } from './utils'

type EditProfilePageProps = unknown

const TextField = styled(MuiTextField)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  minWidth: 300,

  '& .MuiInput-root': {
    height: 50,
  },
}))

enum DietaryRestrictionRadioValues {
  NO = 'NO',
  YES = 'YES',
}
enum DisabilitiesRadioValues {
  NO = 'NO',
  YES = 'YES',
  RATHER_NOT_SAY = 'RATHER_NOT_SAY',
}

type OrgMemberType = {
  id: string
  organization: { name: string }
}

const avatarSize = 220
const maxAvatarFileSizeBytes = Number.parseInt(
  import.meta.env.VITE_PROFILE_AVATAR_MAX_SIZE_BYTES ?? 0
)

export type UserRoleName = RoleName | 'tt-employee'

export type EmployeeRoleName = RoleName | 'sales'

export const userRolesNames: UserRoleName[] = [
  RoleName.USER,
  RoleName.TRAINER,
  RoleName.TT_ADMIN,
  'tt-employee',
]

export const employeeRolesNames: EmployeeRoleName[] = [
  RoleName.TT_OPS,
  RoleName.FINANCE,
  RoleName['L&D'],
  'sales',
]

export const salesRolesNames: RoleName[] = [
  RoleName.SALES_ADMIN,
  RoleName.SALES_REPRESENTATIVE,
]

export const employeeRole = {
  id: '0',
  name: 'tt-employee' as RoleName,
}
export const salesRole = {
  id: '1',
  name: 'sales' as RoleName,
}

const defaultTrainerRoleTypes = {
  trainerRole: '',
  AOLRole: '',
  BILDRole: '',
}

export const trainerRolesNames: TrainerRoleType[] = [
  TrainerRoleType.PRINCIPAL,
  TrainerRoleType.SENIOR,
  TrainerRoleType.SENIOR_ASSIST,
  TrainerRoleType.EMPLOYER_TRAINER,
  TrainerRoleType.ETA,
]

export const AOLRolesNames: TrainerRoleType[] = [
  TrainerRoleType.EMPLOYER_AOL,
  TrainerRoleType.SPECIAL_AGREEMENT_AOL,
  TrainerRoleType.ETA,
]

export const BILDRolesNames: TrainerRoleType[] = [
  TrainerRoleType.BILD_SENIOR,
  TrainerRoleType.BILD_CERTIFIED,
]

export const EditProfilePage: React.FC<EditProfilePageProps> = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [loading, setLoading] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const { profile: currentUserProfile, reloadCurrentProfile, acl } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const orgId = searchParams.get('orgId')

  const { profile, certifications, go1Licenses, mutate, updateAvatar } =
    useProfile(id ?? currentUserProfile?.id, undefined, orgId ?? undefined)
  const { roles: systemRoles } = useRoles()
  const { trainerRoleTypes: systemTrainerRoleTypes } = useTrainerRoleTypes()
  const isMyProfile = !id

  const [dietaryRestrictionsRadioValue, setDietaryRestrictionsRadioValue] =
    useState<DietaryRestrictionRadioValues | null>(null)
  const [disabilitiesRadioValue, setDisabilitiesRadioValue] =
    useState<DisabilitiesRadioValues | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [orgToLeave, setOrgToLeave] = useState<OrgMemberType>()

  const ratherNotSayText = t<string>('rather-not-say')

  const canEditRoles = acl.isTTAdmin()

  useEffect(() => {
    const restriction = profile?.dietaryRestrictions
    const disabilities = profile?.disabilities
    if (restriction !== null && !dietaryRestrictionsRadioValue) {
      setDietaryRestrictionsRadioValue(
        restriction
          ? DietaryRestrictionRadioValues.YES
          : DietaryRestrictionRadioValues.NO
      )
    }
    if (disabilities !== null && !disabilitiesRadioValue) {
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
        phone: yup.string(),
        dob: yup.date().nullable(),
        jobTitle: yup.string(),
        org: yup.string(),
        dbs: yup.string(),
        disabilities: disabilitiesSchema,
        dietaryRestrictions: dietaryRestrictionsSchema,
        roles: rolesFormSchema(),
      })
      .required()
  }, [t, disabilitiesRadioValue, dietaryRestrictionsRadioValue])

  const methods = useForm<InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      avatar: '',
      firstName: '',
      surname: '',
      countryCode: '+44',
      phone: '',
      dob: null,
      jobTitle: '',
      dbs: '',
      disabilities: null,
      dietaryRestrictions: null,
      roles: [
        {
          userRole: '',
          employeeRoles: [],
          salesRoles: [],
          trainerRoleTypes: defaultTrainerRoleTypes,
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

  const refreshData = useCallback(async () => {
    if (isMyProfile) {
      await reloadCurrentProfile()
    } else {
      await mutate()
    }
  }, [isMyProfile, mutate, reloadCurrentProfile])

  useEffect(() => {
    if (profile) {
      setValue('avatar', profile.avatar as string)
      setValue('firstName', profile.givenName)
      setValue('surname', profile.familyName)
      setValue('phone', profile.phone ?? '')
      setValue('dob', profile.dob ? new Date(profile.dob) : null)
      setValue('jobTitle', profile.jobTitle ?? '')
      setValue('dbs', profile.dbs ?? '')
      setValue('disabilities', profile.disabilities ?? '')
      setValue('dietaryRestrictions', profile.dietaryRestrictions ?? '')

      if (profile.roles.length) {
        const isEmployeeRole = (roleName: EmployeeRoleName) =>
          employeeRolesNames.some(name => name == roleName)

        const isSalesRole = (roleName: RoleName) =>
          salesRolesNames.some(name => name == roleName)

        const formattedTrainerRoleTypes = profile.trainer_role_types.reduce(
          (formattedTrainerRoleTypes, obj) => {
            if (
              trainerRolesNames.includes(
                obj.trainer_role_type.name as TrainerRoleType
              )
            ) {
              formattedTrainerRoleTypes.trainerRole = obj.trainer_role_type.name
            } else if (
              AOLRolesNames.includes(
                obj.trainer_role_type.name as TrainerRoleType
              )
            ) {
              formattedTrainerRoleTypes.AOLRole = obj.trainer_role_type.name
            } else if (
              BILDRolesNames.includes(
                obj.trainer_role_type.name as TrainerRoleType
              )
            ) {
              formattedTrainerRoleTypes.BILDRole = obj.trainer_role_type.name
            }
            return formattedTrainerRoleTypes
          },
          {
            ...defaultTrainerRoleTypes,
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
              trainerRoleTypes: formattedTrainerRoleTypes,
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
                trainerRoleTypes: defaultTrainerRoleTypes,
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
                trainerRoleTypes: defaultTrainerRoleTypes,
              })
            }
          } else if (userRolesNames.includes(obj.role.name as UserRoleName)) {
            formattedRoles.push({
              userRole: obj.role.name as UserRoleName,
              employeeRoles: [],
              salesRoles: [],
              trainerRoleTypes: defaultTrainerRoleTypes,
            })
          }
        })
        setValue('roles', formattedRoles)
      }
    }
  }, [profile, setValue])

  const navigateBackPath = orgId ? `../?orgId=${orgId}` : '..'

  const onSubmit = async (data: InferType<typeof formSchema>) => {
    setLoading(true)
    if (!profile) return

    try {
      await fetcher<UpdateProfileMutation, UpdateProfileMutationVariables>(
        UPDATE_PROFILE_MUTATION,
        {
          // have to supply a required field `where` hence passing profileId, we still
          // have perm check on the backend that does not allow updaing someone else's profile
          profileId: profile.id,
          input: {
            avatar: data.avatar,
            givenName: data.firstName,
            familyName: data.surname,
            phone: data.phone,
            dob: data.dob,
            jobTitle: data.jobTitle,
            dbs: data.dbs,
            disabilities: data.disabilities,
            dietaryRestrictions: data.dietaryRestrictions,
          },
        }
      )
      if (canEditRoles) {
        const updatedRoles: string[] = []
        const updatedTrainerRoleTypes: (string | null)[] = []
        data.roles.map(obj => {
          if (obj.userRole === RoleName.TRAINER) {
            updatedTrainerRoleTypes.push(
              obj.trainerRoleTypes.trainerRole,
              obj.trainerRoleTypes.AOLRole,
              obj.trainerRoleTypes.BILDRole
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
        const filteredTrainerRoleTypes = systemTrainerRoleTypes?.reduce(
          (filteredTrainerRoleTypes, systemTrainerRoleType) => {
            if (
              updatedTrainerRoleTypes.find(
                role => role === systemTrainerRoleType.name
              )
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

        await fetcher<
          UpdateProfileRolesMutation,
          UpdateProfileRolesMutationVariables
        >(UPDATE_PROFILE_ROLES_MUTATION, {
          id: profile?.id,
          roles: filteredRoles ?? [],
        })

        await fetcher<
          UpdateTrainerRoleTypeMutation,
          UpdateTrainerRoleTypeMutationVariables
        >(UPDATE_PROFILE_TRAINER_ROLE_TYPES, {
          id: profile?.id,
          trainerRoleTypes: filteredTrainerRoleTypes ?? [],
        })
      }

      setLoading(false)
      await refreshData()
      navigate(navigateBackPath, { replace: true })
    } catch (err) {
      setLoading(false)
    }
  }

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
      await fetcher<null, UpdateOrgMemberParamsType>(UpdateOrgMemberQuery, {
        id: orgMember.id,
        member: {
          position: position,
        },
      })
      await refreshData()
    },
    [fetcher, refreshData]
  )

  const updateIsAdmin = useCallback(
    async (orgMember: OrgMemberType, isAdmin: boolean) => {
      await fetcher<null, UpdateOrgMemberParamsType>(UpdateOrgMemberQuery, {
        id: orgMember.id,
        member: {
          isAdmin: isAdmin,
        },
      })
      await refreshData()
    },
    [fetcher, refreshData]
  )

  const deleteOrgMember = useCallback(
    async (orgMember: OrgMemberType) => {
      await fetcher<null, RemoveOrgMemberParamsType>(RemoveOrgMemberQuery, {
        id: orgMember.id,
      })
      await refreshData()
      setOrgToLeave(undefined)
    },
    [fetcher, refreshData]
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

        setLoading(true)
        const response = await updateAvatar(data)
        setValue('avatar', response?.avatar as string)
      } catch (err) {
        console.error(err)
        setAvatarError(t('unknown-error'))
        setLoading(false)
      }
    },
    [setAvatarError, setLoading, setValue, t, updateAvatar]
  )

  if (!profile || !systemRoles) return null

  return (
    <Box bgcolor="grey.100" pb={6} pt={3}>
      <Container>
        <FormProvider {...methods}>
          <Grid
            container
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            data-testid="EditProfileForm"
            noValidate
            autoComplete="off"
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
                  imgProps={{
                    onLoad: () => {
                      setLoading(false)
                    },
                  }}
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
              <Typography variant="h1" whiteSpace="nowrap">
                {profile.fullName}
              </Typography>
              <Typography variant="body1" color="grey.700">
                {profile.email}
              </Typography>

              <Box mt={5}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(navigateBackPath, { replace: true })}
                >
                  {t('cancel')}
                </Button>

                <LoadingButton
                  variant="contained"
                  color="primary"
                  sx={{ ml: 1 }}
                  type="submit"
                  loading={loading}
                >
                  {t('save-changes')}
                </LoadingButton>
              </Box>
            </Grid>

            <Grid item md={8}>
              <Typography variant="subtitle2" mb={1}>
                {t('personal-details')}
              </Typography>

              <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
                <Grid container spacing={3} mb={3}>
                  <Grid item md={6}>
                    <TextField
                      id="firstName"
                      label={t('first-name')}
                      variant="standard"
                      placeholder={t('first-name-placeholder')}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      {...register('firstName')}
                      inputProps={{ 'data-testid': 'first-name' }}
                      autoFocus
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      id="surname"
                      label={t('surname')}
                      variant="standard"
                      placeholder={t('surname-placeholder')}
                      error={!!errors.surname}
                      helperText={errors.surname?.message}
                      {...register('surname')}
                      inputProps={{ 'data-testid': 'surname' }}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Box mb={3}>
                  <TextField
                    id="email"
                    label={t('email')}
                    variant="standard"
                    value={profile.email}
                    inputProps={{ 'data-testid': 'email' }}
                    disabled
                    fullWidth
                  />
                </Box>

                <Grid container spacing={3} mb={3}>
                  <Grid item md={9}>
                    <TextField
                      id="phone"
                      label={t('phone')}
                      variant="standard"
                      placeholder={t('phone-placeholder')}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      {...register('phone')}
                      inputProps={{ 'data-testid': 'phone' }}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3} mb={3}>
                  <Grid item md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        inputFormat="dd/MM/yyyy"
                        value={values.dob}
                        onChange={(d: Date | null) => setValue('dob', d)}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label={t('dob')}
                            variant="standard"
                            fullWidth
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      id="job-title"
                      label={t('job-title')}
                      variant="standard"
                      placeholder={t('job-title-placeholder')}
                      error={!!errors.jobTitle}
                      helperText={errors.jobTitle?.message}
                      {...register('jobTitle')}
                      fullWidth
                      inputProps={{ 'data-testid': 'job-title' }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3} mb={3}>
                  <Grid item md={9}>
                    <TextField
                      id="dbs"
                      label={t('dbs-label')}
                      variant="standard"
                      error={!!errors.dbs}
                      helperText={errors.dbs?.message}
                      {...register('dbs')}
                      fullWidth
                      inputProps={{
                        'data-testid': 'disclosure-barring-service',
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} pt={2}>
                  <FormControl>
                    <Typography variant="body1" fontWeight={600}>
                      {t('dietary-restrictions-question')}
                    </Typography>
                    <RadioGroup
                      onChange={(event, newValue: string) => {
                        setDietaryRestrictionsRadioValue(
                          newValue as DietaryRestrictionRadioValues
                        )
                        setValue('dietaryRestrictions', '')
                      }}
                      row
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
                          variant="standard"
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
                      row
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
                          variant="standard"
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

              <Typography variant="subtitle2" mb={1} mt={3}>
                {t('pages.view-profile.hub-access')}
              </Typography>

              {canEditRoles ? (
                <EditRoles />
              ) : (
                <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
                  <DetailsRow label={t('pages.view-profile.user-roles')}>
                    <Box flex={1}>
                      {profile.roles.length > 0 ? (
                        profile.roles.map(({ role }) => (
                          <Chip
                            key={role.name}
                            label={t(`pages.view-profile.roles.${role?.name}`)}
                            color={getRoleColor(role.name)}
                          />
                        ))
                      ) : (
                        <Chip
                          label={t(`pages.view-profile.roles.user`)}
                          color="success"
                        />
                      )}
                    </Box>
                  </DetailsRow>
                </Box>
              )}

              {profile.organizations.length > 0 ? (
                <>
                  <Typography variant="subtitle2" my={2}>
                    {t('pages.my-profile.organization-details')}
                  </Typography>

                  <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
                    {profile.organizations.map(orgMember => {
                      const isAdminEditable =
                        acl.isTTAdmin() ||
                        profile.organizations.some(userOrgMember => {
                          return (
                            userOrgMember.isAdmin &&
                            userOrgMember.organization.id === orgMember.id
                          )
                        })
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
                              <Typography variant="body2">
                                {orgMember.organization.trustName}
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              color="primary"
                              disabled={!editable}
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
                                variant="standard"
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
                                checked={Boolean(orgMember.isAdmin)}
                                onChange={(_, checked) =>
                                  updateIsAdmin(orgMember, checked)
                                }
                                disabled={!isAdminEditable}
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

              <Grid
                mt={3}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Typography variant="subtitle2">
                  {t('certifications')}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowImportModal(true)}
                >
                  {t('pages.my-profile.add-certificate')}
                </Button>
              </Grid>

              <Typography variant="body2" mt={1}>
                {t('certification-warning')}
              </Typography>

              {(certifications ?? []).map((certificate, index) => (
                <Box
                  mt={2}
                  bgcolor="common.white"
                  p={3}
                  borderRadius={1}
                  key={certificate.id}
                >
                  <Typography color={theme.palette.grey[700]} fontWeight={600}>
                    {certificate.courseName}
                  </Typography>

                  <Typography color={theme.palette.grey[700]} mt={1}>
                    {certificate.number}
                  </Typography>

                  {certificate.expiryDate ? (
                    isPast(new Date(certificate.expiryDate)) ? (
                      <Alert
                        severity={index === 0 ? 'error' : 'info'}
                        sx={{ mt: 1 }}
                      >
                        {t('course-certificate.expired-on', {
                          date: certificate.expiryDate,
                        })}
                        ({formatDistanceToNow(new Date(certificate.expiryDate))}{' '}
                        {t('ago')})
                      </Alert>
                    ) : (
                      <Alert
                        variant="outlined"
                        severity="success"
                        sx={{ mt: 1 }}
                      >
                        {t('course-certificate.active-until', {
                          date: certificate.expiryDate,
                        })}
                        ({t('course-certificate.expires-in')}{' '}
                        {formatDistanceToNow(new Date(certificate.expiryDate))}
                        ).
                      </Alert>
                    )
                  ) : null}
                </Box>
              ))}

              {go1Licenses?.length ? (
                <Box mt={3}>
                  <UserGo1License
                    license={go1Licenses[0]}
                    editable={true}
                    onDeleted={mutate}
                  />
                </Box>
              ) : null}

              <Box
                mt={2}
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(navigateBackPath, { replace: true })}
                >
                  {t('cancel')}
                </Button>

                <LoadingButton
                  variant="contained"
                  color="primary"
                  sx={{ ml: 1 }}
                  type="submit"
                  loading={loading}
                >
                  {t('save-changes')}
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>

      <Dialog
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        title={t('common.course-certificate.update-certification-details')}
        maxWidth={600}
      >
        <ImportCertificateModal
          onCancel={() => setShowImportModal(false)}
          onSubmit={async () => {
            await mutate()
            setShowImportModal(false)
          }}
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
