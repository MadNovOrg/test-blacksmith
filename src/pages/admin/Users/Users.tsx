import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'

import { BackButton } from '@app/components/BackButton'
import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { FilterCertificateValidity } from '@app/components/FilterCertificateValidity'
import { FilterCourseLevel } from '@app/components/FilterCourseLevel'
import { FilterSearch } from '@app/components/FilterSearch'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { Col, TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import { Course_Level_Enum } from '@app/generated/graphql'
import useProfiles from '@app/hooks/useProfiles'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { CertificateStatus, RoleName, TrainerRoleTypeName } from '@app/types'

import { FullHeightPage } from '../../../components/FullHeightPage'
import theme from '../../../theme'

import { MergeUsersDialog } from './components/MergeUsersDialog'

export const Users = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const { acl } = useAuth()

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

  const [selected, setSelected] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const [keywordDebounced] = useDebounce(keyword, 300)
  const [roleFilter, setRoleFilter] = useState<FilterOption[]>(roleOptions)
  const [filterByModerator, setFilterByModerator] = useState(false)
  const [filterByArchived, setFilterByArchived] = useState(false)
  const [trainerTypeFilter, setTrainerTypeFilter] =
    useState<FilterOption[]>(trainerTypeOptions)
  const [filterByCertificateLevel, setFilteredByCertificateLEvel] = useState<
    Course_Level_Enum[]
  >([])
  const [certificateStatus, setCertificateStatus] = useState<
    CertificateStatus[]
  >([])

  const merging = location.pathname.includes('/merge')

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

    if (filterByCertificateLevel.length || certificateStatus.length) {
      const courseLevel =
        filterByCertificateLevel.length > 0
          ? { _in: filterByCertificateLevel }
          : undefined

      const status =
        certificateStatus.length > 0
          ? {
              _in: certificateStatus,
            }
          : undefined

      obj.certificates = {
        _and: [
          { courseLevel },
          {
            status,
          },
        ],
      }
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

    if (filterByArchived) {
      obj.archived = {
        _eq: true,
      }
    }

    return [obj, isFiltered]
  }, [
    roleFilter,
    trainerTypeFilter,
    filterByCertificateLevel,
    keywordDebounced,
    filterByModerator,
    filterByArchived,
    certificateStatus,
  ])

  const { Pagination, perPage, currentPage } = useTablePagination()

  const {
    profiles: users,
    isLoading,
    count: usersTotalCount,
    mutate,
  } = useProfiles({
    where,
    limit: perPage,
    offset: perPage * (currentPage - 1),
  })

  const cols = useMemo(() => {
    const _t = (col: string) => t(`common.${col}`)
    return [
      {
        id: ' ',
        label: ' ',
        sorting: false,
      },
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

  const handleMergeCancel = () => {
    setShowMergeDialog(false)
    setSelected([])
    mutate()
  }

  const handleMergeSuccess = () => {
    setShowMergeDialog(false)
    setSelected([])
    mutate()
  }

  return (
    <FullHeightPage>
      <Box sx={{ bgcolor: theme.palette.grey[100] }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box justifyContent="space-between" display="flex">
            <BackButton
              label={
                merging
                  ? t('pages.admin.back-to-user-mgmt')
                  : t('pages.admin.back-to-settings')
              }
            />

            {merging ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowMergeDialog(true)}
                disabled={selected.length !== 2}
              >
                {t('pages.admin.users.merge-selected')}
              </Button>
            ) : undefined}
            {acl.canMergeProfiles() && !merging ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('./merge')}
              >
                {t('pages.admin.users.merge-users')}
              </Button>
            ) : undefined}
          </Box>
          <Box>
            <Typography variant="h1" py={2} fontWeight={600}>
              {t('pages.admin.users.title')}
            </Typography>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box display="flex" gap={4}>
          <Box width={250}>
            <Stack gap={4}>
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
              <FilterCourseLevel
                onChange={setFilteredByCertificateLEvel}
                excludedStatuses={
                  new Set([
                    Course_Level_Enum.Advanced,
                    Course_Level_Enum.BildRegular,
                    Course_Level_Enum.BildIntermediateTrainer,
                    Course_Level_Enum.BildAdvancedTrainer,
                    Course_Level_Enum.Level_1,
                    Course_Level_Enum.Level_2,
                  ])
                }
              />
              <FilterCertificateValidity onChange={setCertificateStatus} />
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
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={e => {
                      setFilterByArchived(e.target.checked)
                    }}
                    data-testid="FilterArchived"
                  />
                }
                label={t('archived')}
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
                        <TableRow key={user.id} data-testid={`row-${user.id}`}>
                          <TableCell>
                            {merging && (
                              <Checkbox
                                value={user.id}
                                onChange={e => {
                                  setSelected(s => {
                                    if (e.target.checked) {
                                      return [...s, e.target.value]
                                    } else {
                                      return s.filter(
                                        id => id !== e.target.value
                                      )
                                    }
                                  })
                                }}
                                checked={selected.includes(user.id)}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <ProfileAvatar profile={user} />
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
                {usersTotalCount ? (
                  <Pagination total={usersTotalCount} />
                ) : null}
              </TableContainer>
            )}
          </Box>
        </Box>
        {showMergeDialog && (
          <MergeUsersDialog
            onClose={handleMergeCancel}
            onSuccess={handleMergeSuccess}
            profileId1={selected[0]}
            profileId2={selected[1]}
          />
        )}
      </Container>
    </FullHeightPage>
  )
}
