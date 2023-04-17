import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Dialog } from '@app/components/Dialog'
import { CancelAttendanceForm } from '@app/pages/user-pages/CourseDetails/CancelAttendanceForm'
import { Course } from '@app/types'

import { ParticipantTransferInfo } from './ParticipantTransferInfo'

type ModifyAttendanceModalProps = {
  course: Course
  onClose: () => void
}

enum ACTION_TYPE {
  CANCEL = 'CANCEL',
  TRANSFER = 'TRANSFER',
}

export const ModifyAttendanceModal: React.FC<
  React.PropsWithChildren<ModifyAttendanceModalProps>
> = function ({ course, onClose }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedAction, setSelectedAction] = useState<ACTION_TYPE>(
    ACTION_TYPE.CANCEL
  )

  return (
    <Container>
      <Dialog
        open={true}
        onClose={onClose}
        title={
          <Typography variant="h3">
            {t('pages.course-details.modify-my-attendance.title')}
          </Typography>
        }
        maxWidth={800}
      >
        <Typography variant="body1" color="grey.600" mt={1}>
          {t('pages.course-details.modify-my-attendance.description')}
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
                  'pages.course-details.modify-my-attendance.cancel-my-attendance'
                )}
                control={<Radio />}
              />
              <FormControlLabel
                value={ACTION_TYPE.TRANSFER}
                label={t(
                  'pages.course-details.modify-my-attendance.transfer-to-another-course'
                )}
                control={<Radio />}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {selectedAction === ACTION_TYPE.CANCEL ? (
          <CancelAttendanceForm
            course={course}
            onClose={onClose}
            onSubmit={() => navigate('/courses')}
          />
        ) : null}
        {selectedAction === ACTION_TYPE.TRANSFER ? (
          <ParticipantTransferInfo
            startDate={new Date(course.schedule[0].start)}
            onCancel={onClose}
            courseLevel={course.level}
          />
        ) : null}
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
