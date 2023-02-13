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
  Chip,
  styled,
  Checkbox,
  FormControlLabel,
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
import { RoleName, TrainerRoleTypeName } from '@app/types'

const StyledLink = styled('a')(() => ({
  '&:hover, &:active': {
    textDecoration: 'none',
  },
  '&:hover p, &:active p': {
    textDecoration: 'underline',
  },
}))

export const Users = () => {
  const { t } = useTranslation()

  const roleOptions = useMemo<FilterOption[]>(() => {
    return Object.values(RoleName).map<FilterOption>(role => ({
      id: role,
      title: t(`role-names.${role}`),
      selected: false,
    }))
  }, [t])

  const trainerTypeOptions = useMemo<FilterOption[]>(() => {
    return Object.values(TrainerRoleTypeName).map<FilterOption>(type => ({
      id: type,
      title: t(`trainer-role-types.${type}`),
      selected: false,
    }))
  }, [t])

  const [keyword, setKeyword] = useState('')
  const [keywordDebounced] = useDebounce(keyword, 300)
  const [roleFilter, setRoleFilter] = useState<FilterOption[]>(roleOptions)
  const [filterByModerator, setFilterByModerator] = useState(false)
  const [trainerTypeFilter, setTrainerTypeFilter] =
    useState<FilterOption[]>(trainerTypeOptions)

  const [where, filtered] = useMemo(() => {
    let isFiltered = false
    const obj: Record<string, object> = {}

    const selectedRoles = roleFilter.flatMap(item =>
      item.selected ? item.id : []
    )

    const selectedTrainerTypes = trainerTypeFilter.flatMap(item =>
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

    if (selectedTrainerTypes.length) {
      obj.trainer_role_types = {
        trainer_role_type: {
          name: { _in: selectedTrainerTypes },
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
        {
          fullName: { _ilike: `%${keywordDebounced}%` },
        },
        {
          email: { _ilike: `%${keywordDebounced}%` },
        },
      ]
      isFiltered = true
    }

    if (filterByModerator) {
      obj.trainer_role_types = {
        trainer_role_type: {
          name: { _eq: TrainerRoleTypeName.MODERATOR },
        },
      }
      isFiltered = true
    }

    return [obj, isFiltered]
  }, [roleFilter, trainerTypeFilter, keywordDebounced, filterByModerator])

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

  const isExternalRole = (role: string) =>
    [RoleName.TRAINER, RoleName.USER].some(r => r === role)

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
              placeholder={t('common.search')}
            />
            <FilterAccordion
              options={roleFilter}
              title={t('role')}
              onChange={setRoleFilter}
              defaultExpanded={false}
              data-testid="FilterUserRole"
            />
            <FilterAccordion
              options={trainerTypeFilter}
              title={t('trainer-type')}
              onChange={setTrainerTypeFilter}
              defaultExpanded={false}
              data-testid="FilterTrainerType"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => {
                    setFilterByModerator(e.target.checked)
                  }}
                  data-testid="FilterModerator"
                />
              }
              label={t('moderator')}
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
                          <StyledLink href={`/profile/${user.id}`}>
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
                          </StyledLink>
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
                          <Box display="flex" flexWrap="wrap">
                            {user.roles.map(obj => (
                              <Chip
                                key={obj.role.id}
                                sx={{
                                  fontSize: '12px',
                                  margin: '0 4px 4px 0',
                                }}
                                size="small"
                                color={
                                  isExternalRole(obj.role.name)
                                    ? 'success'
                                    : 'info'
                                }
                                label={t(`role-names.${obj.role.name}`)}
                                data-testid="user-role-chip"
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexWrap="wrap">
                            {user.trainer_role_types.map(obj => {
                              const { trainer_role_type } = obj
                              return trainer_role_type ? (
                                <Chip
                                  key={trainer_role_type.id}
                                  sx={{
                                    fontSize: '12px',
                                    margin: '0 4px 4px 0',
                                  }}
                                  size="small"
                                  label={t(
                                    `trainer-role-types.${trainer_role_type.name}`
                                  )}
                                  data-testid="trainer-role-type-chip"
                                />
                              ) : null
                            })}
                          </Box>
                        </TableCell>
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
