import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { LinkToProfile } from '@app/components/LinkToProfile'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import {
  GetEvaluationsQuery,
  GetEvaluationsQueryVariables,
  Course_Status_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { QUERY as GET_EVALUATION_QUERY } from '@app/queries/course-evaluation/get-evaluations'
import { SortOrder, Course } from '@app/types'
import { noop } from '@app/util'

import { EvaluationSummaryPDFDownloadLink } from './EvaluationSummaryPDFDownloadLink'

type Evaluation = GetEvaluationsQuery['evaluations'][number]
type EvaluationProps = {
  course: Course
}

export const EvaluationSummaryTab: React.FC<
  React.PropsWithChildren<EvaluationProps>
> = ({ course }: EvaluationProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const navigate = useNavigate()
  const params = useParams()
  const { profile } = useAuth()
  const { t } = useTranslation()
  const { acl } = useAuth()
  const courseId = Number.parseInt(params.id as string, 10)
  const profileId = profile?.id as string

  const { data, error } = useSWR<
    GetEvaluationsQuery,
    Error,
    [string, GetEvaluationsQueryVariables]
  >([
    GET_EVALUATION_QUERY,
    {
      courseId,
      profileCondition: acl.canViewArchivedProfileData()
        ? {}
        : { archived: { _eq: false } },
    },
  ])

  const isCourseTrainer = useMemo(
    () => !!data?.trainers.find(t => t.profile.id === profileId),
    [data, profileId]
  )

  //#TTHP-2016
  const isOpenCourseTrainer = useMemo(
    () => course.type === Course_Type_Enum.Open && isCourseTrainer,
    [course, isCourseTrainer]
  )

  const displayEvaluationColumn =
    acl.isInternalUser() ||
    (isCourseTrainer && !(course.type === Course_Type_Enum.Open))

  const cols = useMemo(
    () =>
      [
        { id: 'name', label: t('name') },
        { id: 'contact', label: t('email') },
        { id: 'org', label: t('organization') },
        displayEvaluationColumn
          ? { id: 'evaluation', label: t('evaluation') }
          : null,
      ].filter(Boolean),
    [displayEvaluationColumn, t]
  )

  const [isPDFExporting, setIsPDFExporting] = useState<boolean>(false)
  const PDFExportButtonContent = useMemo(
    () =>
      isPDFExporting ? (
        <EvaluationSummaryPDFDownloadLink
          courseId={courseId}
          profileId={profileId}
        />
      ) : (
        t('pages.course-details.tabs.evaluation.export-idle')
      ),
    [isPDFExporting, courseId, profileId, t]
  )

  const [order] = useState<SortOrder>('asc')
  const [orderBy] = useState(cols[0].id)

  const loading = !data && !error

  const findEvaluationForProfileId = useCallback(
    (id: string) =>
      data?.evaluations.find((e: Evaluation) => e.profile.id === id),
    [data]
  )

  const didTrainerSubmitEvaluation = useMemo(
    () => !!findEvaluationForProfileId(profileId),
    [findEvaluationForProfileId, profileId]
  )

  const leadTrainer = useMemo(
    () => data?.trainers.find(t => t.type === 'LEADER'),
    [data]
  )

  const isCourseCanBeEvaluated = [
    Course_Status_Enum.GradeMissing,
    Course_Status_Enum.EvaluationMissing,
  ].includes(course?.status)

  const canTrainerSubmitEvaluation =
    isCourseCanBeEvaluated &&
    !didTrainerSubmitEvaluation &&
    (isCourseTrainer || leadTrainer?.profile.id === profileId)

  return (
    <Container disableGutters>
      {!loading && canTrainerSubmitEvaluation && (
        <Alert
          variant="outlined"
          color="warning"
          severity="warning"
          action={
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => navigate('../evaluation/submit')}
              data-testid="trainer-evaluation-button"
            >
              {t('course-evaluation.complete-my-evaluation')}
            </Button>
          }
          sx={{
            py: 1,
            mb: 2,
            '.MuiAlert-action': { alignItems: 'center', p: 0 },
          }}
        >
          {t('course-evaluation.trainer-evaluate')}
        </Alert>
      )}

      <Box>
        <Grid container alignItems="center" spacing={2}>
          <Grid item md={6} sm={12}>
            <Typography
              variant="subtitle1"
              data-testid="trainer-evaluation-title"
            >
              {t('pages.course-details.tabs.evaluation.title')}
            </Typography>
            <Typography variant="body1" color="grey.600">
              {t('pages.course-details.tabs.evaluation.desc')}
            </Typography>
          </Grid>
          {!isOpenCourseTrainer ? (
            <Grid
              item
              container
              md={6}
              sm={12}
              display="flex"
              justifyContent="flex-end"
              flexDirection={isMobile ? 'column' : 'row'}
              spacing={2}
            >
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={!didTrainerSubmitEvaluation && isCourseTrainer}
                  data-testid="export-summary"
                  fullWidth={isMobile}
                  onClick={() => setIsPDFExporting(true)}
                >
                  {PDFExportButtonContent}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component={LinkBehavior}
                  variant="contained"
                  color="primary"
                  href="../evaluation/summary"
                  disabled={!didTrainerSubmitEvaluation && isCourseTrainer}
                  data-testid="view-summary-evaluation"
                  fullWidth={isMobile}
                >
                  {t('pages.course-details.tabs.evaluation.button')}
                </Button>
              </Grid>
            </Grid>
          ) : null}
        </Grid>

        <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} data-testid="courses-table">
            <TableHead
              cols={cols}
              order={order}
              orderBy={orderBy}
              onRequestSort={noop}
            />
            <TableBody>
              {data?.evaluations?.map(e =>
                e.profile.id === profileId ? null : (
                  <TableRow key={e.id}>
                    <TableCell>
                      <LinkToProfile
                        profileId={e.profile.id}
                        isProfileArchived={e.profile.archived}
                      >
                        {e.profile.archived
                          ? t('common.archived-profile')
                          : e.profile.fullName}
                      </LinkToProfile>
                    </TableCell>
                    <TableCell>
                      <LinkToProfile
                        profileId={e.profile.id}
                        isProfileArchived={e.profile.archived}
                      >
                        {e.profile.email}
                      </LinkToProfile>
                    </TableCell>
                    <TableCell>
                      {e.profile.organizations
                        ?.map(o => o.organization.name)
                        .join(', ')}
                    </TableCell>
                    {displayEvaluationColumn ? (
                      <TableCell>
                        <Link
                          href={
                            data?.trainers.find(
                              t => t.profile.id === e.profile.id
                            )
                              ? `../evaluation/submit?profile_id=${e.profile.id}`
                              : `../evaluation/view?profile_id=${e.profile.id}`
                          }
                          variant="body2"
                          fontWeight="600"
                          color="primary"
                        >
                          {t(
                            'pages.course-details.tabs.evaluation.view-evaluation'
                          )}
                        </Link>
                      </TableCell>
                    ) : null}
                  </TableRow>
                )
              ) ??
                (loading && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress data-testid="evaluations-fetching" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )
}
