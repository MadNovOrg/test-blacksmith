import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  Container,
  CircularProgress,
  Stack,
  Alert,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  Box,
  Tab,
  Typography,
  Chip,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'
import InfoIcon from '@mui/icons-material/Info'
import useSWR from 'swr'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { styled } from '@mui/system'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

import { CourseHeroSummary } from '@app/components/CourseHeroSummary'

import { useAuth } from '@app/context/auth'

import useCourse from '@app/hooks/useCourse'

import { LoadingStatus } from '@app/util'
import { MUTATION, ParamsType } from '@app/queries/invites/accept-invite'

const ChecklistItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
}))

export const ParticipantCourse = () => {
  const { id: courseId } = useParams()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const acceptedInvite = searchParams.get('acceptedInvite') as string

  const { profile } = useAuth()

  const participantEmailContact = profile?.contactDetails.find(
    contact => contact.type === 'email'
  )

  const { mutate: acceptInvite } = useSWR<unknown, ParamsType>([MUTATION])

  if (participantEmailContact?.value && acceptedInvite) {
    acceptInvite()
  }

  const {
    status: courseLoadingStatus,
    data: course,
    error: courseError,
  } = useCourse(courseId ?? '')

  const [activeTab, setActiveTab] = React.useState('checklist')

  const handleActiveTabChange = (_: unknown, newValue: string) => {
    setActiveTab(newValue)
  }

  if (courseLoadingStatus === LoadingStatus.FETCHING) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="course-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  const attendingLabel = t('pages.participant-course.attending-course-label')

  return (
    <>
      {courseError ? (
        <Alert severity="error">There was an error loading a course.</Alert>
      ) : null}
      {course ? (
        <>
          <CourseHeroSummary
            course={course}
            renderButton={() => (
              <FormGroup>
                <FormControlLabel
                  control={<Switch size="small" checked={true} />}
                  label={attendingLabel}
                />
              </FormGroup>
            )}
          >
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              sx={{ marginBottom: 2 }}
            >
              {t('pages.course-participants.back-button')}
            </Button>
          </CourseHeroSummary>

          <Container sx={{ marginTop: 4 }}>
            {acceptedInvite && (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Alert
                  icon={<InfoIcon />}
                  variant="outlined"
                  color="success"
                  sx={{ marginBottom: 2, display: 'inline-flex' }}
                >
                  {t('pages.participant-course.invite-accepted')}
                </Alert>
              </Box>
            )}

            <TabContext value={activeTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleActiveTabChange}
                  aria-label="Course participant tabs"
                >
                  <Tab
                    label={t('pages.participant-course.checklist-tab-title')}
                    value="checklist"
                  />
                  <Tab
                    label={t('pages.participant-course.resources-tab-title')}
                    value="resources"
                  />
                </TabList>
              </Box>
              <TabPanel
                sx={{ paddingLeft: 0, paddingRight: 0 }}
                value="checklist"
              >
                <ChecklistItem marginBottom={2} padding={2}>
                  <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
                  <Typography fontWeight={500} sx={{ flexGrow: 1 }}>
                    {t('pages.participant-course.personal-data-document-title')}
                  </Typography>
                  <Chip label="Incomplete" sx={{ marginRight: 2 }} />
                  <Button variant="contained" color="secondary">
                    {t('pages.participant-course.open-form-button')}
                  </Button>
                </ChecklistItem>
                <ChecklistItem padding={2}>
                  <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
                  <Typography fontWeight={500} sx={{ flexGrow: 1 }}>
                    {t(
                      'pages.participant-course.course-summary-evaluation-title'
                    )}
                  </Typography>
                  <Chip label="Incomplete" sx={{ marginRight: 2 }} />
                  <Button variant="contained" color="secondary" disabled>
                    {t(
                      'pages.participant-course.course-summary-button-after-completion'
                    )}
                  </Button>
                </ChecklistItem>
              </TabPanel>
              <TabPanel
                sx={{ paddingLeft: 0, paddingRight: 0 }}
                value="resources"
              >
                {t('pages.participant-course.resources-empty-message')}
              </TabPanel>
            </TabContext>
          </Container>
        </>
      ) : (
        <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Alert severity="warning">Course not found.</Alert>
        </Container>
      )}
    </>
  )
}
