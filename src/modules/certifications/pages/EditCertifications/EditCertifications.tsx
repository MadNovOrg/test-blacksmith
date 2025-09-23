import {
  Container,
  Box,
  ListItem,
  Avatar,
  List,
  ListItemAvatar,
  ListItemText,
  useMediaQuery,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material'
import { t } from 'i18next'
import { useMemo, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation, useNavigate } from 'react-router-dom'
import { useClient } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  UpsertCertificationMutation,
  UpsertCertificationMutationVariables,
} from '@app/generated/graphql'
import { useModuleSettings } from '@app/modules/course/pages/CourseBuilder/components/ICMCourseBuilderV2/hooks/useModuleSettings'
import { ModulesSelectionListV2 } from '@app/modules/grading/components/ModulesSelectionListV2/ModulesSelectionListV2'
import { ModuleGroupNoteInput } from '@app/modules/grading/pages/CourseGrading/components/ModuleGroupNoteInput/ModuleGroupNoteInput'
import { isModule } from '@app/modules/grading/shared/utils'
import { NotFound } from '@app/modules/not_found/pages/NotFound'
import theme from '@app/theme'

import { useParticipantDetails } from '../../hooks/useParticipantDetails'
import { UPSERT_CERTIFICATION } from '../../queries'

export const EditCertifications = () => {
  const {
    state: { participants: selectedParticipants, courseId },
  } = useLocation()

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const client = useClient()
  const {
    acl: { isUK },
  } = useAuth()

  const participantIds = Array.from(selectedParticipants.values())

  const [{ data, fetching: fetchingParticipants }] = useParticipantDetails({
    participants: participantIds as Array<string>,
    courseId: courseId as number,
  })

  const { participants, course } = useMemo(
    () => ({ participants: data?.participants, course: data?.course }),
    [data],
  )

  const [{ data: modules, fetching: fetchingModules }] = useModuleSettings(
    {
      type: course?.type as Course_Type_Enum,
      level: course?.level as Course_Level_Enum,
      deliveryType: course?.deliveryType as Course_Delivery_Type_Enum,
      go1Integration: course?.go1Integration || false,
      reaccreditation: course?.reaccreditation,
    },
    isUK() ? 'UK' : 'ANZ',
  )

  const courseAvailableModulesByCourseType = useMemo(() => {
    return (
      modules?.moduleSettings.map(module => ({
        ...module.module,
        mandatory: module.mandatory,
        lessons: {
          items: module.module.lessons.items.map(
            (item: { covered: boolean }) => ({
              ...item,
              covered: (participants?.length ?? 0) > 1 ? true : item.covered,
            }),
          ),
        },
      })) ?? []
    )
  }, [modules?.moduleSettings, participants])

  const modulesSelectionRef = useRef<unknown>(null)
  const notesRef = useRef(new Map<string, string>())

  const curriculum = useMemo(() => {
    if (participants?.length === 1) {
      const courseCurriculum = new Map(
        courseAvailableModulesByCourseType.map((item: { name: string }) => [
          item['name'],
          { ...item },
        ]),
      )

      participants[0].gradedOn?.forEach((item: { name: string }) => {
        const name = item['name']
        if (courseCurriculum.has(name)) {
          courseCurriculum.set(name, {
            ...(courseCurriculum.get(name) as object),
            ...item,
          })
        } else {
          courseCurriculum.set(name, { ...item })
        }
      })

      return (
        Array.from(courseCurriculum.values()) as Array<{
          name: string
          mandatory: boolean
          covered: boolean
        }>
      )?.map(({ mandatory: _, ...rest }) => rest)
    }

    return (
      courseAvailableModulesByCourseType as Array<{ mandatory: boolean }>
    )?.map(({ mandatory: _, ...rest }) => rest)
  }, [courseAvailableModulesByCourseType, participants])

  const saveUpdatedCertification = async () => {
    const selectedCurriculum = modulesSelectionRef.current

    const curriculumWithNotes = Array.isArray(selectedCurriculum)
      ? selectedCurriculum.map(m => {
          const module = { ...m }

          if (!isModule(module)) {
            return
          }

          module.note = notesRef.current.get(module.id) ?? ''

          return module
        })
      : modulesSelectionRef.current

    await client
      .mutation<
        UpsertCertificationMutation,
        UpsertCertificationMutationVariables
      >(UPSERT_CERTIFICATION, {
        gradedOn: curriculumWithNotes,
        participantIds,
      })
      .toPromise()
      .then(() => {
        navigate(-1)
      })
  }

  if (participants?.length === 1) {
    const participantGradedOn = participants?.[0].gradedOn
    const notesMap = new Map<string, string>(
      participantGradedOn?.map((module: { id: string; note: string }) => [
        module.id,
        module.note,
      ]),
    )
    notesRef.current = notesMap
  }

  if (!participantIds) {
    return <NotFound />
  }

  if (fetchingParticipants || fetchingModules) {
    return (
      <Box
        data-testid="fetching-participants"
        p={4}
        display={'flex'}
        justifyContent={'center'}
      >
        <Helmet>
          <title>
            {t('pages.browser-tab-titles.user-profile.certifications')}
          </title>
        </Helmet>
        <CircularProgress />
      </Box>
    )
  }

  if (!courseAvailableModulesByCourseType.length) {
    return (
      <Box p={4} display={'flex'} justifyContent={'center'}>
        <title>
          {t('pages.browser-tab-titles.user-profile.certifications')}
        </title>
        {t('pages.course-grading.no-modules')}
      </Box>
    )
  }

  return (
    <Container>
      <Helmet>
        <title>
          {t('pages.browser-tab-titles.user-profile.certifications')}
        </title>
      </Helmet>
      <Box mt={4} display="flex" flexDirection={isMobile ? 'column' : 'row'}>
        <Box width={400} display="flex" flexDirection="column" pr={4}>
          <Sticky>
            <Box mb={2}>
              <BackButton label={t('back')} />
            </Box>

            <List
              sx={{
                position: 'relative',
                overflow: 'scroll',
                maxHeight: 400,
                '& ul': { padding: 0 },
                marginBottom: theme.spacing(2),
              }}
            >
              {participants?.map(participant => (
                <ListItem disableGutters key={participant.id}>
                  <ListItemAvatar>
                    <Avatar src={participant.profile.avatar ?? ''} />
                  </ListItemAvatar>
                  <ListItemText primary={`${participant.profile.fullName}`} />
                </ListItem>
              ))}
            </List>
          </Sticky>
        </Box>
        <Box flex={1} mt={'6px'}>
          <Typography variant="h5" fontWeight="500" mb={2}>
            {t('pages.edit-certifications.title')}
          </Typography>
          <Typography variant="body1" mb={4} color={theme.palette.dimGrey.main}>
            {t('pages.edit-certifications.subtitle')}
          </Typography>
          <ModulesSelectionListV2
            curriculum={curriculum}
            onChange={curr => {
              modulesSelectionRef.current = curr
            }}
            slots={{
              afterModule: moduleId => (
                <ModuleGroupNoteInput
                  groupId={moduleId}
                  defaultValue={notesRef.current.get(moduleId) ?? ''}
                  onChange={e => {
                    notesRef.current.set(moduleId, e.target.value)
                  }}
                />
              ),
            }}
          />
          <Box display="flex" justifyContent="right" mb={2} mt={2}>
            <Button variant="contained" onClick={saveUpdatedCertification}>
              {t('pages.edit-certifications.update-certifications-button')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
