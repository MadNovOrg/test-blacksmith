/* eslint-disable react/jsx-no-undef */
import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import { useMediaQuery, useTheme } from '@mui/material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { noop } from 'ts-essentials'
import { useMutation, useQuery } from 'urql'
import isEmail from 'validator/lib/isEmail'
import { InferType } from 'yup'

import { Avatar } from '@app/components/Avatar'
import useWorldCountries, {
  UKsCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { Dialog } from '@app/components/dialogs'
import {
  UserSelector,
  Profile as UserSelectorProfile,
} from '@app/components/UserSelector'
import { useAuth } from '@app/context/auth'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  GetCourseParticipantOrderQuery,
  GetCourseParticipantOrderQueryVariables,
  ReplaceParticipantMutation,
  ReplaceParticipantMutationVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { CourseTitleAndDuration } from '@app/modules/course_details/components/CourseTitleAndDuration'
import {
  ParticipantPostalAddressForm,
  schema as participantPostalAddressSchema,
} from '@app/modules/course_details/course_attendees_tab/components/ParticipantPostalAddressForm'
import { schemas, yup } from '@app/schemas'
import { Course } from '@app/types'
import { requiredMsg } from '@app/util'

import { GET_PARTICIPANT_ORDER } from '../../queries/get-course-participant-order'
import { REPLACE_PARTICIPANT } from '../../queries/replace_participant'

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
    healtAndSafetyConsent?: boolean
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
  const { profile, acl } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { isUKCountry } = useWorldCountries()
  const [newAttendeeProfile, setNewAttendeeProfile] = useState<
    Partial<UserSelectorProfile>
  >({})

  const isAddressRequired = useMemo(
    () =>
      isUKCountry(course?.residingCountry ?? UKsCodes.GB_ENG) &&
      course?.type === Course_Type_Enum.Open &&
      course?.level === Course_Level_Enum.Level_1 &&
      course?.deliveryType === Course_Delivery_Type_Enum.Virtual,
    [
      course?.deliveryType,
      course?.level,
      course?.residingCountry,
      course?.type,
      isUKCountry,
    ],
  )

  const schema = yup.object({
    profile: yup.object({
      email: schemas
        .email(_t)
        .required(requiredMsg(_t, 'email'))
        .test('is-email', t('validation-errors.email-invalid'), email => {
          return isEmail(email)
        }),
      firstName: yup.string().required(requiredMsg(_t, 'first-name')),
      surname: yup.string().required(requiredMsg(_t, 'surname')),
    }),
    termsAccepted: yup.bool().required().isTrue(),
  })

  type CombinedSchema = InferType<typeof schema> &
    InferType<typeof participantPostalAddressSchema>

  const methods = useForm<InferType<typeof schema> | CombinedSchema>({
    resolver: yupResolver(
      isAddressRequired
        ? schema.concat(participantPostalAddressSchema)
        : schema,
    ),
    mode: 'all',
    defaultValues: {
      termsAccepted: mode !== Mode.TT_ADMIN ? undefined : true,
      profile: {
        email: '',
      },
    },
  })

  const values = methods.watch()

  const [{ data, fetching, error }, replaceParticipant] = useMutation<
    ReplaceParticipantMutation,
    ReplaceParticipantMutationVariables
  >(REPLACE_PARTICIPANT)

  const onSubmit: SubmitHandler<
    CombinedSchema | InferType<typeof schema>
  > = data => {
    replaceParticipant({
      input: {
        participantId: participant.id,
        inviteeEmail: data.profile.email,
        inviteeFirstName: data.profile.firstName,
        inviteeLastName: data.profile.surname,
        ...(isAddressRequired
          ? {
              inviteeAddressLine1: (data as CombinedSchema).inviteeAddressLine1,
              inviteeAddressLine2: (data as CombinedSchema).inviteeAddressLine2,
              inviteeCity: (data as CombinedSchema).inviteeCity,
              inviteeCountry: (data as CombinedSchema).inviteeCountry,
              inviteePostCode: (data as CombinedSchema).inviteePostCode,
            }
          : {}),
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

  const handleProfileChange = async (profile: UserSelectorProfile) => {
    setNewAttendeeProfile({})
    methods.setValue(
      'profile',
      {
        email: profile?.email ?? '',
        firstName: profile?.givenName ?? '',
        surname: profile?.familyName ?? '',
      },
      { shouldValidate: true },
    )
    setNewAttendeeProfile({
      familyName: profile?.familyName,
      givenName: profile?.givenName,
    })
  }
  return (
    <Dialog
      slots={{
        Title: () => (
          <Typography variant="h3" color="grey.800">
            {t('title')}
          </Typography>
        ),
      }}
      open
      onClose={onClose ?? noop}
      maxWidth={700}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
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
              showCourseDuration={true}
              course={{
                id: course.id,
                course_code: course.course_code,
                start: course.dates.aggregate.start.date,
                end: course.dates.aggregate.end.date,
                level: course.level,
                reaccreditation: course.reaccreditation,
                timeZone: course.schedule[0]?.timeZone,
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
              <Grid item xs={12}>
                <UserSelector
                  value={values.profile.email ?? undefined}
                  onChange={handleProfileChange}
                  onEmailChange={email => {
                    methods.setValue('profile', {
                      ...values.profile,
                      email,
                    })
                    setNewAttendeeProfile({})
                  }}
                  required
                  error={methods.formState.errors.profile?.email?.message}
                  textFieldProps={{ variant: 'filled' }}
                  organisationId={
                    profile?.organizations.map(org => org.organization.id) ?? []
                  }
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  variant="filled"
                  placeholder={t('first-name-placeholder')}
                  fullWidth
                  error={Boolean(
                    methods.formState.errors.profile?.firstName?.message,
                  )}
                  helperText={
                    methods.formState.errors.profile?.firstName?.message
                  }
                  {...methods.register('profile.firstName')}
                  disabled={Boolean(newAttendeeProfile?.givenName)}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  variant="filled"
                  placeholder={t('surname-placeholder')}
                  fullWidth
                  error={Boolean(
                    methods.formState.errors.profile?.surname?.message,
                  )}
                  helperText={
                    methods.formState.errors.profile?.surname?.message
                  }
                  {...methods.register('profile.surname')}
                  disabled={Boolean(newAttendeeProfile?.familyName)}
                />
              </Grid>
            </Grid>

            {isAddressRequired ? <ParticipantPostalAddressForm /> : null}

            <Alert severity="info" variant="outlined" sx={{ mt: 1 }}>
              {isAddressRequired ? (
                <>
                  <b>{_t('important')}:</b>{' '}
                  {`${_t('pages.book-course.notice')}`}
                </>
              ) : (
                <Trans i18nKey="components.replace-participant.alert-message" />
              )}
            </Alert>

            {isAddressRequired ? (
              <Alert variant="outlined" severity="info" sx={{ mt: 2 }}>
                <b>{_t('important')}:</b>{' '}
                {`${_t('pages.book-course.notice-participants')}`}
              </Alert>
            ) : null}

            {mode === Mode.ORG_ADMIN ? (
              <FormControlLabel
                control={
                  <Checkbox
                    {...methods.register('termsAccepted')}
                    data-testid="terms-checkbox"
                  />
                }
                label={
                  <Trans
                    i18nKey="components.replace-participant.terms-notice"
                    components={{
                      termsOfBusinessLink: (
                        <Link
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${_t('terms-of-business')} (${t(
                            'opens-new-window',
                          )})`}
                          href={`${import.meta.env.VITE_BASE_WORDPRESS_URL}${
                            acl.isUK()
                              ? '/policies-procedures/terms-of-business/'
                              : '/au/terms-conditions-au-nz/'
                          }`}
                        />
                      ),
                    }}
                  />
                }
                sx={{ mt: 2, color: 'dimGrey.main' }}
              />
            ) : null}
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Button
              onClick={onClose}
              data-testid="replace-cancel"
              fullWidth={isMobile}
            >
              {t('cancel-btn-text')}
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={!methods.formState.isValid}
              loading={fetching}
              data-testid="replace-submit"
              fullWidth={isMobile}
            >
              {t('submit-btn-text')}
            </LoadingButton>
          </Box>
        </form>
      </FormProvider>
    </Dialog>
  )
}
