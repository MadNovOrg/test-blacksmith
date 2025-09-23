import EditIcon from '@mui/icons-material/Edit'
import HistoryIcon from '@mui/icons-material/History'
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
import {
  Course_Level_Enum,
  Course_Type_Enum,
  Resource_Packs_Pricing,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { useResourcePacksPricingContext } from '../../ResourcePacksPricingProvider/useResourcePacksPricingContext'
import { EditOrgResourcePacksPricingModal } from '../EditOrgResourcePacksPricingModal'
import { ResourcePacksPricingChangelogs } from '../ResourcePacksPricingChangelogs'
import { useResourcePacksPricingAttributes } from '../ResourcePacksPricingChangelogs/hooks/use-resource-packs-pricing-attributes'

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
  const { t, _t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type',
  )

  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)
  const [
    resourcePacksPricingIdsForChangelogsOpen,
    setResourcePacksPricingIdsForChangelogsOpen,
  ] = useState<string[]>([])

  const { error, fetching, groupedData, orgId, pricing, setSelectedPricing } =
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
      {
        id: 'edit',
      },
    ]
  }, [t])

  const handleEdit = (pricing: GroupedResourcePacksPricing) => {
    setSelectedPricing(pricing)
  }

  const getResourcePacksPricingAttributes = useResourcePacksPricingAttributes()

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
                        {getResourcePacksPricingAttributes({
                          courseType: pricing.courseType,
                          reaccred: pricing.reaccred,
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Button
                        onClick={() => handleEdit(pricing)}
                        color="primary"
                        startIcon={<EditIcon />}
                        data-testid={`edit-button-${pricing.key}`}
                      >
                        <Typography>{t('table.edit')}</Typography>
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          setResourcePacksPricingIdsForChangelogsOpen(
                            pricing.values.map(p => p.id),
                          )
                        }}
                        size="small"
                        startIcon={<HistoryIcon />}
                        sx={{ whiteSpace: 'nowrap', ml: 1 }}
                        variant="text"
                      >
                        {_t('pages.course-pricing.view-history')}
                      </Button>
                    </TableCell>
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

          <ResourcePacksPricingChangelogs
            orgId={orgId}
            resourcePacksPricingIds={resourcePacksPricingIdsForChangelogsOpen}
            open={resourcePacksPricingIdsForChangelogsOpen.length > 0}
            onClose={() => {
              setResourcePacksPricingIdsForChangelogsOpen([])
            }}
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
