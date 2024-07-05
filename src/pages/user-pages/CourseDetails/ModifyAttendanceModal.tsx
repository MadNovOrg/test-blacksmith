import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { Dialog } from '@app/components/dialogs'
import { LinkBehavior } from '@app/components/LinkBehavior'
import {
  CancelMyselfFromCourseMutation,
  CancelMyselfFromCourseMutationVariables,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { CancelAttendanceForm } from '@app/modules/course_attendees/pages/CancelAttendanceForm'
import { CANCEL_MYSELF_FROM_COURSE_MUTATION } from '@app/queries/courses/cancel-myself-from-course'
import { Course } from '@app/types'

import { ParticipantTransferInfo } from './ParticipantTransferInfo'

type ModifyAttendanceModalProps = {
  course: Course
  onClose: () => void
}

export enum ACTION_TYPE {
  CANCEL = 'CANCEL',
  TRANSFER = 'TRANSFER',
}

export const ModifyAttendanceModal: React.FC<
  React.PropsWithChildren<ModifyAttendanceModalProps>
> = function ({ course, onClose }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [courseAction, setCourseAction] = useState({
    agreeCancellation: false,
    agreeTransfer: false,
  })

  const [selectedAction, setSelectedAction] = useState<ACTION_TYPE>(
    ACTION_TYPE.CANCEL,
  )

  const handleAgreeTerms = (actionType: ACTION_TYPE, isChecked: boolean) => {
    if (actionType === ACTION_TYPE.CANCEL) {
      setCourseAction(prev => ({
        ...prev,
        agreeCancellation: isChecked,
        agreeTransfer: false,
      }))
    } else {
      setCourseAction(prev => ({
        ...prev,
        agreeTransfer: isChecked,
        agreeCancellation: false,
      }))
    }
  }

  const [{ data, fetching, error }, cancelMyselfFromCourse] = useMutation<
    CancelMyselfFromCourseMutation,
    CancelMyselfFromCourseMutationVariables
  >(CANCEL_MYSELF_FROM_COURSE_MUTATION)

  const onCancelCourseSubmit = async () => {
    await cancelMyselfFromCourse({
      courseId: course.id,
    })
  }

  useEffect(() => {
    if (data && !error) {
      navigate('/courses', {
        state: {
          courseCode: course.course_code,
        },
      })
    }
  }, [course.course_code, data, error, navigate, t])

  return (
    <Container>
      <Dialog
        open={true}
        onClose={onClose}
        title={
          <Typography
            variant="h3"
            data-testid="change-my-attendance-modal-title"
          >
            {t('pages.course-details.change-my-attendance.title')}
          </Typography>
        }
        maxWidth={800}
      >
        <Typography variant="body1" color="grey.600" mt={1}>
          {t('pages.course-details.change-my-attendance.description')}
        </Typography>

        <Box
          display="flex"
          justifyContent="stretch"
          mt={2}
          borderBottom={1}
          borderColor="divider"
        >
          <FormControl fullWidth>
            <RadioGroup
              row
              name="modify-attendance-action-type"
              onChange={e =>
                setSelectedAction(e.currentTarget.value as ACTION_TYPE)
              }
              value={selectedAction}
            >
              <FormControlLabel
                value={ACTION_TYPE.CANCEL}
                label={t(
                  'pages.course-details.change-my-attendance.cancel-my-attendance',
                )}
                control={<Radio />}
              />
              <FormControlLabel
                value={ACTION_TYPE.TRANSFER}
                label={t(
                  'pages.course-details.change-my-attendance.transfer-to-another-course',
                )}
                control={<Radio />}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box>
          {selectedAction === ACTION_TYPE.CANCEL ? (
            <CancelAttendanceForm
              course={course}
              onAgreeTerms={handleAgreeTerms}
              cancellationError={error?.message}
            />
          ) : null}
          {selectedAction === ACTION_TYPE.TRANSFER ? (
            <ParticipantTransferInfo
              startDate={new Date(course.schedule[0].start)}
              courseLevel={course.level}
              onAgreeTerms={handleAgreeTerms}
            />
          ) : null}
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          mt={4}
          flexDirection={isMobile ? 'column' : 'row'}
        >
          <Button
            type="button"
            variant="text"
            color="primary"
            fullWidth={isMobile}
            onClick={onClose}
          >
            {t('pages.edit-course.cancellation-modal.close-modal')}
          </Button>

          {selectedAction === ACTION_TYPE.CANCEL && (
            <LoadingButton
              loading={fetching}
              disabled={
                course.type === Course_Type_Enum.Open &&
                !courseAction.agreeCancellation
              }
              onClick={onCancelCourseSubmit}
              type="button"
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
              fullWidth={isMobile}
            >
              {t('pages.edit-course.cancellation-modal.cancel-entire-course')}
            </LoadingButton>
          )}

          {selectedAction === ACTION_TYPE.TRANSFER && (
            <Button
              disabled={!courseAction.agreeTransfer}
              variant="contained"
              component={LinkBehavior}
              fullWidth={isMobile}
              href="../transfer"
            >
              {t(
                'pages.course-details.change-my-attendance.transfer-info.transfer-btn-text',
              )}
            </Button>
          )}
        </Box>

        {!selectedAction ? (
          <Box display="flex" mt={4}>
            <Button
              type="button"
              variant="text"
              color="primary"
              onClick={onClose}
            >
              {t('common.close-modal')}
            </Button>
          </Box>
        ) : null}
      </Dialog>
    </Container>
  )
}
