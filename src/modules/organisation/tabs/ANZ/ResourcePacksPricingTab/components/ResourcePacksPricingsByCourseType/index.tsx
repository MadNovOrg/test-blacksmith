import EditIcon from '@mui/icons-material/Edit'
import {
  Button,
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

type Props = {
  orgId: string
  courseType: Course_Type_Enum
  RPPricings: Resource_Packs_Pricing[]
}

const PER_PAGE = 10
const ROWS_PER_PAGE_OPTIONS = [10, 20, 30]

export const ResourcePacksPricingByCourseType: React.FC<Props> = ({
  orgId,
  courseType,
  RPPricings,
}) => {
  const { t, _t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type',
  )
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)
  const groupedPricings = useMemo(() => {
    const map = new Map<string, Resource_Packs_Pricing[]>()
    RPPricings.forEach(p => {
      const key = `${p.course_type}-${p.course_level}-${p.reaccred}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)?.push(p)
    })

    return Array.from(map.entries()).map(([key, values]) => {
      const [courseType, courseLevel, reaccred] = key.split('-')
      return {
        key,
        courseType: courseType as Course_Type_Enum,
        courseLevel: courseLevel as Course_Level_Enum,
        reaccred: reaccred === 'true',
        values,
      }
    })
  }, [RPPricings])

  const rpPricingsByCourseType = groupedPricings.filter(
    p => p.courseType === courseType,
  )

  const currentPagePricings = useMemo(() => {
    const sorted = sortBy(rpPricingsByCourseType, p => p.courseLevel)
    return sorted.slice(currentPage * perPage, currentPage * perPage + perPage)
  }, [currentPage, perPage, rpPricingsByCourseType])

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    [],
  )
  useEffect(() => setCurrentPage(0), [courseType])

  const cols = [
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

  const handleEdit = (rowId: string) => {
    console.log(`Attempting to edit row ${rowId} for org ${orgId}`)
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
                <TableCell sx={{ textAlign: 'center' }}>
                  <Button
                    onClick={() => handleEdit(pricing.key)}
                    color="primary"
                    startIcon={<EditIcon />}
                    data-testid={`edit-button-${pricing.key}`}
                  >
                    <Typography>{t('table.edit')}</Typography>
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
    </>
  )
}
