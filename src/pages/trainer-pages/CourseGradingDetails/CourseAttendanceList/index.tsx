import {
  Box,
  FormGroup,
  FormControlLabel,
  Typography,
  Avatar,
  Chip,
  Checkbox,
  ListItemButton,
} from '@mui/material'
import React, { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import theme from '@app/theme'

interface Props {
  participants: Array<{
    id: string
    attending: boolean
    name: string
    avatar?: string
  }>
  onChange?: (attendance: Record<string, boolean>) => void
}

export const CourseAttendanceList: React.FC<Props> = ({
  participants,
  onChange = noop,
}) => {
  const { t } = useTranslation()

  const [attendance, setAttendance] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const attending: Record<string, boolean> = {}
    participants.forEach(participant => {
      attending[participant.id] = participant.attending
    })

    setAttendance(attending)
  }, [participants])

  const attendingCount = useMemo(() => {
    const count = Object.values(attendance).reduce((count, attending) => {
      return count + (attending ? 1 : 0)
    }, 0)

    return count
  }, [attendance])

  const toggleParticipantAttendance = (id: string) => {
    const participantAttendance = attendance[id]
    const newAttendance = {
      ...attendance,
      [id]: !participantAttendance,
    }

    setAttendance(newAttendance)
    onChange(newAttendance)
  }

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked

    const newAttendance: Record<string, boolean> = {}

    participants.forEach(participant => {
      newAttendance[participant.id] = checked
    })

    setAttendance(newAttendance)
    onChange(newAttendance)
  }

  const checkboxLabel =
    attendingCount === participants.length
      ? t('pages.course-attendance.master-checkbox-label-checked')
      : t('pages.course-attendance.master-checkbox-label-unchecked')

  return (
    <Box>
      <Box
        paddingX={2}
        mb={0.5}
        sx={{
          backgroundColor: theme.palette.common.white,
          justifyContent: 'space-between',
          alignItems: 'center',
          display: 'flex',
          borderRadius: '4px',
        }}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={attendingCount === participants.length}
                onChange={toggleSelectAll}
              />
            }
            label={checkboxLabel}
          />
        </FormGroup>
        <Typography fontWeight={500}>
          {t('pages.course-attendance.attending-count', {
            count: attendingCount,
          })}
        </Typography>
      </Box>

      {participants.map(participant => (
        <ListItemButton
          disableGutters
          disableRipple
          key={participant.id}
          sx={{
            backgroundColor: theme.palette.common.white,
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex',
            borderRadius: '4px',
            marginBottom: '5px',
            padding: '10px 15px 10px 5px',
          }}
          onClick={() => toggleParticipantAttendance(participant.id)}
          data-testid={`participant-attendance-${participant.id}`}
        >
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={attendance[participant.id] || false}
              data-testid={`${participant.id}-attendance-checkbox`}
            />
            <Avatar
              sx={{ marginRight: 2, width: 32, height: 32 }}
              src={participant.avatar ?? ''}
            />
            <Typography>{participant.name}</Typography>
          </Box>
          {attendance[participant.id] ? (
            <Chip
              label={t(
                'pages.course-attendance.participant-attended-chip-label'
              )}
              color="success"
              sx={{
                backgroundColor: 'success.light',
              }}
            />
          ) : (
            <Chip
              label={t(
                'pages.course-attendance.participant-not-attended-chip-label'
              )}
              color="error"
            />
          )}
        </ListItemButton>
      ))}
    </Box>
  )
}
