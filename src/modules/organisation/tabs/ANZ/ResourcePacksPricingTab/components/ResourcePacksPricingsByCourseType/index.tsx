import EditIcon from '@mui/icons-material/Edit'
import {
  Button,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { sortBy } from 'lodash-es'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import {
  Course_Level_Enum,
  Course_Type_Enum,
  Resource_Packs_Pricing,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { useResourcePacksPricingContext } from '../../ResourcePacksPricingProvider/useResourcePacksPricingContext'
import { EditOrgResourcePacksPricingModal } from '../EditOrgResourcePacksPricingModal'

type Props = {
  courseType: Course_Type_Enum
}

export type GroupedResourcePacksPricing = {
  key: string
  courseType: Course_Type_Enum
  courseLevel: Course_Level_Enum
  reaccred: boolean
  values: Resource_Packs_Pricing[]
}

const PER_PAGE = 10
const ROWS_PER_PAGE_OPTIONS = [10, 20, 30]

export const ResourcePacksPricingByCourseType: React.FC<Props> = ({
  courseType,
}) => {
  const { acl } = useAuth()
  const { t, _t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type',
  )

  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)

  const { groupedData, fetching, setSelectedPricing, error, pricing } =
    useResourcePacksPricingContext()

  const rpPricingsByCourseType = groupedData.filter(
    p => p.courseType === courseType,
  )

  const currentPagePricings = useMemo(() => {
    const sorted = sortBy(rpPricingsByCourseType, p => p.courseLevel)
    return sorted.slice(currentPage * perPage, currentPage * perPage + perPage)
  }, [currentPage, perPage, rpPricingsByCourseType])

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, PER_PAGE))
      setCurrentPage(0)
    },
    [],
  )
  useEffect(() => setCurrentPage(0), [courseType])

  const cols = useMemo(() => {
    return [
      {
        id: 'course_level',
        label: t('table.columns.course-level'),
      },
      {
        id: 'course_type',
        label: t('table.columns.course-type'),
      },
      {
        id: 'attributes',
        label: t('table.columns.attributes'),
      },
      acl.canEditResourcePacksPricing()
        ? {
            id: 'edit',
          }
        : null,
    ].filter(Boolean)
  }, [acl, t])

  const handleEdit = (pricing: GroupedResourcePacksPricing) => {
    setSelectedPricing(pricing)
  }

  const attributesColumn = (
    reaccred: boolean,
    courseType: Course_Type_Enum,
  ) => {
    if (courseType === Course_Type_Enum.Indirect)
      return (
        t('table.alias.non-reaccreditation') +
        ', ' +
        t('table.alias.reaccreditation')
      )
    return t(
      `table.alias.${reaccred ? 'reaccreditation' : 'non-reaccreditation'}`,
    )
  }

  return (
    <>
      {fetching ? (
        <Stack sx={{ alignItems: 'center' }}>
          <CircularProgress data-testid="resource-packs-pricings-loading" />
        </Stack>
      ) : null}
      {!fetching && !error ? (
        <>
          <Table sx={{ mt: 1 }} data-testid="resource-packs-pricing-table">
            <TableHead
              darker
              cols={cols}
              sx={{ '.MuiTableCell-root': { textAlign: 'center' } }}
            />
            <TableBody>
              {currentPagePricings.map(pricing => {
                return (
                  <TableRow
                    key={pricing.key}
                    sx={{ backgroundColor: 'white' }}
                    data-testid={pricing.key}
                  >
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography data-testid="course-level">
                        {_t(`course-levels.${pricing.courseLevel}`)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography data-testid="course-type">
                        {_t(`course-types.${pricing.courseType}`)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography>
                        {attributesColumn(pricing.reaccred, pricing.courseType)}
                      </Typography>
                    </TableCell>
                    {acl.canEditResourcePacksPricing() ? (
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button
                          onClick={() => handleEdit(pricing)}
                          color="primary"
                          startIcon={<EditIcon />}
                          data-testid={`edit-button-${pricing.key}`}
                        >
                          <Typography>{t('table.edit')}</Typography>
                        </Button>
                      </TableCell>
                    ) : null}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={rpPricingsByCourseType.length}
            page={currentPage}
            onPageChange={(_, page) => setCurrentPage(page)}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPage={perPage}
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            data-testid="resource-packs-pricing-table-pagination"
          />
        </>
      ) : null}

      {pricing ? (
        <EditOrgResourcePacksPricingModal
          onClose={() => setSelectedPricing(null)}
        />
      ) : null}
    </>
  )
}
