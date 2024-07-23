import {
  Box,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/dialogs'
import { GetCoursesWithPricingQuery } from '@app/generated/graphql'
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
} from '@app/util'

export type CouresWithAvailablePricingProps = {
  courses: GetCoursesWithPricingQuery
  showCTA?: boolean
  setCTAOption?: Dispatch<SetStateAction<'approve' | 'cancel' | undefined>>
}

export const CoursesWithAvailablePricing = ({
  courses,
  showCTA,
  setCTAOption,
}: CouresWithAvailablePricingProps) => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION_LIMIT)
  const [open, setOpen] = useState<boolean>(
    Boolean(courses.course_aggregate.aggregate?.count),
  )
  const offset = currentPage * perPage
  const pageCourses = courses?.courses.slice(offset, offset + perPage)

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    [],
  )
  return (
    <Dialog
      onClose={() => setOpen(false)}
      open={open}
      slots={{
        Title: () => (
          <Typography variant="h6" px={2} fontWeight={600} color="secondary">
            {t('pages.course-pricing.modal-impacted-courses-title')}
          </Typography>
        ),
      }}
      maxWidth={600}
      data-testid="courses-with-price-dialog"
    >
      <Box>
        <TableContainer>
          <Table>
            <TableBody>
              {pageCourses?.map(course => (
                <TableRow key={course?.id} sx={{ backgroundColor: 'white' }}>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Link href={`/manage-courses/all/${course?.id}/details`}>
                      {course?.course_code}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {showCTA ? (
          <Box display="flex" justifyContent="center">
            <Button
              onClick={() => {
                setCTAOption ? setCTAOption('approve') : null
                setOpen(false)
              }}
            >
              {t('approve')}
            </Button>
            <Button
              onClick={() => {
                setCTAOption ? setCTAOption('cancel') : null
                setOpen(false)
              }}
            >
              {t('cancel')}
            </Button>
          </Box>
        ) : null}
        <TablePagination
          component="div"
          count={courses?.course_aggregate.aggregate?.count as number}
          page={currentPage}
          onPageChange={(_, page) => setCurrentPage(page)}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPage={perPage}
          rowsPerPageOptions={DEFAULT_PAGINATION_ROW_OPTIONS}
        />
      </Box>
    </Dialog>
  )
}
