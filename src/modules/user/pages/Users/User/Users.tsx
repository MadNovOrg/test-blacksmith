import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControlLabel,
  Link,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'

import { BackButton } from '@app/components/BackButton'
import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { FilterByCertificateValidity } from '@app/components/filters/FilterByCertificateValidity'
import { FilterByCourseLevel } from '@app/components/filters/FilterByCourseLevel'
import { FilterSearch } from '@app/components/FilterSearch'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { Col, TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import {
  Certificate_Status_Enum,
  Course_Level_Enum,
} from '@app/generated/graphql'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { useProfileRoles } from '@app/modules/profile/hooks/useProfileRoles'
import useProfiles from '@app/modules/profile/hooks/useProfiles'
import { useProfilesOrganisations } from '@app/modules/profile/hooks/useProfilesOrganisations'
import theme from '@app/theme'
import { TrainerRoleTypeName } from '@app/types'

import { MergeUsersDialog } from '../components/MergeUsersDialog/MergeUsersDialog'
import UserRole from '../components/UserRoleChip/UserRole'
import { getRoleOptions, getTrainerRoleTypesOptions } from '../utils'

export const Users = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const { acl } = useAuth()
  const { getLabel } = useWorldCountries()

  const [selected, setSelected] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const [keywordDebounced] = useDebounce(keyword, 300)
  const [roleFilter, setRoleFilter] = useState<FilterOption[]>(getRoleOptions())
  const [filterByModerator, setFilterByModerator] = useState(false)
  const [filterByArchived, setFilterByArchived] = useState(false)
  const [trainerTypeFilter, setTrainerTypeFilter] = useState<FilterOption[]>(
    getTrainerRoleTypesOptions({ isAustralia: acl.isAustralia() }),
  )

  const [filterByCertificateLevel, setFilteredByCertificateLEvel] = useState<
    Course_Level_Enum[]
  >([])
  const [certificateStatus, setCertificateStatus] = useState<
    Certificate_Status_Enum[]
  >([])

  const merging = location.pathname.includes('/merge')

  const { Pagination, perPage, currentPage, setCurrentPage } =
    useTablePagination({
      initialPerPage: 20,
    })

  const [where, filtered] = useMemo(() => {
    let isFiltered = false
    const filterConditions: Record<string, object> = {}

    const selectedRoles = roleFilter.flatMap(item =>
      item.selected ? item.id : [],
    )

    const selectedTrainerTypes = trainerTypeFilter.flatMap(item =>
      item.selected ? item.id : [],
    )

    if (selectedRoles.length) {
      Object.assign(filterConditions, {
        roles: {
          role: { name: { _in: selectedRoles } },
        },
      })
      isFiltered = true
    }

    if (
      selectedRoles.length === 1 &&
      selectedRoles.includes('organization-admin')
    ) {
      delete filterConditions['roles']
      Object.assign(filterConditions, {
        organizations: {
          isAdmin: { _eq: true },
        },
      })
    } else if (
      selectedRoles.length > 1 &&
      selectedRoles.includes('organization-admin')
    ) {
      let rolesList = (
        filterConditions.roles as { role?: { name?: { _in?: string[] } } }
      )?.role?.name?._in
      rolesList = rolesList?.filter(role => role !== 'organization-admin')

      Object.assign(filterConditions, {
        roles: {
          role: { name: { _in: rolesList } },
        },
        organizations: {
          isAdmin: { _eq: true },
        },
      })
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

      Object.assign(filterConditions, {
        certificates: {
          _and: [
            {
              _and: [
                { courseLevel },
                {
                  _or: [
                    { participant: { completed_evaluation: { _eq: true } } },
                    { legacyCourseCode: { _is_null: false, _neq: '' } },
                  ],
                },
              ],
            },
            { status },
          ],
        },
      })
    }

    if (selectedTrainerTypes.length) {
      Object.assign(filterConditions, {
        trainer_role_types: {
          trainer_role_type: {
            name: { _in: selectedTrainerTypes },
          },
        },
      })
      isFiltered = true
    }

    if (keywordDebounced.trim().length) {
      Object.assign(filterConditions, {
        _or: [
          {
            organizations: {
              organization: { name: { _ilike: `%${keywordDebounced}%` } },
            },
          },
          keywordDebounced.trim().split(' ').length > 1
            ? {
                _or: [
                  {
                    _and: [
                      {
                        _or: [
                          {
                            givenName: {
                              _ilike: `%${
                                keywordDebounced.trim().split(' ')[0] ?? ''
                              }%`,
                            },
                          },
                          {
                            translatedGivenName: {
                              _ilike: `%${
                                keywordDebounced.trim().split(' ')[0] ?? ''
                              }%`,
                            },
                          },
                        ],
                      },
                      {
                        _or: [
                          {
                            familyName: {
                              _ilike: `%${
                                keywordDebounced.trim().split(' ')[1] ?? ''
                              }%`,
                            },
                          },
                          {
                            translatedFamilyName: {
                              _ilike: `%${
                                keywordDebounced.trim().split(' ')[1] ?? ''
                              }%`,
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    _and: [
                      {
                        _or: [
                          {
                            givenName: {
                              _ilike: `%${
                                keywordDebounced.trim().split(' ')[1] ?? ''
                              }%`,
                            },
                          },
                          {
                            translatedGivenName: {
                              _ilike: `%${
                                keywordDebounced.trim().split(' ')[1] ?? ''
                              }%`,
                            },
                          },
                        ],
                      },
                      {
                        _or: [
                          {
                            familyName: {
                              _ilike: `%${
                                keywordDebounced.trim().split(' ')[0] ?? ''
                              }%`,
                            },
                          },
                          {
                            translatedFamilyName: {
                              _ilike: `%${
                                keywordDebounced.trim().split(' ')[0] ?? ''
                              }%`,
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              }
            : {
                _or: [
                  {
                    givenName: {
                      _ilike: `%${keywordDebounced.trim() ?? ''}%`,
                    },
                  },
                  {
                    familyName: {
                      _ilike: `%${keywordDebounced.trim() ?? ''}%`,
                    },
                  },
                  {
                    translatedGivenName: {
                      _ilike: `%${keywordDebounced.trim() ?? ''}%`,
                    },
                  },
                  {
                    translatedFamilyName: {
                      _ilike: `%${keywordDebounced.trim() ?? ''}%`,
                    },
                  },
                ],
              },
          { email: { _ilike: `%${keywordDebounced}%` } },
          { country: { _ilike: `%${keywordDebounced}%` } },
        ],
      })
      isFiltered = true
    }

    if (filterByModerator) {
      Object.assign(filterConditions, {
        trainer_role_types: {
          trainer_role_type: {
            name: { _eq: TrainerRoleTypeName.MODERATOR },
          },
        },
      })
      isFiltered = true
    }

    if (filterByArchived) {
      Object.assign(filterConditions, {
        archived: { _eq: true },
      })
    }

    // ? Strange for this to be in a useMemo
    setCurrentPage(0)

    return [filterConditions, isFiltered]
  }, [
    roleFilter,
    trainerTypeFilter,
    filterByCertificateLevel,
    certificateStatus,
    keywordDebounced,
    filterByModerator,
    filterByArchived,
    setCurrentPage,
  ])

  const {
    profiles: users,
    isLoading,
    count: usersTotalCount,
    mutate: refreshUsers,
  } = useProfiles({
    where,
    limit: perPage,
    offset: perPage * (currentPage - 1),
  })

  const currentPageUserIds = useMemo(() => {
    return users.map(user => user.id)
  }, [users])

  const { data: rolesData, fetching: loadingProfileRoles } =
    useProfileRoles(currentPageUserIds)
  const { data: organisationData, fetching: loadingOranisations } =
    useProfilesOrganisations(currentPageUserIds)

  const cols = useMemo(() => {
    const _t = (col: string) => t(`common.${col}`)
    return [
      {
        id: ' ',
        label: ' ',
      },
      {
        id: 'fullName',
        label: _t('name'),
        sorting: false,
      },
      {
        id: 'email',
        label: _t('email'),
        sorting: false,
      },
      {
        id: 'residingCountry',
        label: _t('residing-country'),
        sorting: false,
      },
      {
        id: 'organisation',
        label: _t('organization'),
        sorting: false,
      },
      {
        id: 'role',
        label: _t('role'),
        sorting: false,
      },
      {
        id: 'trainer-type',
        label: _t('trainer-type'),
        sorting: false,
      },
    ] as Col[]
  }, [t])

  const handleMergeCancel = () => {
    setShowMergeDialog(false)
    setSelected([])
    refreshUsers({
      requestPolicy: 'network-only',
    })
  }

  const handleMergeSuccess = () => {
    setShowMergeDialog(false)
    setSelected([])
    refreshUsers({
      requestPolicy: 'network-only',
    })
  }

  return (
    <FullHeightPageLayout>
      <Helmet>
        <title>{t('pages.browser-tab-titles.users.title')}</title>
      </Helmet>
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
            <Typography variant="body2" color="grey.600" mt={1}>
              {isLoading ? (
                <>&nbsp;</>
              ) : (
                t('x-items', { count: usersTotalCount })
              )}
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
              <FilterByCourseLevel
                excludedStatuses={
                  acl.isAustralia()
                    ? new Set([
                        Course_Level_Enum.BildAdvancedTrainer,
                        Course_Level_Enum.BildIntermediateTrainer,
                        Course_Level_Enum.BildRegular,
                      ])
                    : new Set([
                        Course_Level_Enum.FoundationTrainer,
                        Course_Level_Enum.Level_1Np,
                      ])
                }
                title={t('certificate-level')}
                onChange={setFilteredByCertificateLEvel}
              />
              <FilterByCertificateValidity onChange={setCertificateStatus} />
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
                                        id => id !== e.target.value,
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
                            <Typography variant="body2" color="secondary">
                              {user.countryCode
                                ? getLabel(
                                    user.countryCode as WorldCountriesCodes,
                                  )
                                : ''}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            {(() => {
                              if (loadingOranisations)
                                return (
                                  <Skeleton variant="rectangular" width={100} />
                                )
                              const userOrganisations =
                                organisationData?.profile.find(
                                  profile => profile.id === user.id,
                                )
                              return (
                                <Link>
                                  {...(userOrganisations?.organizations.length
                                    ? userOrganisations.organizations
                                    : []
                                  ).map(({ organization }) => (
                                    <Link
                                      display="block"
                                      color="secondary"
                                      key={organization.id}
                                      href={`/organisations/${organization.id}`}
                                    >
                                      {organization.name}
                                    </Link>
                                  ))}
                                </Link>
                              )
                            })()}
                          </TableCell>

                          <TableCell>
                            {(() => {
                              if (loadingProfileRoles || loadingOranisations)
                                return (
                                  <Skeleton variant="rectangular" width={100} />
                                )
                              const userWithRoles = rolesData?.profile.find(
                                profile => profile.id === user.id,
                              )?.roles
                              const isOrganisationAdmin = Boolean(
                                organisationData?.profile
                                  .find(profile => profile.id === user.id)
                                  ?.organizations.some(
                                    ({ isAdmin }) => isAdmin,
                                  ),
                              )

                              if (!userWithRoles) return null
                              return (
                                <Box display="flex" flexWrap="wrap">
                                  <UserRole
                                    user={userWithRoles}
                                    isOrganisationAdmin={isOrganisationAdmin}
                                  />
                                </Box>
                              )
                            })()}
                          </TableCell>
                          {(() => {
                            const userTrainerRoles = rolesData?.profile.find(
                              profile => profile.id === user.id,
                            )?.trainer_role_types

                            return (
                              <Box display="flex" flexWrap="wrap">
                                {(userTrainerRoles || []).map(obj => {
                                  const { trainer_role_type } = obj
                                  return trainer_role_type ? (
                                    <Chip
                                      key={trainer_role_type.name}
                                      sx={{
                                        fontSize: '12px',
                                        margin: '0 4px 4px 0',
                                      }}
                                      color={
                                        trainer_role_type.name ===
                                        TrainerRoleTypeName.INTERNAL
                                          ? 'warning'
                                          : 'default'
                                      }
                                      size="small"
                                      label={t(
                                        `trainer-role-types.${trainer_role_type.name}`,
                                      )}
                                      data-testid="trainer-role-type-chip"
                                    />
                                  ) : null
                                })}
                              </Box>
                            )
                          })()}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                {usersTotalCount ? (
                  <Pagination
                    total={usersTotalCount}
                    rowsPerPage={[20, 30, 40, 50, 100, 200]}
                  />
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
    </FullHeightPageLayout>
  )
}
