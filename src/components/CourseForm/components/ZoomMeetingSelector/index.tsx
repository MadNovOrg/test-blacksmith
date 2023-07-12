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
  startingProfileId?: string | null
  error?: {
    message?: string
  }
  label?: string
  onChange: (virtualLink: string | null, virtualId: string | null) => void
  required?: boolean
  name?: string
  editMode?: boolean
}

export const ZoomMeetingSelector = ({
  value,
  onChange,
  startDateTime,
  error,
  startingProfileId,
  editMode = false,
  ...props
}: Props) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<ZoomUser | null>(null)
  const [shouldBeEmpty, setShouldBeEmpty] = useState(false)
  const previouslySelected = usePrevious(selected)
  const previousStartDate = usePrevious(startDateTime)

  const { users, current, fetching } = useZoomUsers()

  const {
    meetingUrl: zoomMeetingUrl,
    meetingId: zoomMeetingId,
    generateLink: generateZoomLink,
    clearLink: clearZoomLink,
    status: zoomLinkStatus,
  } = useZoomMeetingLink()

  const previousMeetingId = usePrevious(zoomMeetingId)

  const { deleteMeeting } = useDeleteZoomMeeting()

  useEffect(() => {
    if (shouldBeEmpty) return
    if (selected) return

    const user =
      users?.find(
        ({ id }) => id === (editMode ? startingProfileId : current)
      ) ?? null

    setSelected(user)
  }, [current, editMode, selected, shouldBeEmpty, startingProfileId, users])

  useEffect(() => {
    if (previousMeetingId && zoomMeetingId !== previousMeetingId) {
      deleteMeeting({ meetingId: previousMeetingId.toString() })
    }
  }, [deleteMeeting, zoomMeetingId, previousMeetingId])

  useEffect(() => {
    /*This is to avoid the hook invoking generateZoomLink on mount while waiting for selected to be automatically
    filled. 
    Also I need to check shouldBeEmpty otherwise on the clear of Autocomplete previouslySelected is null and selecting 
    a value will not generate a link when it should
    */
    if (editMode && previouslySelected === null && !shouldBeEmpty) return
    if (
      (previouslySelected?.id !== selected?.id ||
        (previousStartDate && previousStartDate !== startDateTime)) &&
      selected
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
    startDateTime,
    zoomMeetingId,
    previouslySelected,
    previousStartDate,
    editMode,
    selected,
    shouldBeEmpty,
  ])

  useEffect(() => {
    if (zoomMeetingUrl || shouldBeEmpty) {
      onChange(zoomMeetingUrl, selected?.id ?? '')
    }
  }, [onChange, zoomMeetingUrl, zoomLinkStatus, selected?.id, shouldBeEmpty])

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
        onChange={(_, current) => {
          if (!current) {
            clearZoomLink()
            setShouldBeEmpty(true)
          }
          setSelected(current)
        }}
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
        onChange={e => onChange(e.target.value, selected?.id ?? '')}
      />
    </>
  )
}
