import {
  Autocomplete,
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePrevious } from 'react-use'

import { ZoomUser } from '@app/generated/graphql'
import useDeleteZoomMeeting from '@app/hooks/useDeleteZoomMeeting'
import useZoomMeetingLink from '@app/hooks/useZoomMeetingLink'
import useZoomUsers from '@app/hooks/useZoomUsers'
import { LoadingStatus } from '@app/util'

export type Props = {
  value: string | null
  startDateTime: Date | null
  error?: {
    message?: string
  }
  label?: string
  onChange: (value: string | null) => void
  required?: boolean
  name?: string
}

export const ZoomMeetingSelector = ({
  value,
  onChange,
  startDateTime,
  error,
  ...props
}: Props) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<ZoomUser | null>(null)
  const previouslySelected = usePrevious(selected)
  const previousStartDate = usePrevious(startDateTime)

  const { users, current, fetching } = useZoomUsers()

  const {
    meetingUrl: zoomMeetingUrl,
    meetingId: zoomMeetingId,
    generateLink: generateZoomLink,
    status: zoomLinkStatus,
  } = useZoomMeetingLink()

  const previousMeetingId = usePrevious(zoomMeetingId)

  const { deleteMeeting } = useDeleteZoomMeeting()

  useEffect(() => {
    if (selected) return

    const user = users?.find(({ id }) => id === current)
    setSelected(user || null)
  }, [current, users, fetching, selected])

  useEffect(() => {
    if (previousMeetingId && zoomMeetingId !== previousMeetingId) {
      deleteMeeting({ meetingId: previousMeetingId })
    }
  }, [deleteMeeting, zoomMeetingId, previousMeetingId])

  useEffect(() => {
    if (
      previouslySelected?.id !== selected?.id ||
      (previousStartDate && previousStartDate !== startDateTime)
    ) {
      generateZoomLink({
        userId: selected?.id,
        meetingId:
          previouslySelected?.id !== selected?.id ? undefined : zoomMeetingId,
        startTime: startDateTime || undefined,
      })
    }
  }, [
    generateZoomLink,
    selected?.id,
    startDateTime,
    zoomMeetingId,
    previouslySelected,
    previousStartDate,
  ])

  useEffect(() => {
    onChange(zoomMeetingUrl)
  }, [onChange, zoomMeetingUrl, zoomLinkStatus])

  return (
    <>
      <Autocomplete
        value={selected}
        loading={fetching}
        renderInput={params => (
          <TextField
            {...params}
            label={t('components.course-form.zoom-user')}
            data-testid={'zoom_users'}
            fullWidth
            variant="filled"
            InputProps={{
              ...params.InputProps,
              endAdornment: fetching ? (
                <InputAdornment position="start">
                  <CircularProgress size={20} sx={{ mt: -4 }} />
                </InputAdornment>
              ) : (
                params.InputProps.endAdornment
              ),
            }}
          />
        )}
        renderOption={(props, user) => (
          <Box {...props} component="li" key={user.id}>
            {user.displayName} ({user.email})
          </Box>
        )}
        options={users || []}
        getOptionLabel={user => user.displayName}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        onChange={(_, value) => setSelected(value)}
      />

      <TextField
        required
        data-testid="onlineMeetingLink-input"
        fullWidth
        variant="filled"
        InputLabelProps={{
          shrink: Boolean(value?.length),
        }}
        helperText={!value ? error?.message : null}
        error={Boolean(!value)}
        sx={{ marginTop: 2 }}
        label={t('components.course-form.online-meeting-link-label')}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              {zoomLinkStatus === LoadingStatus.FETCHING ? (
                <CircularProgress size={20} />
              ) : null}
            </InputAdornment>
          ),
        }}
        {...props}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </>
  )
}
