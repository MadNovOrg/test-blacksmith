import { Cancel, CheckCircle, Pending, Warning } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  useImportContext,
  ImportStepsEnum as ImportSteps,
} from '@app/components/ImportSteps'
import { Import_Job_Status_Enum } from '@app/generated/graphql'

import { useImportUsersJobSubscription } from '../../hooks/useImportUsersJobSubscription'

export const Importing: React.FC = () => {
  const { goToStep, completeStep, jobId } = useImportContext()
  const { t } = useTranslation('pages', { keyPrefix: 'import-users' })

  const [{ data }] = useImportUsersJobSubscription(jobId)

  useEffect(() => {
    if (!jobId) {
      goToStep(ImportSteps.CHOOSE)
    }
  }, [jobId, goToStep])

  const result = data?.import_job_by_pk?.result
  const status = data?.import_job_by_pk?.status

  useEffect(() => {
    if (status && status !== Import_Job_Status_Enum.InProgress) {
      completeStep(ImportSteps.IMPORTING)
      goToStep(ImportSteps.RESULTS)
    }
  }, [status, goToStep, completeStep])

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {t('steps.importing.title')}
      </Typography>

      {!result?.total ? (
        <Typography>Starting import job...</Typography>
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
                    {t('steps.importing.imported-users', {
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
                      count: result?.notImportedUsers?.length ?? 0,
                    })}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1}>
                    {result?.notImportedUsers?.map(
                      (notImported: { email: string; reason: string }) => {
                        return (
                          <Typography key={notImported.email}>
                            {t(
                              [
                                `steps.importing.not-imported-error-${notImported.reason}`,
                                'steps.importing.not-imported-error',
                              ],
                              { email: notImported.email },
                            )}
                          </Typography>
                        )
                      },
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
              {result.notImportedCertificates?.length ? (
                <Accordion
                  disableGutters
                  TransitionProps={{
                    timeout: { appear: 1, enter: 1, exit: 4 },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                      {t('steps.importing.not-imported-certificate', {
                        count: result.notImportedCertificates?.length,
                      })}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      {result.notImportedCertificates.map(
                        (notImportedCertificate: {
                          email: string
                          number: string
                          reason: string
                        }) => (
                          <Typography key={notImportedCertificate.email}>
                            {t(
                              [
                                `steps.importing.not-imported-certificate-error-${notImportedCertificate.reason}`,
                                'steps.importing.not-imported-certificate-error',
                              ],
                              {
                                email: notImportedCertificate.email,
                                number: notImportedCertificate.number,
                              },
                            )}
                          </Typography>
                        ),
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ) : null}
            </Stack>
          </Box>
        </>
      )}
    </Box>
  )
}
