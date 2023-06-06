import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { noop } from 'ts-essentials'
import { useMutation, useQuery } from 'urql'
import { InferType } from 'yup'

import { CourseTitleAndDuration } from '@app/components/CourseTitleAndDuration'
import {
  GetCourseParticipantOrderQuery,
  GetCourseParticipantOrderQueryVariables,
  ReplaceParticipantMutation,
  ReplaceParticipantMutationVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { GET_PARTICIPANT_ORDER } from '@app/queries/participants/get-course-participant-order'
import { schemas, yup } from '@app/schemas'
import { Course } from '@app/types'
import { requiredMsg } from '@app/util'

import { Avatar } from '../Avatar'
import { Dialog } from '../Dialog'

import { REPLACE_PARTICIPANT } from './queries'

export enum Mode {
  TT_ADMIN,
  ORG_ADMIN,
}

const TRANSLATION_SCOPE = 'components.replace-participant'

export type Props = {
  onClose?: () => void
  onSuccess?: () => void
  mode?: Mode
  participant: {
    id: string
    fullName: string
    avatar?: string
  }
  course?: Course
}

export const ReplaceParticipantDialog: React.FC<
  React.PropsWithChildren<Props>
> = ({
  onClose = noop,
  onSuccess = noop,
  mode = Mode.TT_ADMIN,
  participant,
  course,
}) => {
  const { t, _t } = useScopedTranslation(TRANSLATION_SCOPE)

  const schema = yup.object({
    email: schemas.email(_t).required(),
    firstName: yup.string().required(requiredMsg(_t, 'first-name')),
    surname: yup.string().required(requiredMsg(_t, 'surname')),
    termsAccepted: yup.bool().required().isTrue(),
  })

  const { register, formState, handleSubmit } = useForm<
    InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      termsAccepted: mode !== Mode.TT_ADMIN ? undefined : true,
    },
  })

  const [{ data, fetching, error }, replaceParticipant] = useMutation<
    ReplaceParticipantMutation,
    ReplaceParticipantMutationVariables
  >(REPLACE_PARTICIPANT)

  const onSubmit: SubmitHandler<InferType<typeof schema>> = data => {
    replaceParticipant({
      input: {
        participantId: participant.id,
        inviteeEmail: data.email,
        inviteeFirstName: data.firstName,
        inviteeLastName: data.surname,
      },
    })
  }

  useEffect(() => {
    if (data?.replaceParticipant?.success) {
      onSuccess()
      onClose()
    }
  }, [data, onSuccess, onClose])

  const hasError = error || data?.replaceParticipant?.error

  const [
    {
      data: participantData,
      fetching: participantFetching,
      error: participantError,
    },
  ] = useQuery<
    GetCourseParticipantOrderQuery,
    GetCourseParticipantOrderQueryVariables
  >({ query: GET_PARTICIPANT_ORDER, variables: { id: participant.id } })

  const order =
    !participantFetching &&
    !participantError &&
    participantData?.participant?.order

  return (
    <Dialog
      title={
        <Typography variant="h3" color="grey.800">
          {t('title')}
        </Typography>
      }
      open
      onClose={onClose ?? noop}
      maxWidth={700}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography sx={{ mb: 2 }} color="dimGrey.main">
          {t('description')}
        </Typography>
        {hasError ? (
          <Alert
            severity="error"
            variant="outlined"
            sx={{ mb: 2 }}
            data-testid="error-alert"
          >
            {_t([
              `${TRANSLATION_SCOPE}.replacement-error-${data?.replaceParticipant?.error}`,
              `${TRANSLATION_SCOPE}.replacement-error`,
            ])}
          </Alert>
        ) : null}
        {course && (
          <CourseTitleAndDuration
            mb={2}
            course={{
              id: course.id,
              course_code: course.course_code,
              start: course.dates.aggregate.start.date,
              end: course.dates.aggregate.end.date,
              level: course.level,
            }}
          />
        )}
        {order && (
          <>
            <Typography color="grey.700" fontWeight={600} mb={1}>
              {_t('common.invoice-no')}
            </Typography>
            <Box display="flex" mb={2}>
              <ListItemText primary={order.xeroInvoiceNumber} />
            </Box>
          </>
        )}
        <Typography color="grey.700" fontWeight={600} mb={1}>
          {t('participant-title')}
        </Typography>
        <Box display="flex" mb={3}>
          <ListItemAvatar sx={{ minWidth: 0, mr: 1 }}>
            <Avatar src={participant.avatar} />
          </ListItemAvatar>
          <ListItemText primary={participant.fullName} />
        </Box>
        <Box mb={5}>
          <Typography color="grey.700" fontWeight={600} mb={1}>
            {t('invite-title')}
          </Typography>

          <Grid container spacing={2} mb={4}>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                placeholder={t('first-name-placeholder')}
                fullWidth
                error={Boolean(formState.errors.firstName?.message)}
                helperText={formState.errors.firstName?.message}
                {...register('firstName')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                placeholder={t('surname-placeholder')}
                fullWidth
                error={Boolean(formState.errors.surname?.message)}
                helperText={formState.errors.surname?.message}
                {...register('surname')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                placeholder={t('email-placeholder')}
                fullWidth
                error={Boolean(formState.errors.email?.message)}
                helperText={formState.errors.email?.message}
                {...register('email')}
              />
            </Grid>
          </Grid>

          <Alert severity="info" variant="outlined" sx={{ mt: 1 }}>
            <Trans i18nKey="components.replace-participant.alert-message" />
          </Alert>

          {mode === Mode.ORG_ADMIN ? (
            <FormControlLabel
              control={
                <Checkbox
                  {...register('termsAccepted')}
                  data-testid="terms-checkbox"
                />
              }
              label={t('terms-notice')}
              sx={{ mt: 2, color: 'dimGrey.main' }}
            />
          ) : null}
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Button onClick={onClose} data-testId="replace-cancel">
            {t('cancel-btn-text')}
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={!formState.isValid}
            loading={fetching}
            data-testId="replace-submit"
          >
            {t('submit-btn-text')}
          </LoadingButton>
        </Box>
      </form>
    </Dialog>
  )
}
