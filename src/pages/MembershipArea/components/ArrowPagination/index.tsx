import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box, BoxProps, IconButton, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import theme from '@app/theme'

export const PER_PAGE = 12

type Props = {
  total: number
  onPageChange?: (page: number) => void
} & BoxProps

export const ArrowPagination: React.FC<Props> = ({
  total,
  onPageChange = noop,
  ...rest
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const { t } = useTranslation()

  const hasPreviousPage = currentPage > 1

  const hasNextPage = currentPage * PER_PAGE < total

  useEffect(() => {
    onPageChange(currentPage)
  }, [currentPage, onPageChange])

  return (
    <Box display="flex" mt={5} justifyContent="space-between" {...rest}>
      <Typography variant="body2">
        {t('pages.membership.components.arrow-pagination.pagination-count', {
          start: (currentPage - 1) * PER_PAGE + 1,
          end: currentPage * PER_PAGE > 20 ? 20 : currentPage * PER_PAGE,
          total,
        })}
      </Typography>
      <Box>
        <IconButton
          onClick={() => {
            if (hasPreviousPage) {
              setCurrentPage(currentPage - 1)
            }
          }}
          data-testid="pagination-previous-page"
          sx={{
            marginRight: 1,
            cursor: hasPreviousPage ? 'pointer' : 'default',
            color: hasPreviousPage ? 'inherit' : theme.palette.text.disabled,
          }}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          onClick={() => {
            if (hasNextPage) {
              setCurrentPage(currentPage + 1)
            }
          }}
          data-testid="pagination-next-page"
          sx={{
            cursor: hasNextPage ? 'pointer' : 'default',
            color: hasNextPage ? 'inherit' : theme.palette.text.disabled,
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  )
}
