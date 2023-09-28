import {
  Box,
  CircularProgress,
  Container,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
} from '@mui/material'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { useDebounce } from 'use-debounce'

import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { StyledSubNavLink } from '@app/components/StyledSubNavLink'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import {
  ParamsType as GetContactsParamsType,
  QUERY as GetContacts,
  ResponseType as GetContactsResponseType,
} from '@app/queries/admin/get-contacts'
import { RoleName, SortOrder } from '@app/types'
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
} from '@app/util'

type ContactsProps = unknown

const sorts: Record<string, object> = {
  'givenName-asc': { givenName: 'asc' },
  'givenName-desc': { givenName: 'desc' },
  'familyName-asc': { familyName: 'asc' },
  'familyName-desc': { familyName: 'desc' },
}

export const Contacts: React.FC<
  React.PropsWithChildren<ContactsProps>
> = () => {
  const { t } = useTranslation()
  const { acl } = useAuth()
  const tabs = [
    {
      id: '/admin/contacts',
      title: 'Contacts',
    },
    ...(acl.canViewXeroConnect()
      ? [{ id: '/admin/xero/connect', title: 'Xero Connect' }]
      : []),
  ]
  const cols = useMemo(
    () => [
      {
        id: 'givenName',
        label: 'Given Name',
        sorting: true,
      },
      {
        id: 'familyName',
        label: 'Family Name',
        sorting: true,
      },
      {
        id: 'email',
        label: 'Email',
      },
      {
        id: 'organization',
        label: t('common.organization'),
      },
      {
        id: 'role',
        label: 'Role',
      },
    ],
    [t]
  )
  const roleOptions = useMemo<FilterOption[]>(() => {
    return Object.values([
      RoleName.USER,
      RoleName.TRAINER,
      RoleName.TT_OPS,
      RoleName.SALES_REPRESENTATIVE,
      RoleName.SALES_ADMIN,
      RoleName.LD,
      RoleName.FINANCE,
      RoleName.TT_ADMIN,
      RoleName.BOOKING_CONTACT,
      RoleName.ORGANIZATION_KEY_CONTACT,
      RoleName.UNVERIFIED,
    ]).map<FilterOption>(role => ({
      id: role,
      title: t(`role-names.${role}`),
      selected: false,
    }))
  }, [t])

  const [keyword, setKeyword] = useState('')
  const [keywordDebounced] = useDebounce(keyword, 300)
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION_LIMIT)
  const [order, setOrder] = useState<SortOrder>('asc')
  const [orderBy, setOrderBy] = useState(cols[0].id)
  const [roleFilter, setRoleFilter] = useState<FilterOption[]>(roleOptions)

  const where = useMemo(() => {
    const obj: Record<string, object> = {}

    const selectedRoles = roleFilter.flatMap(item =>
      item.selected ? item.id : []
    )

    if (selectedRoles.length) {
      obj.roles = {
        role: {
          name: { _in: selectedRoles },
        },
      }
    }

    if (keywordDebounced.trim().length) {
      obj._or = [
        { givenName: { _ilike: `%${keywordDebounced}%` } },
        {
          familyName: { _ilike: `%${keywordDebounced}%` },
        },
      ]
    }

    return obj
  }, [roleFilter, keywordDebounced])

  const { data, error } = useSWR<
    GetContactsResponseType,
    Error,
    [string, GetContactsParamsType]
  >([
    GetContacts,
    {
      orderBy: sorts[`${orderBy}-${order}`],
      where,
      limit: perPage,
      offset: perPage * currentPage,
    },
  ])

  const loading = !data && !error
  const profilesTotalCount = data?.profilesAggregation?.aggregate?.count

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
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <Box
          flex={1}
          height={44}
          lineHeight={2}
          display="flex"
          justifyContent="left"
          px={3}
          color="secondary.dark"
        >
          {tabs.map(t => (
            <Link key={t.id} component={StyledSubNavLink} to={t.id}>
              {t.title}
            </Link>
          ))}
        </Box>
      </Toolbar>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box display="flex">
          <Box width={250} display="flex" flexDirection="column" pr={4}>
            <Typography variant="body2">{t('filter-by')}</Typography>
            <Box display="flex" flexDirection="column">
              <FilterAccordion
                options={roleFilter}
                title={t('role')}
                onChange={setRoleFilter}
                defaultExpanded={true}
              />
            </Box>
          </Box>
          <Box flex={1}>
            <Box mt={4}>
              <TextField
                hiddenLabel
                value={keyword}
                variant="filled"
                size="small"
                placeholder={t('search')}
                onChange={e => setKeyword(e.target.value)}
              />
            </Box>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead
                  cols={cols}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {data?.profiles.map(profile => (
                    <TableRow key={profile.id}>
                      <TableCell>{profile.givenName}</TableCell>
                      <TableCell>{profile.familyName}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        {profile.organizations[0]?.organization?.name}
                      </TableCell>
                      <TableCell>
                        {t(`role-names.${profile.roles[0]?.role?.name}`)}
                      </TableCell>
                    </TableRow>
                  )) ??
                    (loading && (
                      <TableRow>
                        <TableCell colSpan={cols.length} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {profilesTotalCount ? (
                <TablePagination
                  component="div"
                  count={profilesTotalCount}
                  page={currentPage}
                  onPageChange={(_, page) => setCurrentPage(page)}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPage={perPage}
                  rowsPerPageOptions={DEFAULT_PAGINATION_ROW_OPTIONS}
                />
              ) : null}
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </>
  )
}
