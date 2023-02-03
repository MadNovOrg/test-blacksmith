import {
  Alert,
  Box,
  Button,
  Link,
  List,
  ListItem,
  SxProps,
  Typography,
} from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import useProfile from '@app/hooks/useProfile'

type CoursePrerequisitesAlertProps = {
  courseId?: string
  sx?: SxProps
  showAction?: boolean
}

export const CoursePrerequisitesAlert: React.FC<
  CoursePrerequisitesAlertProps
> = ({ courseId, sx, showAction }) => {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { missingCertifications } = useProfile(profile?.id, courseId)

  const missingPrefs = useMemo(() => {
    if (!profile) return []
    const missing = []
    if (profile.dietaryRestrictions === null) {
      missing.push(t('dietary-restrictions'))
    }
    if (profile.disabilities === null) {
      missing.push(t('disabilities'))
    }
    return missing
  }, [profile, t])

  const showAlert =
    (missingPrefs && missingPrefs.length > 0) ||
    (missingCertifications && missingCertifications.length > 0)

  return (
    <>
      {showAlert ? (
        <Alert
          variant="standard"
          color="error"
          severity="error"
          sx={sx}
          action={
            showAction ? (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => navigate('/profile')}
              >
                {t('go-to-profile')}
              </Button>
            ) : null
          }
        >
          <Typography>
            {t('pages.my-profile.missing-details-header')}
          </Typography>
          <List sx={{ listStyleType: 'disc', pl: 4 }}>
            {missingPrefs.map(msg => (
              <ListItem
                key={msg}
                sx={{ display: 'list-item', paddingLeft: 0, paddingY: '0.2em' }}
              >
                <Typography>{msg}</Typography>
              </ListItem>
            ))}
            {missingCertifications && missingCertifications.length > 0 ? (
              <ListItem
                sx={{ display: 'list-item', paddingLeft: 0, paddingY: '0.2em' }}
              >
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                >
                  <Typography>{t('certification-details')}</Typography>
                  <List sx={{ listStyleType: 'disc', pl: 4 }}>
                    {missingCertifications.map(missingCertification => {
                      const levelsPart =
                        missingCertification.requiredCertificate
                          .map(l => t(`course-levels.${l}`))
                          .join(` ${t('or')} `)
                      return (
                        <ListItem
                          key={missingCertification.courseId}
                          sx={{
                            display: 'list-item',
                            paddingLeft: 0,
                            paddingY: '0.2em',
                            listStyleType: 'circle',
                          }}
                        >
                          <span>{`${levelsPart} ${t(
                            'missing-certification'
                          )} `}</span>
                          {courseId ? (
                            t('this-course')
                          ) : (
                            <Link
                              href={`/courses/${missingCertification.courseId}/details`}
                              variant="body2"
                              fontWeight="600"
                              color="primary"
                              underline="always"
                            >
                              {t('course-link', {
                                id: missingCertification.courseId,
                              })}
                            </Link>
                          )}
                        </ListItem>
                      )
                    })}
                  </List>
                </Box>
              </ListItem>
            ) : null}
          </List>
        </Alert>
      ) : null}
    </>
  )
}
