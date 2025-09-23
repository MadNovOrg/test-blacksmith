import { ArrowBack } from '@mui/icons-material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { read, utils } from 'xlsx'

import { ImportStepsEnum as ImportSteps } from '@app/components/ImportSteps'
import { useImportContext } from '@app/components/ImportSteps/context'
import { ImportOrganisationsConfig } from '@app/generated/graphql'
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
} from '@app/util'

import { useStartOrganisationsImportJob } from '../../hooks/useStartOrganisationsImportJob'
import { transformOrganisationsData } from '../../utils'

export const Preview: React.FC = () => {
  const { data, goToStep, completeStep, config, importStarted } =
    useImportContext()

  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION_LIMIT)

  const organisationsConfig = config as ImportOrganisationsConfig

  const { t } = useTranslation('pages', { keyPrefix: 'import-organisations' })

  const [{ data: startImportData, fetching }, startImport] =
    useStartOrganisationsImportJob()

  useEffect(() => {
    if (!data) {
      goToStep(ImportSteps.CHOOSE)
    }
  }, [data, goToStep])

  const [organisationsPreview, total]: [ImportOrganisationsConfig[], number] =
    useMemo(() => {
      if (!data || !config) {
        return [[], 0]
      }

      const workbook = read(data, { type: 'base64' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const organisationsData = utils.sheet_to_json(sheet, {
        raw: true,
      })

      const filteredData = transformOrganisationsData(
        organisationsData as Record<string, string>[],
      )
      return [
        filteredData.map((row: ImportOrganisationsConfig) => ({
          name: row.name,
          country: row.country,
          state: row.state,
          addressLine1: row.addressLine1,
          addressLine2: row.addressLine2 ?? '',
          city: row.city,
          postcode: row.postcode,
          sector: row.sector,
          type: row.type,
          phone: row.phone,
          email: row.email,
          website: row.website ?? '',
          mainOrganisation: row.mainOrganisation ?? '',
          mainContactFirstName: row.mainContactFirstName ?? '',
          mainContactSurname: row.mainContactSurname ?? '',
          mainContactEmail: row.mainContactEmail ?? '',
          mainContactSetting: row.mainContactSetting ?? '',
          organisationAdminEmail: row.organisationAdminEmail ?? '',
        })),
        filteredData.length,
      ]
    }, [config, data])

  const [currentOrganizations, setCurrentOrganizations] = useState<
    ImportOrganisationsConfig[]
  >(organisationsPreview.slice(0, perPage))

  useEffect(() => {
    if (
      startImportData?.importOrganisations?.jobId &&
      !startImportData?.importOrganisations.error
    ) {
      importStarted(startImportData.importOrganisations.jobId)
      completeStep(ImportSteps.PREVIEW)
      goToStep(ImportSteps.IMPORTING)
    }
  }, [
    completeStep,
    goToStep,
    importStarted,
    startImportData?.importOrganisations?.jobId,
    startImportData?.importOrganisations?.error,
  ])

  const handleImportClick = async () => {
    if (data && organisationsConfig) {
      startImport({
        input: { data, config: organisationsConfig },
      })
    }
  }

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
      setCurrentOrganizations(
        organisationsPreview.slice(0, parseInt(event.target.value, 10)),
      )
    },
    [organisationsPreview],
  )

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {t('steps.preview.title')}
      </Typography>
      {total ? (
        <Typography>
          {t('steps.preview.description', { count: total })}
        </Typography>
      ) : null}
      <Box mt={4} overflow="auto">
        <Table size="medium">
          <TableHead>
            <TableRow>
              {Object.keys(
                t('steps.preview.table-cells', { returnObjects: true }),
              ).map(key => (
                <TableCell key={key}>
                  {t(`steps.preview.table-cells.${key}`)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrganizations?.map(organisation => (
              <TableRow key={organisation.email}>
                <TableCell>{organisation.name}</TableCell>
                <TableCell>{organisation.country}</TableCell>
                <TableCell>{organisation.state}</TableCell>
                <TableCell>{organisation.addressLine1}</TableCell>
                <TableCell>{organisation.addressLine2}</TableCell>
                <TableCell>{organisation.city}</TableCell>
                <TableCell>{organisation.postcode}</TableCell>
                <TableCell>{organisation.sector}</TableCell>
                <TableCell>{organisation.type}</TableCell>
                <TableCell>{organisation.phone}</TableCell>
                <TableCell>{organisation.email}</TableCell>
                <TableCell>{organisation.website}</TableCell>
                <TableCell>{organisation.mainOrganisation}</TableCell>
                <TableCell>{organisation.mainContactFirstName}</TableCell>
                <TableCell>{organisation.mainContactSurname}</TableCell>
                <TableCell>{organisation.mainContactEmail}</TableCell>
                <TableCell>{organisation.mainContactSetting}</TableCell>
                <TableCell>{organisation.organisationAdminEmail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {total ? (
        <TablePagination
          component="div"
          count={total}
          page={currentPage}
          onPageChange={(_, page) => {
            setCurrentPage(page)
            setCurrentOrganizations(
              organisationsPreview.slice(
                page * perPage,
                page * perPage + perPage,
              ),
            )
          }}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPage={perPage}
          rowsPerPageOptions={DEFAULT_PAGINATION_ROW_OPTIONS}
        />
      ) : null}

      <Box display="flex" mt={4} justifyContent="space-between">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => goToStep(ImportSteps.CHOOSE)}
        >
          {t('steps.upload.title')}
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
