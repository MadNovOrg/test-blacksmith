import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'

import { Avatar } from '@app/components/Avatar'
import { BackButton } from '@app/components/BackButton'
import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { FilterSearch } from '@app/components/FilterSearch'
import { TableHead, Col } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import useProfiles from '@app/hooks/useProfiles'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { RoleName } from '@app/types'

export const Users = () => {
  const { t } = useTranslation()

  const roleOptions = useMemo<FilterOption[]>(() => {
    return Object.values(RoleName).map<FilterOption>(role => ({
      id: role,
      title: t(`role-names.${role}`),
      selected: false,
    }))
  }, [t])

  const [keyword, setKeyword] = useState('')
  const [keywordDebounced] = useDebounce(keyword, 300)
  const [roleFilter, setRoleFilter] = useState<FilterOption[]>(roleOptions)

  const [where, filtered] = useMemo(() => {
    let isFiltered = false
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
      isFiltered = true
    }

    if (keywordDebounced.trim().length) {
      obj._or = [
        {
          organizations: {
            organization: { name: { _ilike: `%${keywordDebounced}%` } },
          },
        },
      ]
      isFiltered = true
    }

    return [obj, isFiltered]
  }, [roleFilter, keywordDebounced])

  const { Pagination, perPage, currentPage } = useTablePagination()

  const {
    profiles: users,
    isLoading,
    count: usersTotalCount,
  } = useProfiles({
    where,
    limit: perPage,
    offset: perPage * (currentPage - 1),
  })

  const cols = useMemo(() => {
    const _t = (col: string) => t(`common.${col}`)
    return [
      {
        id: 'name',
        label: _t('name'),
      },
      {
        id: 'email',
        label: _t('email'),
      },
      {
        id: 'organisation',
        label: _t('organization'),
      },
      {
        id: 'role',
        label: _t('role'),
      },
      {
        id: 'trainer-type',
        label: _t('trainer-type'),
      },
    ] as Col[]
  }, [t])

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box mb={4}>
        <BackButton label={t('pages.admin.back-to-settings')} />
      </Box>
      <Box display="flex" gap={4}>
        <Box width={250}>
          <Typography component="h1" variant="h2">
            {t('pages.admin.users.title')}
          </Typography>

          <Stack gap={4} mt={4}>
            <FilterSearch
              value={keyword}
              onChange={setKeyword}
              placeholder={`${t('common.search')} ${t(
                'common.organization'
              ).toLowerCase()}`}
            />
            <FilterAccordion
              options={roleFilter}
              title={t('role')}
              onChange={setRoleFilter}
              defaultExpanded={true}
            />
          </Stack>
        </Box>

        <Box flex={1}>
          {isLoading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              data-testid="users-fetching"
            >
              <CircularProgress />
            </Stack>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead cols={cols}></TableHead>
                <TableBody data-testid={'table-body'}>
                  <TableNoRows
                    noRecords={!users.length}
                    filtered={filtered}
                    colSpan={cols.length}
                    itemsName={t('users').toLowerCase()}
                  />

                  {users?.map(user => {
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Box
                            pt={1}
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            gap={1}
                          >
                            <Avatar
                              src={user.avatar || undefined}
                              name={user.fullName || undefined}
                            />
                            <Typography variant="body2" color="secondary">
                              {user.fullName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="secondary">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {user.organizations.map(obj => (
                            <Typography
                              variant="body2"
                              color="secondary"
                              key={obj.organization.id}
                            >
                              {obj.organization.name}
                            </Typography>
                          ))}
                        </TableCell>

                        <TableCell>
                          {user.roles.map(obj => (
                            <Typography
                              key={obj.role.id}
                              variant="caption"
                              color="secondary"
                            >
                              {t(`role-names.${obj.role.name}`)}
                            </Typography>
                          ))}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              {usersTotalCount ? <Pagination total={usersTotalCount} /> : null}
            </TableContainer>
          )}
        </Box>
      </Box>
    </Container>
  )
}
