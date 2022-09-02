import EditIcon from '@mui/icons-material/Edit'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { formatDistanceToNow, isPast } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { Avatar } from '@app/components/Avatar'
import { BackButton } from '@app/components/BackButton'
import { CoursePrerequisitesAlert } from '@app/components/CoursePrerequisitesAlert'
import { DetailsRow } from '@app/components/DetailsRow'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'
import useProfile from '@app/hooks/useProfile'

import { UserGo1License } from './components/UserGo1License'
import { getRoleColor } from './utils'

type ViewProfilePageProps = unknown

export const ViewProfilePage: React.FC<ViewProfilePageProps> = () => {
  const { t } = useTranslation()
  const { profile: currentUserProfile, verified, acl } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const orgId = searchParams.get('orgId')

  const { profile, go1Licenses, certifications } = useProfile(
    id ?? currentUserProfile?.id,
    undefined,
    orgId ?? undefined
  )

  const isMyProfile = !id

  if (!profile) {
    return <CircularProgress />
  }

  const editAllowed =
    !id ||
    acl.isTTAdmin() ||
    currentUserProfile?.organizations.some(orgMember =>
      profile.organizations.some(
        profileOrgMember =>
          profileOrgMember.organization.id === orgMember.organization.id &&
          orgMember.isAdmin
      )
    )

  const certificateExpired = (expiryDate: string) =>
    isPast(new Date(expiryDate))

  return (
    <Box bgcolor="grey.100" pb={6} pt={3} flex={1}>
      <Container>
        <Grid container>
          <Grid item sm={12}>
            <BackButton label={t('common.back')} />
          </Grid>
          <Grid
            item
            md={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              src={profile.avatar ?? ''}
              name={profile.fullName ?? ''}
              size={220}
              sx={{ mb: 4 }}
            />
            <Typography variant="h1" whiteSpace="nowrap">
              {profile.fullName}
            </Typography>
            <Typography variant="body1" color="grey.700">
              {profile.email}
            </Typography>

            {editAllowed ? (
              <Button
                variant="contained"
                color="primary"
                component={LinkBehavior}
                href={orgId ? `edit?orgId=${orgId}` : 'edit'}
                startIcon={<EditIcon />}
                sx={{ mt: 5 }}
              >
                {t('edit-profile')}
              </Button>
            ) : null}
          </Grid>
          <Grid item md={8}>
            {isMyProfile ? (
              <>
                {verified ? <CoursePrerequisitesAlert sx={{ mb: 4 }} /> : null}

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
            <Typography variant="subtitle2" mb={1}>
              {t('personal-details')}
            </Typography>
            <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
              <DetailsRow label={t('first-name')} value={profile.givenName} />
              <DetailsRow label={t('surname')} value={profile.familyName} />
              <DetailsRow label={t('email')} value={profile.email} />
              <DetailsRow label={t('phone')} value={profile.phone} />
              <DetailsRow label={t('dob')} value={profile.dob} />
              <DetailsRow label={t('job-title')} value={profile.jobTitle} />
              <DetailsRow
                label={t('dietary-restrictions')}
                value={
                  profile.dietaryRestrictions === ''
                    ? '--'
                    : profile.dietaryRestrictions
                }
              />
              <DetailsRow
                label={t('disabilities')}
                value={
                  profile.disabilities === '' ? '--' : profile.disabilities
                }
              />
            </Box>
            <Typography variant="subtitle2" mb={1} mt={3}>
              {t('pages.view-profile.hub-access')}
            </Typography>
            <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
              <DetailsRow label={t('pages.view-profile.user-roles')}>
                <Box flex={1}>
                  {profile.roles.map(({ role }) => (
                    <Chip
                      key={role.name}
                      label={t(`pages.view-profile.roles.${role?.name}`)}
                      color={getRoleColor(role.name)}
                    />
                  ))}
                </Box>
              </DetailsRow>
            </Box>
            <Typography variant="subtitle2" mb={1} mt={3}>
              {t('org-details')}
            </Typography>
            <Table sx={{ mt: 1 }}>
              <TableHead>
                <TableRow
                  sx={{
                    '&&.MuiTableRow-root': {
                      backgroundColor: 'grey.300',
                    },
                    '&& .MuiTableCell-root': {
                      px: 2,
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
                      <TableCell>{orgMember.organization?.name}</TableCell>
                      <TableCell>{orgMember.organization?.trustName}</TableCell>
                      <TableCell>{orgMember.position}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            orgMember.isAdmin
                              ? t(
                                  'pages.org-details.tabs.users.organization-admin'
                                )
                              : t('pages.org-details.tabs.users.no-permissions')
                          }
                          color={orgMember.isAdmin ? 'success' : 'secondary'}
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
            {verified && (
              <>
                <Typography variant="subtitle2" mt={3}>
                  {t('certifications')}
                </Typography>

                <Table sx={{ mt: 1 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        '&&.MuiTableRow-root': {
                          backgroundColor: 'grey.300',
                        },
                        '&& .MuiTableCell-root': {
                          px: 2,
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
                    {(certifications ?? []).map(certificate => (
                      <TableRow
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
                            mb={2}
                            alignItems="start"
                          >
                            <Chip
                              label={
                                certificateExpired(certificate.expiryDate ?? '')
                                  ? t(
                                      `components.certification-list.status-expired`
                                    )
                                  : t(
                                      `components.certification-list.status-active`
                                    )
                              }
                              color={
                                certificateExpired(certificate.expiryDate ?? '')
                                  ? 'error'
                                  : 'success'
                              }
                              size="small"
                            />
                            <Typography mt={1} variant="body2" color="grey.700">
                              {certificateExpired(certificate.expiryDate ?? '')
                                ? `${formatDistanceToNow(
                                    new Date(certificate.expiryDate)
                                  )} ${t('common.ago')}`
                                : certificate.expiryDate}
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ ml: 2 }}
                            onClick={() =>
                              navigate(`/certification/${certificate.id}`)
                            }
                          >
                            {t(
                              'components.certification-list.view-certificate'
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}

            {go1Licenses?.length ? (
              <Box mt={3}>
                <UserGo1License license={go1Licenses[0]} editable={false} />
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
