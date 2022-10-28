import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  List,
  MenuItem,
  Select,
} from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Role, RoleName } from '@app/types'

type Props = {
  systemRoles: Role[]
  roles: string[][]
  setRoles: React.Dispatch<React.SetStateAction<string[][]>>
  topRolesNames: RoleName[]
  employeeRolesNames: RoleName[]
  salesRolesNames: RoleName[]
  employeeRole: Role
  salesRole: Role
}

export const EditRoles: React.FC<Props> = ({
  systemRoles,
  roles,
  setRoles,
  topRolesNames,
  employeeRolesNames,
  salesRolesNames,
  employeeRole,
  salesRole,
}) => {
  const { t } = useTranslation()

  const [topRolesOptions, employeeRolesOptions, salesRolesOptions] =
    useMemo(() => {
      const roleOptions: Role[] = []
      const allRoles: RoleName[] = [
        ...topRolesNames,
        ...employeeRolesNames,
        ...salesRolesNames,
      ]
      allRoles.forEach(role => {
        systemRoles?.find(systemRole => {
          if (systemRole.name == role) {
            roleOptions.push({
              id: systemRole.id,
              name: systemRole.name,
            })
          }
        })
      })
      roleOptions.push(employeeRole, salesRole)
      const topRolesOptions = roleOptions.filter(
        option => topRolesNames.indexOf(option.name) > -1
      )
      const employeeRolesOptions = roleOptions.filter(
        option => employeeRolesNames.indexOf(option.name) > -1
      )

      const salesRolesOptions = roleOptions.filter(
        option => salesRolesNames.indexOf(option.name) > -1
      )

      return [topRolesOptions, employeeRolesOptions, salesRolesOptions]
    }, [
      systemRoles,
      topRolesNames,
      employeeRolesNames,
      salesRolesNames,
      employeeRole,
      salesRole,
    ])

  const isEmployeeSelected = useCallback(
    (role: string[]) => {
      return (
        role.some(name => name == employeeRole.name) ||
        employeeRolesOptions.some(option =>
          role.find(name => name == option.name)
        )
      )
    },
    [roles, employeeRole.name, employeeRolesOptions]
  )

  const isSalesSelected = useCallback(
    (role: string[]) => {
      return (
        role.some(role => role == salesRole.name) ||
        salesRolesOptions.some(option => role.find(name => name == option.name))
      )
    },
    [roles, salesRole.name, salesRolesOptions]
  )

  return (
    <>
      {roles.map((role, index) => {
        const showAddRoleButton =
          index < topRolesNames.length - 1 && index === roles.length - 1
        return (
          <Box
            bgcolor="common.white"
            p={3}
            pb={1}
            borderRadius={1}
            mb={2}
            key={index}
          >
            <Box>
              <FormControl fullWidth variant="filled">
                <Box display="flex">
                  <InputLabel>{t('pages.view-profile.user-role')}</InputLabel>
                  <Select
                    data-testid="user-role-select"
                    value={
                      topRolesOptions.find(option =>
                        role.some(name => name === option.name)
                      )?.name ?? ''
                    }
                    label={t('pages.view-profile.user-role')}
                    onChange={e => {
                      const isEmployeeOption =
                        e.target.value === employeeRole.name
                      const filteredRoles = role.filter(name => {
                        if (isEmployeeOption) {
                          return !topRolesOptions.some(el => el.name == name)
                        } else {
                          return ![
                            ...topRolesOptions,
                            ...employeeRolesOptions,
                            ...salesRolesOptions,
                          ].some(el => el.name == name)
                        }
                      })
                      filteredRoles.push(e.target.value)
                      const updatedRoles = [...roles]
                      updatedRoles[index] = filteredRoles
                      setRoles(updatedRoles)
                    }}
                    sx={{ flexGrow: 1, marginRight: 1 }}
                  >
                    {topRolesOptions.map(option => (
                      <MenuItem value={option.name} key={option.id}>
                        {t(`pages.view-profile.roles.${option.name}`)}
                      </MenuItem>
                    ))}
                  </Select>
                  {roles.length > 1 && (
                    <Button
                      variant="text"
                      onClick={() => {
                        const updatedRoles = [...roles]
                        updatedRoles.splice(index, 1)
                        setRoles(updatedRoles)
                      }}
                    >
                      {t(`pages.view-profile.remove-role`)}
                    </Button>
                  )}
                </Box>

                {(isEmployeeSelected(role) || isSalesSelected(role)) && (
                  <List>
                    {employeeRolesOptions.map(option => (
                      <FormControlLabel
                        key={option.id}
                        control={
                          <Checkbox
                            checked={role.some(name => name == option.name)}
                            onChange={e => {
                              const isSalesOption =
                                option.name === salesRole.name
                              if (e.target.checked) {
                                const updatedRoles = [...roles]
                                updatedRoles[index].push(option.name)
                                setRoles(updatedRoles)
                              } else {
                                const filteredRoles = role.filter(name => {
                                  if (isSalesOption) {
                                    return (
                                      name !== option.name &&
                                      !salesRolesOptions.some(
                                        el => el.name == name
                                      )
                                    )
                                  } else {
                                    return name !== option.name
                                  }
                                })
                                const updatedRoles = [...roles]
                                updatedRoles[index] = filteredRoles
                                setRoles(updatedRoles)
                              }
                            }}
                          />
                        }
                        label={t(`pages.view-profile.roles.${option.name}`)}
                      />
                    ))}
                  </List>
                )}
                {isSalesSelected(role) && (
                  <>
                    <FormLabel id="sales-permissions-label">
                      {t(`pages.view-profile.sales-permissions`)}
                    </FormLabel>
                    <List>
                      {salesRolesOptions.map(option => (
                        <FormControlLabel
                          key={option.id}
                          value={option.name}
                          label={t(`pages.view-profile.roles.${option.name}`)}
                          control={
                            <Checkbox
                              checked={role.some(name => name == option.name)}
                              onChange={e => {
                                if (e.target.checked) {
                                  const updatedRoles = [...roles]
                                  updatedRoles[index].push(option.name)
                                  setRoles(updatedRoles)
                                } else {
                                  const filteredRoles = role.filter(
                                    name => name !== option.name
                                  )
                                  const updatedRoles = [...roles]
                                  updatedRoles[index] = filteredRoles
                                  setRoles(updatedRoles)
                                }
                              }}
                            />
                          }
                        />
                      ))}
                    </List>
                  </>
                )}
              </FormControl>
              {showAddRoleButton && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  sx={{ marginTop: 2 }}
                  onClick={() => {
                    setRoles([...roles, ['']])
                  }}
                >
                  {t('pages.view-profile.add-role')}
                </Button>
              )}
            </Box>
          </Box>
        )
      })}
    </>
  )
}
