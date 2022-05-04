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
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import {
  QUERY as GET_EVALUATION_QUERY,
  ResponseType as GetEvaluationResponseType,
  ParamsType as GetEvaluationParamsType,
} from '@app/queries/course-evaluation/get-evaluations'
import { SortOrder } from '@app/types'
import { noop } from '@app/util'

export const EvaluationSummaryTab: React.FC<unknown> = () => {
  const navigate = useNavigate()
  const params = useParams()
  const { profile } = useAuth()
  const { t } = useTranslation()
  const courseId = params.id as string
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

  const [order] = useState<SortOrder>('asc')
  const [orderBy] = useState(cols[0].id)

  const { data, error } = useSWR<
    GetEvaluationResponseType,
    Error,
    [string, GetEvaluationParamsType]
  >([GET_EVALUATION_QUERY, { courseId }])
  const loading = !data && !error

  const didTrainerSubmitFeedback = useMemo(() => {
    return !!data?.evaluations.find(e => e.profile.id === profileId)
  }, [data, profileId])

  const didAllParticipantsSubmittedEvaluation = useMemo(() => {
    if (data?.evaluations) {
      return (
        data?.evaluations.length - (didTrainerSubmitFeedback ? 1 : 0) ===
        data.courseParticipantsAggregation.aggregate.count
      )
    }

    return false
  }, [data, didTrainerSubmitFeedback])

  return (
    <Container disableGutters>
      {!loading &&
        !didTrainerSubmitFeedback &&
        didAllParticipantsSubmittedEvaluation && (
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
            <Typography variant="subtitle1">
              {t('pages.course-details.tabs.evaluation.title')}
            </Typography>
            <Typography variant="body1" color="grey.500">
              {t('pages.course-details.tabs.evaluation.desc')}
            </Typography>
          </Box>
          <Box>
            <Button
              component={LinkBehavior}
              variant="contained"
              color="primary"
              size="small"
              href="../evaluation/summary"
              disabled={!didTrainerSubmitFeedback}
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
              sx={{
                '& .MuiTableRow-root': {
                  backgroundColor: 'grey.300',
                },
              }}
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
