import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { groupBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Grade } from '@app/components/Grade'
import { Course_Participant_Module } from '@app/generated/graphql'
import useCourseParticipant from '@app/hooks/useCourseParticipant'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import theme from '@app/theme'
import { LoadingStatus, transformModulesToGroups } from '@app/util'

export const ParticipantGrading = () => {
  const { participantId, id: courseId } = useParams()

  const { data: participant, status } = useCourseParticipant(
    participantId ?? ''
  )

  const moduleGroups = useMemo(() => {
    if (participant?.gradingModules) {
      return transformModulesToGroups(
        participant?.gradingModules as unknown as Course_Participant_Module[]
      )
    }

    return []
  }, [participant])

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ padding: theme.spacing(2, 0, 4, 0) }}>
        {status === LoadingStatus.FETCHING ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="course-fetching"
          >
            <CircularProgress />
          </Stack>
        ) : null}

        {status === LoadingStatus.ERROR ? (
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

                {moduleGroups.map(group => {
                  const groupedModules = groupBy(
                    group.modules,
                    module => module.completed
                  )

                  return (
                    <Accordion
                      key={group.id}
                      defaultExpanded
                      disableGutters
                      sx={{ marginBottom: 0.5 }}
                      data-testid={`graded-module-group-${group.id}`}
                    >
                      <AccordionSummary>
                        <Typography fontWeight={600}>
                          {group.name}{' '}
                          <Typography variant="body2" component="span">
                            {t(
                              'pages.participant-grading.completed-modules-subtitle',
                              {
                                completedNum: groupedModules['true']?.length,
                                totalNum: group.modules.length,
                              }
                            )}
                          </Typography>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {groupedModules['true']?.map(module => (
                          <Typography key={module.id} mb={2}>
                            {module.name}
                          </Typography>
                        ))}

                        {groupedModules['false']?.length ? (
                          <Box data-testid="incomplete-modules">
                            <Typography
                              fontWeight={600}
                              color={theme.palette.grey[700]}
                              mb={2}
                              ml={-1}
                            >
                              {t(
                                'pages.participant-grading.incomplete-list-subtitle'
                              )}
                            </Typography>

                            {groupedModules['false'].map(module => (
                              <Typography
                                key={module.id}
                                mb={2}
                                color={theme.palette.grey[700]}
                              >
                                {module.name}
                              </Typography>
                            ))}
                          </Box>
                        ) : null}
                      </AccordionDetails>
                    </Accordion>
                  )
                })}
              </Box>
            </Box>
          </>
        ) : null}
      </Container>
    </FullHeightPage>
  )
}
