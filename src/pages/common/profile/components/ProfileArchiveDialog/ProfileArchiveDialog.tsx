import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, Link, List, ListItem, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { useMemo } from 'react'
import { noop } from 'ts-essentials'

import { Dialog } from '@app/components/dialogs'
import { Course_Status_Enum } from '@app/generated/graphql'
import useProfile from '@app/hooks/useProfile'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

export type Props = {
  onClose?: () => void
  profileId: string
}

const ENDED_COURSES_STATUSES = [
  Course_Status_Enum.Cancelled,
  Course_Status_Enum.Completed,
]

export const ProfileArchiveDialog: React.FC<React.PropsWithChildren<Props>> = ({
  onClose = noop,
  profileId,
}) => {
  const { t, _t } = useScopedTranslation('components.profile-archive-dialog')

  const [error, setError] = React.useState<string>()

  const { profile, archive, upcomingCourses } = useProfile(
    profileId,
    undefined,
    undefined,
    true
  )

  const futureCoursesAsTrainer = useMemo(() => {
    if (profile) {
      return profile.courseAsTrainer.filter(
        courseTrainer =>
          !ENDED_COURSES_STATUSES.includes(
            courseTrainer.course.status ?? Course_Status_Enum.Draft
          )
      )
    }
    return []
  }, [profile])

  const futureCoursesAsParticipant = useMemo(() => {
    if (upcomingCourses) {
      return upcomingCourses.filter(
        course =>
          !ENDED_COURSES_STATUSES.includes(
            course.status ?? Course_Status_Enum.Draft
          )
      )
    }
    return []
  }, [upcomingCourses])

  const allowArchive =
    futureCoursesAsTrainer.length === 0 &&
    futureCoursesAsParticipant.length === 0

  const onSubmit = async () => {
    setError(undefined)
    try {
      await archive()
    } catch (e: unknown) {
      setError((e as Error).message)
    }
    onClose()
  }

  return (
    <Dialog open={true} onClose={onClose} title={t('title')}>
      {error ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 2, mt: 2 }}>
          {error}
        </Alert>
      ) : null}

      {futureCoursesAsTrainer.length > 0 ? (
        <>
          <Typography variant="body2">{t('trainer-for-courses')}</Typography>
          <List sx={{ listStyleType: 'disc', pl: 4 }}>
            {futureCoursesAsTrainer.map(courseTrainer => (
              <ListItem
                key={courseTrainer.id}
                sx={{
                  display: 'list-item',
                  paddingLeft: 0,
                  paddingY: '0.2em',
                  listStyleType: 'circle',
                }}
              >
                <Link
                  href={`/courses/${courseTrainer.course.id}/details`}
                  variant="body2"
                  underline="always"
                >
                  {courseTrainer.course.id} {courseTrainer.course.name}
                </Link>
              </ListItem>
            ))}
          </List>
          <Typography variant="body2">
            {t('trainer-for-courses-action')}
          </Typography>
        </>
      ) : futureCoursesAsParticipant.length > 0 ? (
        <>
          <Typography variant="body2">{t('course-participant')}</Typography>
          <List sx={{ listStyleType: 'disc', pl: 4 }}>
            {futureCoursesAsParticipant.map(course => (
              <ListItem
                key={course.id}
                sx={{
                  display: 'list-item',
                  paddingLeft: 0,
                  paddingY: '0.2em',
                  listStyleType: 'circle',
                }}
              >
                <Link
                  href={`/courses/${course.id}/details`}
                  variant="body2"
                  underline="always"
                >
                  {course.id} {course.name}
                </Link>
              </ListItem>
            ))}
          </List>
          <Typography variant="body2">
            {t('course-participant-action')}
          </Typography>
        </>
      ) : profile ? (
        <Typography variant="body2">
          {t('confirmation-message', {
            firstName: profile.givenName,
            lastName: profile.familyName,
            email: profile.email,
          })}
        </Typography>
      ) : null}

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={onClose}>{_t('cancel')}</Button>
        <LoadingButton
          type="submit"
          variant="contained"
          onClick={onSubmit}
          disabled={!allowArchive}
        >
          {t('archive')}
        </LoadingButton>
      </Box>
    </Dialog>
  )
}
