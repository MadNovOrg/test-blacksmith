import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React, {
  SyntheticEvent,
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

import { useJobTitles } from '@app/components/JobTitleSelector/useJobTitles'
import { DEFAULT_PHONE_COUNTRY_UK } from '@app/components/PhoneNumberInput'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { useAuth } from '@app/context/auth'
import {
  GetProfileDetailsQuery,
  ImportLegacyCertificateMutation,
} from '@app/generated/graphql'
import { CertificationsAlerts } from '@app/modules/profile/components/CertificationsAlerts'
import { EditProfileOrganizationsSection } from '@app/modules/profile/components/EditProfileOrganizationsSection'
import { EditRoles } from '@app/modules/profile/components/EditRoles/UK'
import { ImportCertificateModal } from '@app/modules/profile/components/ImportCertificateModal'
import { ProfilePermissions } from '@app/modules/profile/components/Permissions/Permissions'
import { PersonalDetailsSection } from '@app/modules/profile/components/PersonalDetailsSection'
import { UploadAvatarAndCTAButtons } from '@app/modules/profile/components/UploadAvatarAndCTAButtons'
import { UserGo1License } from '@app/modules/profile/components/UserGo1License'
import { useFormSubmit } from '@app/modules/profile/hooks/useFormSubmit'
import useProfile from '@app/modules/profile/hooks/useProfile/useProfile'
import useRoles from '@app/modules/profile/hooks/useRoles'
import { useUpdateProfile } from '@app/modules/profile/hooks/useUpdateProfile'
import {
  ukDefaultTrainerRoles as defaultTrainerRoles,
  ukTrainerRolesNames as trainerRolesNames,
  AgreementTypeNames,
} from '@app/modules/profile/utils'
import { RoleName } from '@app/types'
import { Shards } from '@app/util'

import {
  getDietaryRestrictionsValue,
  getDisabilitiesValue,
  editProfileFormSchema,
  EditProfileInputs,
  navigateBackPath,
  profileEditDefaultValues,
} from '../utils'

export const EditProfilePage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const [isManualFormError, setIsManualFormError] = useState(false)

  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { profile: currentUserProfile, acl } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const jobTitles = useJobTitles(Shards.UK)
  const orgId = searchParams.get('orgId')

  const importCertificateModalRef = useRef<
    ImportLegacyCertificateMutation | undefined
  >(undefined)

  const {
    removeOrgMemberFetching,
    updateOrgMemberFetching,
    updateProfileFetching,
    updateProfileRolesFetching,
    updateTrainerRolesFetching,
    updateTrainerAgreementTypesFetching,
  } = useUpdateProfile()

  const { onSubmit } = useFormSubmit()

  const [callProfileParams, setCallProfileParams] = useState({
    id: id ?? currentUserProfile?.id,
    courseId: undefined,
    orgId: orgId ?? undefined,
    userCourses: false,
    refreshProfileData: false,
  })

  const { profile, certifications, go1Licenses } = useProfile(
    callProfileParams.id,
    callProfileParams.courseId,
    callProfileParams.orgId,
    callProfileParams.userCourses,
    callProfileParams.refreshProfileData,
    acl.canManageKnowledgeHubAccess(),
  )

  const isProfileStaleRef = useRef(false)
  const { roles: systemRoles } = useRoles()
  const isMyProfile = !id

  const [showImportModal, setShowImportModal] = useState(false)

  const canEditRoles = acl.canEditRoles()

  const defaultDietaryRestrictionsRadioValue = useMemo(() => {
    return getDietaryRestrictionsValue({
      restrictions: profile?.dietaryRestrictions,
    })
  }, [profile?.dietaryRestrictions])

  const defaultDisabilitiesRadioValue = useMemo(() => {
    return getDisabilitiesValue({
      disabilities: profile?.disabilities,
    })
  }, [profile?.disabilities])

  const methods = useForm<EditProfileInputs>({
    resolver: yupResolver(editProfileFormSchema()),
    defaultValues: {
      avatar: '',
      firstName: '',
      surname: '',
      countryCode: '',
      canAccessKnowledgeHub: false,
      phone: '',
      phoneCountryCode: DEFAULT_PHONE_COUNTRY_UK,
      dietaryRestrictionRadioValue: defaultDietaryRestrictionsRadioValue,
      disabilitiesRadioValue: defaultDisabilitiesRadioValue,
      dob: null,
      jobTitle: '',
      disabilities: undefined,
      dietaryRestrictions: undefined,
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
    handleSubmit,

    setValue,
    watch,
  } = methods

  const values = watch()

  const isOtherJobTitle = useMemo(() => {
    return Boolean(profile?.jobTitle && !jobTitles.includes(profile.jobTitle))
  }, [jobTitles, profile?.jobTitle])
  useEffect(() => {
    profileEditDefaultValues({
      setValue,
      isProfileStaleRef,
      isOtherJobTitle,
      trainerRolesNames,
      defaultTrainerRoles,
      trainerAgreementTypes: AgreementTypeNames,
      profile,
    })
  }, [
    isOtherJobTitle,
    profile,
    setValue,
    defaultDietaryRestrictionsRadioValue,
    defaultDisabilitiesRadioValue,
  ])

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

  const loading = useMemo(
    () =>
      [
        updateProfileFetching,
        updateProfileRolesFetching,
        updateTrainerRolesFetching,
        updateOrgMemberFetching,
        removeOrgMemberFetching,
        updateTrainerAgreementTypesFetching,
      ].some(v => v),
    [
      updateProfileFetching,
      updateProfileRolesFetching,
      updateTrainerRolesFetching,
      updateOrgMemberFetching,
      removeOrgMemberFetching,
      updateTrainerAgreementTypesFetching,
    ],
  )

  const onAccessToKnowledgeHubChange = useCallback(
    (e: SyntheticEvent, checked: boolean) => {
      setValue('canAccessKnowledgeHub', checked)
    },
    [setValue],
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
            onSubmit={handleSubmit(data =>
              onSubmit({
                data,
                isManualFormError,
                profile,
                values,
              }),
            )}
            data-testid="EditProfileForm"
            noValidate
            autoComplete="off"
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <FormProvider {...methods}>
              <UploadAvatarAndCTAButtons profile={profile} loading={loading} />
            </FormProvider>

            <Grid item md={8}>
              <Typography variant="subtitle2" mb={1}>
                {t('personal-details')}
              </Typography>

              <FormProvider {...methods}>
                <PersonalDetailsSection
                  profile={profile}
                  setIsManualFormError={setIsManualFormError}
                />
              </FormProvider>

              {acl.canSeeProfileRoles() && canEditRoles ? (
                <>
                  <Typography variant="subtitle2" mb={1} mt={3}>
                    {t('pages.view-profile.connect-access')}
                  </Typography>
                  <EditRoles />
                </>
              ) : null}

              {acl.canManageKnowledgeHubAccess() ? (
                <ProfilePermissions
                  checked={Boolean(values.canAccessKnowledgeHub)}
                  onChange={onAccessToKnowledgeHubChange}
                  profileId={profile.id}
                />
              ) : null}

              <FormProvider {...methods}>
                <EditProfileOrganizationsSection profile={profile} />
              </FormProvider>

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
                  onClick={() =>
                    navigate(navigateBackPath(orgId), { replace: true })
                  }
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
    </Box>
  )
}
