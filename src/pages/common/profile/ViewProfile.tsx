import ArchiveIcon from '@mui/icons-material/Archive'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { formatDistanceToNow, isPast } from 'date-fns'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { Avatar } from '@app/components/Avatar'
import { BackButton } from '@app/components/BackButton'
import { CertificateStatusChip } from '@app/components/CertificateStatusChip'
import { CoursePrerequisitesAlert } from '@app/components/CoursePrerequisitesAlert'
import { DetailsRow } from '@app/components/DetailsRow'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'
import { Course_Status_Enum } from '@app/generated/graphql'
import useProfile from '@app/hooks/useProfile'
import { ProfileArchiveDialog } from '@app/pages/common/profile/components/ProfileArchiveDialog'
import { CertificateStatus } from '@app/types'
import { LoadingStatus } from '@app/util'

import { CourseAsTrainer } from './components/CourseAsTrainer'
import { InviteUserToOrganisation } from './components/InviteUserToOrganisation'
import { ProfileDeleteDialog } from './components/ProfileDeleteDialog'
import { TableMenu, TableMenuSelections } from './components/TableMenu'
import { UserGo1License } from './components/UserGo1License'
import { getRoleColor } from './utils'

type ViewProfilePageProps = unknown

export const ViewProfilePage: React.FC<
  React.PropsWithChildren<ViewProfilePageProps>
