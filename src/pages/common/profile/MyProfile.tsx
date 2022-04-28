import EditIcon from '@mui/icons-material/Edit'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@app/components/Avatar'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'
import useProfileCertifications from '@app/hooks/useProfileCertifications'
import theme from '@app/theme'
import { CourseParticipant } from '@app/types'
import { COURSE_TYPE_TO_PREFIX, LoadingStatus } from '@app/util'

type MyProfilePageProps = unknown

const DetailsRow = ({
  label,
  value,
}: {
  label: string
  value: string | null
}) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Typography flex={1} color="grey.700">
      {label}
    </Typography>
    <Typography flex={2}>{value}</Typography>
  </Box>
)

export const MyProfilePage: React.FC<MyProfilePageProps> = () => {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const { missingPrerequisiteCertifications, data, status } =
    useProfileCertifications(profile?.id)

  const missingPrefs = useMemo(() => {
    if (!profile) return []
    const missing = []
    if (profile.dietaryRestrictions === null) {
      missing.push(t('dietary-restrictions'))
    }
    if (profile.disabilities === null) {
      missing.push(t('disabilities'))
    }
    if (missingPrerequisiteCertifications) {
      missing.push(t('certification-details'))
    }
    return missing
  }, [profile, t, missingPrerequisiteCertifications])

  const certificatesData = data?.filter(cp => cp.certificate) ?? []

  if (!profile || status === LoadingStatus.FETCHING) {
    return <CircularProgress />
  }

  return (
    <Box bgcolor="grey.100" pb={6} pt={3}>
      <Container>
        <Grid container>
          <Grid
            item
            md={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              src={profile.avatar}
              name={profile.fullName}
              size={220}
              sx={{ mb: 4 }}
            />
            <Typography variant="h1" whiteSpace="nowrap">
              {profile.fullName}
            </Typography>
            <Typography variant="body1" color="grey.700">
              {profile.email}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              component={LinkBehavior}
              href="edit"
              startIcon={<EditIcon />}
              sx={{ mt: 5 }}
            >
              {t('edit-profile')}
            </Button>
          </Grid>
          <Grid item md={8}>
            {missingPrefs && missingPrefs.length > 0 ? (
              <Alert
                variant="standard"
                color="error"
                severity="error"
                sx={{ mb: 4 }}
              >
                <div>{t('pages.my-profile.missing-details-header')}</div>
                <ul>
                  {missingPrefs.map(msg => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              </Alert>
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
              {t('org-details')}
            </Typography>
            <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
              <DetailsRow
                label={t('org-name')}
                value={profile.organizations
                  .map(o => o.organization.name)
                  .join(', ')}
              />
            </Box>

            <Grid
              mt={3}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="stretch"
            >
              <Typography variant="subtitle2">{t('certifications')}</Typography>
              <Button variant="outlined" color="primary">
                {t('pages.my-profile.add-certificate')}
              </Button>
            </Grid>

            <Typography variant="body2" mt={1}>
              {t('certification-warning')}
            </Typography>

            {certificatesData.map((cp: CourseParticipant, index) => (
              <Box
                mt={2}
                bgcolor="common.white"
                p={3}
                borderRadius={1}
                key={cp.id}
              >
                <Typography color={theme.palette.grey[700]} fontWeight={600}>
                  {cp.course.name} ({COURSE_TYPE_TO_PREFIX[cp.course.type]})
                </Typography>

                <Typography color={theme.palette.grey[700]} mt={1}>
                  {cp.certificate?.number}
                </Typography>

                {cp.certificate?.expiryDate ? (
                  isPast(new Date(cp.certificate.expiryDate)) ? (
                    <Alert
                      severity={index === 0 ? 'error' : 'info'}
                      sx={{ mt: 1 }}
                    >
                      {`${t('course-certificate.expired-on')} ${format(
                        new Date(cp.certificate.expiryDate),
                        'P'
                      )} (${formatDistanceToNow(
                        new Date(cp.certificate.expiryDate)
                      )} ${t('ago')})`}
                    </Alert>
                  ) : (
                    <Alert variant="outlined" severity="success" sx={{ mt: 1 }}>
                      {`${t('course-certificate.active-until')} ${format(
                        new Date(cp.certificate.expiryDate),
                        'P'
                      )} (${t(
                        'course-certificate.expires-in'
                      )} ${formatDistanceToNow(
                        new Date(cp.certificate.expiryDate)
                      )}).`}
                    </Alert>
                  )
                ) : null}
              </Box>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
