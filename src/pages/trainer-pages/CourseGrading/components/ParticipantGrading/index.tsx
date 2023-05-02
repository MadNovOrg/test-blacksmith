import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { t } from 'i18next'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Grade } from '@app/components/Grade'
import {
  CourseParticipantQuery,
  CourseParticipantQueryVariables,
} from '@app/generated/graphql'
import { Accreditors_Enum } from '@app/generated/graphql'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import { QUERY as PARTICIPANT_QUERY } from '@app/queries/participants/get-course-participant-by-id'
import theme from '@app/theme'

import { BILDParticipantGrading } from './components/BILDParticipantGrading'
import { ICMParticipantGrading } from './components/ICMParticipantGrading'

export const ParticipantGrading = () => {
  const { participantId, id: courseId } = useParams()

  const [{ data, fetching, error }] = useQuery<
    CourseParticipantQuery,
    CourseParticipantQueryVariables
  >({ query: PARTICIPANT_QUERY, variables: { id: participantId } })

  const participant = data?.participant

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ padding: theme.spacing(2, 0, 4, 0) }}>
        {fetching ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="course-fetching"
          >
            <CircularProgress />
          </Stack>
        ) : null}

        {error ? (
          <Alert severity="error">
            {t('pages.course-grading-details.course-error-alert-text')}
          </Alert>
        ) : null}

        {participant ? (
          <>
            <Box mb={2}>
              <BackButton
                label={t('pages.course-grading-details.back-button-text')}
                to={`/courses/${courseId}/details?tab=${CourseDetailsTabs.GRADING}`}
              />
            </Box>
            <Box display="flex">
              <Box width={400} display="flex" flexDirection="column" pr={4}>
                <Typography variant="h2" mb={2}>
                  {t('pages.participant-grading.title')}
                </Typography>

                <Typography variant="h3" mb={5}>
                  {participant.course.name}
                </Typography>
                <Typography
                  color={theme.palette.grey[700]}
                  fontWeight={600}
                  mb={1}
                >
                  {t('pages.participant-grading.attendee-title')}
                </Typography>

                <List
                  sx={{
                    '& ul': { padding: 0 },
                    marginBottom: theme.spacing(2),
                  }}
                >
                  <ListItem disableGutters key={participant.id}>
                    <ListItemAvatar>
                      <Avatar src={participant.profile.avatar ?? ''} />
                    </ListItemAvatar>
                    <ListItemText primary={`${participant.profile.fullName}`} />
                  </ListItem>
                </List>

                <Typography
                  color={theme.palette.grey[700]}
                  fontWeight={600}
                  mb={1}
                >
                  {t('pages.course-grading.grading-menu-title')}
                </Typography>
                {participant.grade ? <Grade grade={participant.grade} /> : null}
              </Box>

              <Box flex={1}>
                <Typography variant="h6" fontWeight="500" mb={1}>
                  {t('pages.participant-grading.modules-title˜')}
                </Typography>

                {participant.course.accreditedBy === Accreditors_Enum.Icm ? (
                  <ICMParticipantGrading participant={participant} />
                ) : null}

                {participant.course.accreditedBy === Accreditors_Enum.Bild ? (
                  <BILDParticipantGrading participant={participant} />
                ) : null}
              </Box>
            </Box>
          </>
        ) : null}
      </Container>
    </FullHeightPage>
  )
}
