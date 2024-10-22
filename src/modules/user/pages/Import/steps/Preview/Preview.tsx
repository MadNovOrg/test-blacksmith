import { ArrowBack } from '@mui/icons-material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { read, utils } from 'xlsx'

import { ImportStepsEnum as ImportSteps } from '@app/components/ImportSteps'
import { useImportContext } from '@app/components/ImportSteps/context'
import { ImportUsersConfig } from '@app/generated/graphql'

import { useStartImportUsersJob } from '../../hooks/useStartImportUsersJob'

export const Preview: React.FC = () => {
  const { data, goToStep, completeStep, config, importStarted } =
    useImportContext()

  const usersConfig = config as ImportUsersConfig

  const { t } = useTranslation('pages', { keyPrefix: 'import-users' })

  const [{ data: startImportData, fetching }, startImport] =
    useStartImportUsersJob()

  useEffect(() => {
    if (!data) {
      goToStep(ImportSteps.CHOOSE)
    }
  }, [data, goToStep])

  const [usersPreview, total]: [
    {
      firstName: string
      lastName: string
      email: string
      certificateNumber: string
    }[],
    number,
  ] = useMemo(() => {
    if (!data || !usersConfig) {
      return [[], 0]
    }

    const workbook = read(data, { type: 'base64' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const usersData = utils.sheet_to_json(sheet)

    if (!Array.isArray(usersData)) {
      return [[], 0]
    }
    return [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      usersData.slice(0, 5).map((row: any) => ({
        firstName: row[usersConfig.firstNameColumn],
        lastName: row[usersConfig.lastNameColumn],
        email: row[usersConfig.emailColumn],
        certificateNumber: row[usersConfig.certificateNumberColumn],
      })),
      usersData.length,
    ]
  }, [data, usersConfig])

  useEffect(() => {
    if (startImportData?.importUsers?.jobId) {
      importStarted(startImportData.importUsers.jobId)
      completeStep(ImportSteps.PREVIEW)
      goToStep(ImportSteps.IMPORTING)
    }
  }, [
    completeStep,
    goToStep,
    importStarted,
    startImportData?.importUsers?.jobId,
  ])

  const handleImportClick = async () => {
    if (data && config) {
      startImport({ input: { data, config: usersConfig } })
    }
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {t('steps.preview.title')}
      </Typography>
      <Typography>
        {!total ? (
          <Skeleton />
        ) : (
          t('steps.preview.description', { count: total })
        )}
      </Typography>

      <Box mt={4}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>First name</TableCell>
              <TableCell>Last name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Certificate number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersPreview.map(user => (
              <TableRow key={user.email}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.certificateNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box display="flex" mt={4} justifyContent="space-between">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => goToStep(ImportSteps.CONFIGURE)}
        >
          {t('steps.configure.title')}
        </Button>
        <LoadingButton
          loading={fetching}
          endIcon={<ArrowForward />}
          variant="contained"
          onClick={handleImportClick}
        >
          {t('steps.preview.button-text')}
        </LoadingButton>
      </Box>
    </Box>
  )
}
