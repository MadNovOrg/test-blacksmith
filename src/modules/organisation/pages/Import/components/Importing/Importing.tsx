import { Cancel, CheckCircle, Pending, Warning } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { ImportStepsEnum as ImportSteps } from '@app/components/ImportSteps'
import { useImportContext } from '@app/components/ImportSteps/context'
import { Import_Job_Status_Enum } from '@app/generated/graphql'

import { useImportOrganisationsJobSubscription } from '../../hooks/useImportOrganisationsJobSubscription'
import { CHUNK_RESULT_ERROR, necessaryColumns } from '../../utils'

export const Importing: React.FC = () => {
  const { goToStep, completeStep, jobId, setCurrentStepKey } =
    useImportContext()
  const { t } = useTranslation('pages', { keyPrefix: 'import-organisations' })
  const { pathname } = useLocation()

  const [{ data }] = useImportOrganisationsJobSubscription(jobId)

  const result = data?.import_job_by_pk?.result
  const status = data?.import_job_by_pk?.status

  useEffect(() => {
    if (status && status !== Import_Job_Status_Enum.InProgress) {
      completeStep(ImportSteps.IMPORTING)
      goToStep(ImportSteps.RESULTS)
    }
  }, [status, goToStep, completeStep])

  useEffect(() => {
    if (!jobId) {
      goToStep(ImportSteps.CHOOSE)
    }
  }, [jobId, goToStep])

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {pathname.includes('import/results')
          ? t('steps.importing.title-results')
          : t('steps.importing.title')}
      </Typography>

      {!result?.total ? (
        <Typography>{t('steps.importing.starting')}</Typography>
      ) : (
        <>
          <Typography mb={4} display="flex">
            {status === Import_Job_Status_Enum.InProgress ? (
              <>
                <Pending sx={{ mr: 1 }} color="primary" />
                {t('steps.importing.description-pending')}
              </>
            ) : null}

            {status === Import_Job_Status_Enum.Succeeded ? (
              <>
                <CheckCircle sx={{ mr: 1 }} color="success" />
                {t('steps.importing.description-success')}
              </>
            ) : null}

            {status === Import_Job_Status_Enum.Failed ? (
              <>
                <Cancel sx={{ mr: 1 }} color="error" />
                {t('steps.importing.description-failed')}
              </>
            ) : null}

            {status === Import_Job_Status_Enum.PartiallySucceeded ? (
              <>
                <Warning sx={{ mr: 1 }} color="warning" />
                {t('steps.importing.description-partially-succeeded')}
              </>
            ) : null}
          </Typography>

          <Box mb={2}>
            <LinearProgress
              variant="determinate"
              value={((result?.processed ?? 0) / result?.total) * 100}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {result?.processed ?? 0} / {result?.total ?? 0}
            </Typography>
          </Box>

          <Box mt={3}>
            <Stack spacing={0.5}>
              <Accordion disableGutters>
                <AccordionSummary>
                  <Typography variant="h6">
                    {t('steps.importing.imported-organisations', {
                      count: result?.importedCount ?? 0,
                    })}
                  </Typography>
                </AccordionSummary>
              </Accordion>

              <Accordion
                disableGutters
                TransitionProps={{ timeout: { appear: 1, enter: 1, exit: 4 } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">
                    {t('steps.importing.not-imported', {
                      count: result?.notImported?.length ?? 0,
                    })}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1}>
                    {result?.notImported?.map(
                      (notImported: {
                        name: string
                        reason: string
                        missingFields?: Array<string>
                      }) => {
                        return (
                          <Typography key={notImported.name}>
                            {t(
                              [
                                `steps.importing.not-imported-error-${notImported.reason}`,
                                'steps.importing.not-imported-error',
                              ],
                              { name: notImported.name },
                            )}
                            {notImported.reason ===
                            CHUNK_RESULT_ERROR.MissingMandatoryFields ? (
                              <>
                                <Typography variant="body2">
                                  {t(
                                    'steps.importing.missing-mandatory-fields',
                                  )}{' '}
                                  {notImported.missingFields?.map(field => (
                                    <span key={field}>{`${
                                      necessaryColumns[
                                        field as keyof typeof necessaryColumns
                                      ]
                                    }${
                                      (notImported.missingFields || []).indexOf(
                                        field,
                                      ) <
                                      (notImported.missingFields || [])
                                        ?.length -
                                        1
                                        ? ', '
                                        : ''
                                    }`}</span>
                                  ))}
                                </Typography>
                              </>
                            ) : null}
                          </Typography>
                        )
                      },
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
              {result?.notes && result?.notes.length ? (
                <Accordion
                  disableGutters
                  TransitionProps={{
                    timeout: { appear: 1, enter: 1, exit: 4 },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                      {t('steps.importing.notes', {
                        count: result?.notes?.length ?? 0,
                      })}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      {result?.notes?.map(
                        (notes: { name: string; reason: string }) => {
                          return (
                            <Typography key={notes.name}>
                              {t(
                                [
                                  `steps.importing.not-imported-error-${notes.reason}`,
                                  'steps.importing.not-imported-error',
                                ],
                                { name: notes.name },
                              )}
                            </Typography>
                          )
                        },
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ) : null}
            </Stack>
            <Box display="flex" mt={4} justifyContent="space-between">
              <Button
                variant="contained"
                onClick={() => {
                  goToStep(ImportSteps.CHOOSE)
                  setCurrentStepKey(ImportSteps.CHOOSE)
                }}
              >
                {t('steps.importing.new-import')}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
