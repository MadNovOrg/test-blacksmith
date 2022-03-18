import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import {
  CircularProgress,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
} from '@mui/material'
import useSWR from 'swr'

import { TableHead } from '@app/components/Table/TableHead'

import {
  ParamsType as GetOrganizationsParamsType,
  QUERY as GetOrganizations,
  ResponseType as GetOrganizationsResponseType,
} from '@app/queries/admin/get-organizations'
import { SortOrder } from '@app/types'

type OrganizationsProps = unknown

const sorts: Record<string, object> = {
  'name-asc': { name: 'asc' },
  'name-desc': { name: 'desc' },
}
const PER_PAGE = 12
const ROWS_PER_PAGE_OPTIONS = [12, 24, 50, 100]

export const Organizations: React.FC<OrganizationsProps> = () => {
  const cols = useMemo(
    () => [
      { id: 'name', label: 'Name', sorting: true },
      { id: 'status', label: 'Status' },
      { id: 'members_count', label: 'Members Count' },
    ],
    []
  )
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)
  const [order, setOrder] = useState<SortOrder>('asc')
  const [orderBy, setOrderBy] = useState(cols[0].id)
  const { data, error } = useSWR<
    GetOrganizationsResponseType,
    Error,
    [string, GetOrganizationsParamsType]
  >([
    GetOrganizations,
    {
      orderBy: sorts[`${orderBy}-${order}`],
      limit: perPage,
      offset: perPage * currentPage,
    },
  ])

  const loading = !data && !error
  const organizationsTotalCount =
    data?.organizationsAggregation?.aggregate?.count

  const handleRequestSort = (col: string) => {
    const isAsc = orderBy === col && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(col)
  }

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    []
  )

  return (
    <>
      <Container>
        <Grid
          container
          justify-content="space-between"
          align-items="center"
          sx={{ mb: 2 }}
        >
          <Table>
            <TableHead
              cols={cols}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {data?.organizations.map(org => (
                <TableRow key={org.id}>
                  <TableCell>{org.name}</TableCell>
                  <TableCell>{org.status}</TableCell>
                  <TableCell>{org.members_aggregate.aggregate.count}</TableCell>
                </TableRow>
              )) ??
                (loading && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {organizationsTotalCount ? (
            <TablePagination
              component="div"
              count={organizationsTotalCount}
              page={currentPage}
              onPageChange={(_, page) => setCurrentPage(page)}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={perPage}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            />
          ) : null}
        </Grid>
      </Container>
    </>
  )
}

export default Organizations
