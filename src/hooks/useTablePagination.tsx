import { Box, TablePagination } from '@mui/material'
import React, { useState, useCallback, useEffect } from 'react'

const PER_PAGE = 12
const ROWS_PER_PAGE_OPTIONS = [12, 24, 50, 100]

const PaginationComponent = ({
  total,
  rowsPerPage = ROWS_PER_PAGE_OPTIONS,
  testId,
  currentPage,
  perPage,
  handlePerPageChange,
  setCurrentPage,
}: {
  total: number
  rowsPerPage?: number[]
  testId?: string
  currentPage: number
  perPage: number
  handlePerPageChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >
  setCurrentPage: (page: number) => void
}) => {
  // Reset the current page if it is out of bounds
  useEffect(() => {
    if (total / perPage < currentPage) {
      setCurrentPage(0)
    }
  }, [currentPage, perPage, setCurrentPage, total])

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
}

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
        <PaginationComponent
          total={total}
          rowsPerPage={rowsPerPage}
          testId={testId}
          currentPage={currentPage}
          perPage={perPage}
          handlePerPageChange={handlePerPageChange}
          setCurrentPage={setCurrentPage}
        />
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
