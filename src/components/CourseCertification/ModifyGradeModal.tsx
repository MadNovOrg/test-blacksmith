import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { CourseGradingMenu } from '@app/components/CourseGradingMenu'
import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import { QUERY as GetCertificateChangelogsQuery } from '@app/queries/grading/get-certificate-changelog'
import { MUTATION, ParamsType } from '@app/queries/grading/update-grade'
import { QUERY as GetCourseParticipantQuery } from '@app/queries/participants/get-course-participant-by-id'
import theme from '@app/theme'
import { CourseParticipant } from '@app/types'

export type ModifyGradeModalProps = {
  participant: CourseParticipant
  onClose: () => void
}

const ModifyGradeModal: React.FC<ModifyGradeModalProps> = function ({
  participant,
  onClose,
}) {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { profile } = useAuth()
  const [error, setError] = useState<string>()
  const [note, setNote] = useState('')
  const [showNoteError, setShowNoteError] = useState(false)
  const [grade, setGrade] = useState(participant.grade)

  const { mutate: mutateCourseParticipant } = useSWR([
    GetCourseParticipantQuery,
    { id: participant.id },
  ])
  const { mutate: mutateChangelogs } = useSWR([
    GetCertificateChangelogsQuery,
    { participantId: participant.id },
  ])

  const submitHandler = useCallback(async () => {
    if (grade && participant.grade) {
      if (grade === participant.grade) {
        onClose()
      } else {
        setShowNoteError(!note)
        if (profile && note) {
          try {
            await fetcher<null, ParamsType>(MUTATION, {
              participantId: participant.id,
              oldGrade: participant.grade,
              newGrade: grade,
              note: note,
              authorId: profile.id,
            })
          } catch (e: unknown) {
            setError((e as Error).message)
          }
          await mutateCourseParticipant()
          await mutateChangelogs()
          onClose()
        }
      }
    }
  }, [
    fetcher,
    grade,
    mutateChangelogs,
    mutateCourseParticipant,
    note,
    onClose,
    participant,
    profile,
  ])

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert variant="outlined" color="warning" severity="warning">
            {t('common.course-certificate.modify-grade-modal.warning')}
          </Alert>
        </Grid>

        <Grid item xs={12} container rowGap={2}>
          <Grid item xs={6}>
            <Typography color={theme.palette.grey[700]} fontWeight={600}>
              {t('common.attendee')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color={theme.palette.grey[700]} fontWeight={600}>
              {t('pages.course-grading.title')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
              <Avatar />
              <Typography variant="body1">
                {participant.profile.fullName}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} container alignItems="center">
            <CourseGradingMenu
              initialValue={participant.grade}
              onChange={grade => setGrade(grade)}
              courseLevel={participant.course.level}
              courseDeliveryType={participant.course.deliveryType}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="filled"
              required
              error={showNoteError}
              helperText={
                showNoteError &&
                t('common.validation-errors.this-field-is-required')
              }
              placeholder={t(
                'common.course-certificate.modify-grade-modal.please-add-a-note'
              )}
              fullWidth
              value={note}
              onChange={event => setNote(event.target.value)}
            />
          </Grid>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            size="large"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            onClick={submitHandler}
          >
            {t(
              'common.course-certificate.modify-grade-modal.confirm-modification'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ModifyGradeModal
