import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import {
  GetEvaluationsQuery,
  GetEvaluationsQueryVariables,
} from '@app/generated/graphql'
import { QUERY as GET_EVALUATION_QUERY } from '@app/queries/course-evaluation/get-evaluations'
import { SortOrder } from '@app/types'
import { noop } from '@app/util'

import { EvaluationSummaryPDFDownloadLink } from './EvaluationSummaryPDFDownloadLink'

type Evaluation = GetEvaluationsQuery['evaluations'][number]

export const EvaluationSummaryTab: React.FC<unknown> = () => {
  const navigate = useNavigate()
  const params = useParams()
  const { profile } = useAuth()
  const { t } = useTranslation()
  const courseId = Number.parseInt(params.id as string, 10)
  const profileId = profile?.id as string

  const cols = useMemo(
    () => [
      { id: 'name', label: t('name') },
      { id: 'contact', label: t('contact') },
      { id: 'org', label: t('organization') },
      { id: 'evaluation', label: t('evaluation') },
    ],
    [t]
  )

  const [isPDFExporting, setIsPDFExporting] = useState<boolean>(false)
  const PDFExportButtonContent = useMemo(
    () =>
      isPDFExporting ? (
        <EvaluationSummaryPDFDownloadLink
          courseId={String(courseId)}
          profileId={profileId}
        />
      ) : (
        t('pages.course-details.tabs.evaluation.export-idle')
      ),
    [isPDFExporting, courseId, profileId, t]
  )

  const [order] = useState<SortOrder>('asc')
  const [orderBy] = useState(cols[0].id)

  const { data, error } = useSWR<
    GetEvaluationsQuery,
    Error,
    [string, GetEvaluationsQueryVariables]
  >([GET_EVALUATION_QUERY, { courseId }])
  const loading = !data && !error

  const findEvaluationForProfileId = useCallback(
    (id: string) =>
      data?.evaluations.find((e: Evaluation) => e.profile.id === id),
    [data]
  )

  const didAllParticipantsSubmitEvaluation = useMemo(() => {
    if (!data?.evaluations) {
      return false
    }

    return data?.attendees.reduce(
      (res, a) => res && !!findEvaluationForProfileId(a.profile.id),
      true
    )
  }, [findEvaluationForProfileId, data])

  const didAllAssistTrainersSubmitEvaluation = useMemo(() => {
    if (!data?.evaluations) {
      return false
    }

    return data?.trainers
      .filter(t => t.type === 'ASSISTANT')
      .reduce(
        (res, t) => res && !!findEvaluationForProfileId(t.profile.id),
        true
      )
  }, [findEvaluationForProfileId, data])

  const didTrainerSubmitEvaluation = useMemo(
    () => !!findEvaluationForProfileId(profileId),
    [findEvaluationForProfileId, profileId]
  )

  const leadTrainer = useMemo(
    () => data?.trainers.find(t => t.type === 'LEADER'),
    [data]
  )

  const isCourseTrainer = useMemo(
    () => !!data?.trainers.find(t => t.profile.id === profileId),
    [data, profileId]
  )

  const canTrainerSubmitEvaluation =
    !didTrainerSubmitEvaluation &&
    isCourseTrainer &&
    (leadTrainer?.profile.id === profileId
      ? didAllParticipantsSubmitEvaluation &&
        didAllAssistTrainersSubmitEvaluation
      : didAllParticipantsSubmitEvaluation)

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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Box>
            <Typography
              variant="subtitle1"
              data-testid="trainer-evaluation-title"
            >
              {t('pages.course-details.tabs.evaluation.title')}
            </Typography>
            <Typography variant="body1" color="grey.500">
              {t('pages.course-details.tabs.evaluation.desc')}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              color="primary"
              disabled={!didTrainerSubmitEvaluation}
              data-testid="export-summary"
              onClick={() => setIsPDFExporting(true)}
            >
              {PDFExportButtonContent}
            </Button>

            <Button
              component={LinkBehavior}
              variant="contained"
              color="primary"
              href="../evaluation/summary"
              disabled={!didTrainerSubmitEvaluation}
              data-testid="view-summary-evaluation"
              sx={{ ml: 1 }}
            >
              {t('pages.course-details.tabs.evaluation.button')}
            </Button>
          </Box>
        </Box>

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
                    <TableCell>{e.profile.fullName}</TableCell>
                    <TableCell>{e.profile.email}</TableCell>
                    <TableCell>
                      {e.profile.organizations
                        ?.map(o => o.organization.name)
                        .join(', ')}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`../evaluation/view?profile_id=${e.profile.id}`}
                        variant="body2"
                        fontWeight="600"
                        color="primary"
                      >
                        {t(
                          'pages.course-details.tabs.evaluation.view-evaluation'
                        )}
                      </Link>
                    </TableCell>
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
