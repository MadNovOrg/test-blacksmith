import { Box, TablePagination } from '@mui/material'
import React, { useState, useCallback } from 'react'

const PER_PAGE = 12
const ROWS_PER_PAGE_OPTIONS = [12, 24, 50, 100]

export const useTablePagination = (initialPerPage = PER_PAGE) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(initialPerPage)

  const handlePerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    []
  )

  const Pagination = useCallback(
    ({
      total,
      rowsPerPage = ROWS_PER_PAGE_OPTIONS,
      testId,
    }: {
      total: number
      rowsPerPage?: number[]
      testId?: string
    }) => {
      return (
        <Box data-testid={testId}>
          <TablePagination
            component="div"
            count={total}
            page={currentPage}
            onPageChange={(_, page) => setCurrentPage(page)}
            onRowsPerPageChange={handlePerPageChange}
            rowsPerPage={perPage}
            rowsPerPageOptions={rowsPerPage}
            sx={{
              '.MuiTablePagination-toolbar': { pl: 0 },
              '.MuiTablePagination-spacer': { flex: 0 },
              '.MuiTablePagination-displayedRows': {
                flex: 1,
                textAlign: 'center',
              },
            }}
          />
        </Box>
      )
    },
    [currentPage, handlePerPageChange, perPage]
  )

  return {
    Pagination,
    perPage,
    currentPage: currentPage + 1, // page 0 doesn't make sense
    limit: perPage,
    offset: perPage * currentPage,
  }
}
