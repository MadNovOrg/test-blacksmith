import { Box, Typography, Link, Alert } from '@mui/material'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'

import {
  JoinWaitlistMutation,
  JoinWaitlistMutationVariables,
  WaitlistCourseQuery,
  WaitlistCourseQueryVariables,
} from '@app/generated/graphql'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'

import { CourseInfo, CourseInfoSkeleton } from './components/CourseInfo'
import { Form, FormInputs } from './components/Form'
import { JoinedWaitlist } from './components/JoinedWaitlist'
import { JOIN_WAITLIST, WAITLIST_COURSE } from './queries'

export const CourseWaitlist: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('course_id')
  const emailRef = useRef('')

  const [{ data, fetching }] = useQuery<
    WaitlistCourseQuery,
    WaitlistCourseQueryVariables
  >({
    query: WAITLIST_COURSE,
    variables: { id: Number(courseId) ?? 0 },
  })

  const [
    {
      data: joinedWaitlistData,
      fetching: joiningWaitlist,
      error: errorJoinWaitlist,
    },
    joinWaitlistMutation,
  ] = useMutation<JoinWaitlistMutation, JoinWaitlistMutationVariables>(
    JOIN_WAITLIST
  )

  const course = data?.courses.length ? data.courses[0] : null

  const joinWaitlist = (data: FormInputs) => {
    emailRef.current = data.email ?? ''
    joinWaitlistMutation({
      input: {
        courseId: Number(courseId),
        givenName: data.firstName,
        familyName: data.surname,
        phone: data.phone,
        email: data.email,
        orgName: data.orgName,
        recaptchaToken: data.recaptchaToken,
      },
    })
  }

  if (joinedWaitlistData?.joinWaitlist.success && emailRef.current) {
    return <JoinedWaitlist email={emailRef.current} />
  }

  const courseFound = course && !fetching

  return (
    <AppLayoutMinimal
      width={628}
      contentBoxStyles={{ p: 3 }}
      footer={
        <Box mt={4}>
          <Link
            href={`mailto:${import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS}`}
            target="_blank"
            rel="noopener"
            fontWeight={600}
            color="primary"
          >
            {t('need-help')}? {t('contact-us')}
          </Link>
        </Box>
      }
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        data-testid="join-waiting-list-form"
      >
        <Typography
          variant="h3"
          fontWeight="600"
          color="secondary"
          gutterBottom
        >
          {t('join-waitlist-title')}
        </Typography>
        {courseFound ? (
          <Typography
            variant="body1"
            textAlign="center"
            color="grey.700"
            mb={4}
          >
            {t('join-waitlist-notice')}
          </Typography>
        ) : null}

        {fetching && !course ? <CourseInfoSkeleton /> : null}

        {course ? <CourseInfo course={course} /> : null}
      </Box>

      {!course && !fetching ? (
        <Alert variant="outlined" severity="error" sx={{ mt: 2 }}>
          {t('waitlist-not-found')}
        </Alert>
      ) : null}

      {errorJoinWaitlist ? (
        <Alert variant="outlined" severity="error" sx={{ mt: 2 }}>
          {t('waitlist.join-error')}
        </Alert>
      ) : null}

      {course && !fetching ? (
        <Form onSuccess={joinWaitlist} saving={joiningWaitlist} />
      ) : null}
    </AppLayoutMinimal>
  )
}