> = () => {
  const { t } = useTranslation()
  const { profile: currentUserProfile, verified, acl } = useAuth()
  const [selectedTab, setSelectedTab] = useState(0)
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showInviteOrgModal, setShowInviteOrgModal] = useState(false)

  const orgId = searchParams.get('orgId')

  const { profile, go1Licenses, certifications, status, mutate } = useProfile(
    id ?? currentUserProfile?.id,
    undefined,
    orgId ?? undefined,
    acl.canViewCourseHistory()
  )

  const isMyProfile = !id

  if (status === LoadingStatus.FETCHING) {
    return <CircularProgress />
  }

  if (!profile) {
    return (
      <Alert severity="error" variant="outlined">
        {t('common.errors.generic.loading-error')}
      </Alert>
    )
  }

  if (!acl.canViewProfiles() && !isMyProfile) {
    return (
      <Box pb={6} pt={3} flex={1}>
        <Container>
          <Grid container>
            <Grid item sm={12}>
              <BackButton label={t('common.back')} />
            </Grid>
            <Grid item sm={12}>
              <Alert severity="error" variant="outlined">
                {t('common.errors.user-permission')}
              </Alert>
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }

  const editAllowed = !profile.archived && (!id || acl.canEditProfiles())

  const archiveAllowed =
    !profile.archived && acl.canArchiveProfile() && !isMyProfile

  const deleteAllowed =
    currentUserProfile?.id !== profile.id && // can't delete yourself
    !profile.archived && // can't delete archived profiles
    certifications?.length === 0 && // can't delete if you have certifications
    (acl.isTTAdmin() || acl.isTTOps()) // only TT Admins and TT Ops can delete

  const certificateExpired = (expiryDate: string) =>
    isPast(new Date(expiryDate))

  const editProFilePath = orgId ? `./edit?orgId=${orgId}` : './edit'

  return (
    <Box bgcolor="grey.100" pb={6} pt={3} flex={1}>
      <Container>
        <Grid container flexDirection={isMobile ? 'column' : 'row'}>
          <Grid item sm={12}>
            <BackButton label={t('common.back')} />
          </Grid>
          <Grid
            item
            md={4}
            display="flex"
            flexDirection="column"
            alignItems={isMobile ? 'left' : 'center'}
          >
            <Avatar
              src={profile.avatar ?? ''}
              name={profile.archived ? undefined : profile.fullName ?? ''}
              size={isMobile ? 70 : 220}
              sx={{ mb: 4 }}
            >
              {profile.archived ? (
                <CloseIcon sx={{ transform: 'scale(5)' }} />
              ) : null}
            </Avatar>
            <Box display={'flex'} flexDirection={'column'}>
              <Typography variant="h1">
                {profile.archived
                  ? t('common.archived-profile')
                  : profile.fullName}
              </Typography>
              {!profile.archived ? (
                <Typography variant="body1" color="grey.700">
                  {profile.email}
                </Typography>
              ) : null}
            </Box>

            {editAllowed ? (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(editProFilePath, { replace: true })}
                  startIcon={<EditIcon />}
                  fullWidth={isMobile}
                  sx={{ mt: 5 }}
                  data-testid="edit-profile"
                >
                  {t('edit-profile')}
                </Button>
              </Box>
            ) : null}

            {archiveAllowed ? (
              <Box>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => setShowArchiveDialog(true)}
                  fullWidth={isMobile}
                  startIcon={<ArchiveIcon />}
                  sx={{ mt: 2 }}
                >
                  {t('archive-profile')}
                </Button>
              </Box>
            ) : null}

            {deleteAllowed ? (
              <Box>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setShowDeleteDialog(true)}
                  fullWidth={isMobile}
                  startIcon={<DeleteIcon />}
                  sx={{ mt: 2 }}
                  data-testid="delete-profile-button"
                >
                  {t('delete-profile')}
                </Button>
              </Box>
            ) : null}

            {acl.canInviteToOrganizations() && !profile.archived ? (
              <Box>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  fullWidth={isMobile}
                  onClick={() => setShowInviteOrgModal(true)}
                  data-testid="edit-invite-user-to-org"
                  sx={{ mt: 2 }}
                >
                  {t(
                    'pages.org-details.tabs.users.invite-individual-to-organization'
                  )}
                </Button>
              </Box>
            ) : undefined}
          </Grid>
          <Grid item md={8}>
            {isMyProfile ? (
              <>
                {verified ? (
                  <CoursePrerequisitesAlert
                    sx={{ mb: 4, mt: isMobile ? 2 : 0 }}
                  />
                ) : null}

                {!verified && (
                  <Alert
                    variant="standard"
                    color="error"
                    severity="error"
                    sx={{ py: 0, mb: 4 }}
                    action={
                      <Button
                        size="small"
                        variant="text"
                        color="primary"
                        component={LinkBehavior}
                        href="/verify"
                      >
                        {t('verify')}
                      </Button>
                    }
                  >
                    <Typography variant="body2">
                      {t('pages.my-profile.verify-email-notice')}
                    </Typography>
                  </Alert>
                )}
              </>
            ) : null}

            {isMobile ? (
              <TableMenu
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            ) : null}

            {!isMobile ||
            selectedTab === TableMenuSelections.PERSONAL_DETAILS ? (
              <Box>
                <Typography variant="subtitle2" mt={4} mb={1}>
                  {t('personal-details')}
                </Typography>

                {profile.archived ? (
                  <Alert severity="error" variant="standard">
                    {t('pages.my-profile.this-is-an-archived-user')}
                  </Alert>
                ) : (
                  <Box
                    data-testid="personal-details-container"
                    bgcolor="common.white"
                    p={3}
                    borderRadius={1}
                  >
                    <Stack spacing={2}>
                      <DetailsRow
                        data-testid="profile-first-name"
                        label={t('first-name')}
                        value={profile.givenName}
                      />
                      <DetailsRow
                        data-testid="profile-surname"
                        label={t('surname')}
                        value={profile.familyName}
                      />
                      <DetailsRow
                        data-testid="profile-email"
                        label={t('email')}
                        value={profile.email}
                      />
                      <DetailsRow
                        data-testid="profile-phone"
                        label={t('phone')}
                        value={profile.phone}
                      />
                      <DetailsRow
                        data-testid="profile-dob"
                        label={t('dob')}
                        value={t('dates.default', { date: profile.dob })}
                      />
                      <DetailsRow
                        data-testid="profile-job-title"
                        label={t('job-title')}
                        value={profile.jobTitle}
                      />
                      <DetailsRow
                        data-testid="profile-dietary-restrictions"
                        label={t('dietary-restrictions')}
                        value={
                          profile.dietaryRestrictions === ''
                            ? '--'
                            : profile.dietaryRestrictions
                        }
                      />
                      <DetailsRow
                        data-testid="profile-disabilities"
                        label={t('disabilities')}
                        value={
                          profile.disabilities === ''
                            ? '--'
                            : profile.disabilities
                        }
                      />
                    </Stack>
                  </Box>
                )}
                {acl.canSeeProfileRoles() && (
                  <>
                    <Typography variant="subtitle2" mb={1} mt={3}>
                      {t('pages.view-profile.hub-access')}
                    </Typography>

                    <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
                      <DetailsRow label={t('pages.view-profile.user-role')}>
                        <Box flex={1}>
                          {profile.roles.map(({ role }) => (
                            <Chip
                              key={role.name}
                              label={t(
                                `pages.view-profile.roles.${role?.name}`
                              )}
                              color={getRoleColor(role.name)}
                              sx={{ marginRight: 1, marginBottom: 0.5 }}
                            />
                          ))}
                          {profile.trainer_role_types.map(
                            ({ trainer_role_type }) => (
                              <Chip
                                key={trainer_role_type.name}
                                label={t(
                                  `trainer-role-types.${trainer_role_type?.name}`
                                )}
                                sx={{ marginRight: 1, marginBottom: 0.5 }}
                              />
                            )
                          )}
                        </Box>
                      </DetailsRow>
                    </Box>
                  </>
                )}
              </Box>
            ) : null}

            {!isMobile || selectedTab === TableMenuSelections.ORG_DETAILS ? (
              <>
                <Typography variant="subtitle2" mb={1} mt={3}>
                  {t('org-details')}
                </Typography>
                <Box sx={{ mt: 1, overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          '&&.MuiTableRow-root': {
                            backgroundColor: 'grey.300',
                          },
                          '&& .MuiTableCell-root': {
                            py: 1,
                            color: 'grey.700',
                            fontWeight: '600',
                          },
                        }}
                      >
                        <TableCell>{t('organization')}</TableCell>
                        <TableCell>{t('group')}</TableCell>
                        <TableCell>{t('position')}</TableCell>
                        <TableCell>{t('permissions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profile.organizations.length ? (
                        profile.organizations.map(orgMember => (
                          <TableRow
                            key={orgMember.id}
                            sx={{
                              '&&.MuiTableRow-root': {
                                backgroundColor: 'common.white',
                              },
                            }}
                          >
                            <TableCell>
                              {orgMember.organization?.name}
                            </TableCell>
                            <TableCell>
                              {orgMember.organization?.trustName}
                            </TableCell>
                            <TableCell>{orgMember.position}</TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  orgMember.isAdmin
                                    ? t(
                                        'pages.org-details.tabs.users.organization-admin'
                                      )
                                    : t(
                                        'pages.org-details.tabs.users.no-permissions'
                                      )
                                }
                                color={orgMember.isAdmin ? 'success' : 'gray'}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow
                          sx={{
                            '&&.MuiTableRow-root': {
                              backgroundColor: 'common.white',
                            },
                          }}
                        >
                          <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                            {t('pages.my-profile.user-is-not-assigned-to-org')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </>
            ) : null}
            {!isMobile ||
            selectedTab === TableMenuSelections.COURSE_ATTENDEE ? (
              <>
                <Typography variant="subtitle2" mb={1} mt={3}>
                  {t('course-as-attendee')}
                </Typography>
                <Box sx={{ mt: 1, overflowX: 'auto' }}>
                  <Table data-testid="course-as-attendee" sx={{ mt: 1 }}>
                    <TableHead>
                      <TableRow
                        sx={{
                          '&&.MuiTableRow-root': {
                            backgroundColor: 'grey.300',
                          },
                          '&& .MuiTableCell-root': {
                            py: 1,
                            color: 'grey.700',
                            fontWeight: '600',
                          },
                        }}
                      >
                        <TableCell>{t('course-name')}</TableCell>
                        <TableCell>{t('action')}</TableCell>
                        <TableCell>{t('date')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profile.participantAudits?.map(row => {
                        return (
                          <TableRow
                            key={row.id}
                            sx={{
                              '&&.MuiTableRow-root': {
                                backgroundColor: 'common.white',
                              },
                            }}
                            data-testid={`course-row-${row.course_id}`}
                          >
                            <TableCell data-testid="course-name">
                              <Link href={`/courses/${row.course_id}/details`}>
                                {row.course.name}
                              </Link>
                            </TableCell>
                            <TableCell data-testid="course-action">
                              {t(`participant-audit-types.${row.type}`)}
                            </TableCell>
                            <TableCell data-testid="course-date">
                              {t('dates.defaultShort', {
                                date: row.course.dates.aggregate?.end?.date,
                              })}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {profile.courses.map(row => {
                        if (row.course.status !== Course_Status_Enum.Cancelled)
                          return

                        return (
                          <TableRow
                            key={row.id}
                            sx={{
                              '&&.MuiTableRow-root': {
                                backgroundColor: 'common.white',
                              },
                            }}
                          >
                            <TableCell>{row.course.name}</TableCell>
                            <TableCell>
                              {t(`course-statuses.${row.course.status}`)}
                            </TableCell>
                            <TableCell>-</TableCell>
                          </TableRow>
                        )
                      })}

                      {(profile.participantAudits?.length ?? 0) +
                        profile.courses.length <
                      1 ? (
                        <TableRow
                          sx={{
                            '&&.MuiTableRow-root': {
                              backgroundColor: 'common.white',
                            },
                          }}
                        >
                          <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                            {t('pages.my-profile.no-course-history')}
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </Box>
              </>
            ) : null}

            {!isMobile || selectedTab === TableMenuSelections.COURSE_TRAINER ? (
              <>
                {acl.canViewCourseHistory() && (
                  <>
                    <Typography variant="subtitle2" mb={1} mt={3}>
                      {t('course-as-trainer')}
                    </Typography>
                    <CourseAsTrainer profile={profile} />
                  </>
                )}
              </>
            ) : null}

            {!isMobile || selectedTab === TableMenuSelections.CERTIFICATIONS ? (
              <>
                {verified && (
                  <>
                    <Typography variant="subtitle2" mt={3}>
                      {t('certifications')}
                    </Typography>
                    <Box sx={{ mt: 1, overflowX: 'auto' }}>
                      <Table>
                        <TableHead>
                          <TableRow
                            sx={{
                              '&&.MuiTableRow-root': {
                                backgroundColor: 'grey.300',
                              },
                              '&& .MuiTableCell-root': {
                                py: 1,
                                color: 'grey.700',
                                fontWeight: '600',
                              },
                            }}
                          >
                            <TableCell>{t('course-name')}</TableCell>
                            <TableCell>{t('certificate')}</TableCell>
                            <TableCell>{t('status')}</TableCell>
                            <TableCell>{t('certificate')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(certifications ?? []).map(certificate => {
                            const isRevoked =
                              certificate.status === CertificateStatus.REVOKED

                            return (
                              <TableRow
                                data-testid={
                                  'certificate-' + certificate.number
                                }
                                key={certificate.id}
                                sx={{
                                  '&&.MuiTableRow-root': {
                                    backgroundColor: 'common.white',
                                  },
                                }}
                              >
                                <TableCell>{certificate.courseName}</TableCell>
                                <TableCell>{certificate.number}</TableCell>
                                <TableCell>
                                  <Grid
                                    container
                                    direction="column"
                                    alignItems="start"
                                  >
                                    {certificate.status ? (
                                      <CertificateStatusChip
                                        status={
                                          certificate.status as CertificateStatus
                                        }
                                        tooltip={
                                          certificate.participant
                                            ?.certificateChanges[0]?.payload
                                            ?.note
                                        }
                                      />
                                    ) : null}
                                    {!isRevoked && (
                                      <Typography
                                        mt={1}
                                        variant="body2"
                                        color="grey.700"
                                      >
                                        {certificateExpired(
                                          certificate.expiryDate ?? ''
                                        )
                                          ? `${formatDistanceToNow(
                                              new Date(certificate.expiryDate)
                                            )} ${t('common.ago')}`
                                          : certificate.expiryDate}
                                      </Typography>
                                    )}
                                  </Grid>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ ml: 2 }}
                                    onClick={() =>
                                      navigate(
                                        `/certification/${certificate.id}`
                                      )
                                    }
                                    disabled={
                                      isRevoked && !acl.canViewRevokedCert()
                                    }
                                  >
                                    {t(
                                      'components.certification-list.view-certificate'
                                    )}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </Box>
                  </>
                )}
              </>
            ) : null}

            {go1Licenses?.length ? (
              <Box mt={3}>
                <UserGo1License license={go1Licenses[0]} editable={false} />
              </Box>
            ) : null}

            <Box mt={5}>
              <Link
                href={import.meta.env.VITE_MANAGE_ACCOUNT_URL}
                target="_blank"
                rel="noopener noreferrer"
                underline="always"
                sx={{ mr: 2 }}
                component="a"
                aria-label={`${t('pages.my-profile.manage-data')} (${t(
                  'opens-new-window'
                )})`}
              >
                {t('pages.my-profile.manage-data')}
              </Link>
              <Link
                href={import.meta.env.VITE_UNSUBSCRIBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                underline="always"
                component="a"
                aria-label={`${t('pages.my-profile.unsubscribe')} (${t(
                  'opens-new-window'
                )})`}
              >
                {t('pages.my-profile.unsubscribe')}
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={showInviteOrgModal}
        onClose={() => setShowInviteOrgModal(false)}
        title={t('pages.invite-to-org.title')}
        maxWidth={'md'}
      >
        <InviteUserToOrganisation
          email={profile.email || ''}
          onClose={() => setShowInviteOrgModal(false)}
        />
      </Dialog>

      {showArchiveDialog && id ? (
        <ProfileArchiveDialog
          onClose={async () => {
            setShowArchiveDialog(false)
            await mutate()
          }}
          profileId={id}
        />
      ) : null}

      {showDeleteDialog && id ? (
        <ProfileDeleteDialog
          onClose={() => {
            setShowDeleteDialog(false)
          }}
          onSuccess={() => {
            navigate(-1)
            setShowDeleteDialog(false)
          }}
          profileId={id}
        />
      ) : null}
    </Box>
  )
}
