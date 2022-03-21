import React, { useMemo } from 'react'
import {
  Box,
  Stack,
  CircularProgress,
  Alert,
  Typography,
  Container,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputBase,
} from '@mui/material'
import { t } from 'i18next'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { LoadingButton } from '@mui/lab'

import { FullHeightPage } from '@app/components/FullHeightPage'

import useCourse from '@app/hooks/useCourse'
import useCourseModules from '@app/hooks/useCourseModules'
import useCourseParticipants from '@app/hooks/useCourseParticipants'

import { ModulesSelectionList } from '../ModulesSelectionList'
import { CourseGradingMenu } from '../CourseGradingMenu'

import { LoadingStatus } from '@app/util'
import theme from '@app/theme'

export const CourseGrading = () => {
  const { id: courseId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const participantIds = searchParams.get('participants')?.split(',')

  const { data: course, status } = useCourse(courseId ?? '')
  const { data: courseModules } = useCourseModules(courseId ?? '')
  const { data: courseParticipants } = useCourseParticipants(courseId ?? '')

  const STORAGE_KEY = `modules-selection-${courseId}`

  const filteredCourseParticipants = useMemo(() => {
    if (!participantIds || !participantIds.length) {
      return courseParticipants
    }

    return courseParticipants?.filter(participant =>
      participantIds.includes(participant.id)
    )
  }, [courseParticipants, participantIds])

  const moduleGroups = useMemo(() => {
    if (!courseModules) {
      return []
    }

    const groups: Record<
      string,
      {
        id: string
        name: string
        modules: Array<{ id: string; name: string; covered: boolean }>
      }
    > = {}

    const rawStoredSelection = localStorage.getItem(STORAGE_KEY)
    const storedSelection: Record<string, boolean> = JSON.parse(
      rawStoredSelection ?? '{}'
    )

    courseModules.forEach(courseModule => {
      if (!courseModule.covered) {
        return
      }

      const moduleGroup = groups[courseModule.module.moduleGroup.id]

      if (!moduleGroup) {
        groups[courseModule.module.moduleGroup.id] = {
          id: courseModule.module.moduleGroup.id,
          name: courseModule.module.moduleGroup.name,
          modules: [],
        }
      }

      groups[courseModule.module.moduleGroup.id].modules.push({
        id: courseModule.module.id,
        name: courseModule.module.name,
        covered: storedSelection[courseModule.module.id] ?? true,
      })
    })

    return Object.values(groups)
  }, [STORAGE_KEY, courseModules])

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
        {course ? (
          <>
            <Box mb={2}>
              <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                sx={{ marginBottom: 2 }}
                onClick={() =>
                  navigate(`/trainer-base/course/${courseId}/details`)
                }
              >
                {t('pages.course-grading-details.back-button-text')}
              </Button>
            </Box>
            <Box display="flex">
              <Box width={400} display="flex" flexDirection="column" pr={4}>
                <Typography variant="h2" mb={2}>
                  {t('pages.course-grading.title')}
                </Typography>
                <Typography variant="h3" mb={5}>
                  {course?.name}
                </Typography>
                <Typography
                  color={theme.palette.grey[700]}
                  fontWeight={600}
                  mb={1}
                >
                  {!participantIds
                    ? t('pages.course-grading.attendees-list-title-all')
                    : t('pages.course-grading.attendees-list-title', {
                        count: filteredCourseParticipants?.length,
                      })}
                </Typography>

                <List
                  sx={{
                    position: 'relative',
                    overflow: 'scroll',
                    maxHeight: 400,
                    '& ul': { padding: 0 },
                    marginBottom: theme.spacing(2),
                  }}
                >
                  {filteredCourseParticipants?.map(participant => {
                    return participant.attended ? (
                      <ListItem disableGutters key={participant.id}>
                        <ListItemAvatar>
                          <Avatar />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${participant.profile.givenName} ${participant.profile.familyName}`}
                        />
                      </ListItem>
                    ) : null
                  })}
                </List>

                <Typography
                  color={theme.palette.grey[700]}
                  fontWeight={600}
                  mb={1}
                >
                  {t('pages.course-grading.grading-menu-title')}
                </Typography>
                <Typography mb={2}>
                  {t('pages.course-grading.grading-menu-description')}
                </Typography>

                <CourseGradingMenu />
              </Box>

              {courseModules ? (
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="500" mb={1}>
                    {t('pages.course-grading.modules-selection-title')}
                  </Typography>
                  <Typography mb={2}>
                    {t('pages.course-grading.modules-selection-description')}
                  </Typography>

                  <ModulesSelectionList moduleGroups={moduleGroups} />

                  <Typography variant="h6" fontWeight="500" mb={1} mt={4}>
                    {t('pages.course-grading.feedback-field-title')}
                  </Typography>

                  <Box
                    sx={{
                      backgroundColor: theme.palette.common.white,
                      borderBottom: `2px solid ${theme.palette.grey[500]}`,
                      padding: theme.spacing(1, 2),
                      marginBottom: theme.spacing(3),
                      borderRadius: '2px',
                    }}
                  >
                    <InputBase
                      placeholder={t(
                        'pages.course-grading.feedback-field-placeholder'
                      )}
                      sx={{ display: 'block' }}
                    />
                  </Box>
                  <Box display="flex" justifyContent="right">
                    <LoadingButton variant="contained">
                      {t('pages.course-grading.submit-button-text')}
                    </LoadingButton>
                  </Box>
                </Box>
              ) : null}
            </Box>
          </>
        ) : null}
      </Container>
    </FullHeightPage>
  )
}
