import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  Checkbox,
  Grid,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  List,
  MenuItem,
  Select,
  Switch,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InferType } from 'yup'

import { yup } from '@app/schemas'
import { RoleName, TrainerRoleTypeName } from '@app/types'
import { capitalize } from '@app/util'

import {
  employeeRolesNames,
  salesRolesNames,
  userRolesNames,
  UserRoleName,
  EmployeeRoleName,
  employeeRole,
  salesRole,
  trainerRolesNames,
  BILDRolesNames,
} from '../../'

export function rolesFormSchema() {
  return yup
    .array()
    .of(
      yup.object({
        userRole: yup.string().oneOf(userRolesNames).required(),
        employeeRoles: yup
          .array()
          .of(yup.string().oneOf(employeeRolesNames))
          .when('userRole', {
            is: employeeRole.name,
            then: s => s.min(1),
          })
          .required(),
        salesRoles: yup
          .array()
          .of(yup.string().oneOf(salesRolesNames))
          .when('employeeRoles', {
            is: (val: EmployeeRoleName[]) => val.includes('sales'),
            then: s => s.min(1),
          })
          .required(),
        trainerRoles: yup
          .object()
          .shape({
            trainerRole: yup.array(),
            BILDRole: yup.string(),
            moderatorRole: yup.boolean(),
          })
          .required(),
      })
    )
    .required()
}

export type RolesFields = InferType<ReturnType<typeof rolesFormSchema>>

export const EditRoles = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const {
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext<{
    roles: RolesFields
  }>()
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'roles',
  })

  return (
    <>
      {fields.map((field, index) => {
        const showAddRoleButton =
          index < userRolesNames.length - 1 && index === fields.length - 1
        const selectedUserRole = watch(
          `roles.${index}.userRole` as 'roles.0.userRole'
        )
        const selectedEmployeeRoles = watch(
          `roles.${index}.employeeRoles` as 'roles.0.employeeRoles'
        )

        return (
          <Box
            bgcolor="common.white"
            p={3}
            pb={1}
            borderRadius={1}
            mb={2}
            key={field.id}
          >
            <Box>
              <FormControl fullWidth variant="filled">
                <Box display="flex">
                  <InputLabel>{t('pages.view-profile.user-role')}</InputLabel>
                  <Controller
                    name={`roles.${index}.userRole` as 'roles.0.userRole'}
                    control={control}
                    render={({ field }) => (
                      <Select
                        data-testid="user-role-select"
                        label={t('pages.view-profile.user-role')}
                        sx={{ flexGrow: 1, marginRight: 1 }}
                        {...field}
                        value={field.value}
                        onChange={e => {
                          const isEmployeeOption =
                            e.target.value === employeeRole.name
                          if (isEmployeeOption) {
                            field.onChange(e.target.value)
                          } else {
                            const updatedRoles = [...fields]
                            updatedRoles[index].userRole = e.target
                              .value as UserRoleName
                            updatedRoles[index].employeeRoles = []
                            updatedRoles[index].salesRoles = []
                            replace(updatedRoles)
                          }
                        }}
                      >
                        {userRolesNames.map(roleName => (
                          <MenuItem
                            value={roleName}
                            key={roleName}
                            disabled={fields.some(
                              field => field.userRole === roleName
                            )}
                          >
                            {t(`pages.view-profile.roles.${roleName}`)}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      variant="text"
                      onClick={() => {
                        remove(index)
                      }}
                    >
                      {t(`pages.view-profile.remove-role`)}
                    </Button>
                  )}
                </Box>
                {errors?.roles?.[index]?.userRole && (
                  <FormHelperText error sx={{ marginLeft: 0 }}>
                    {t(`pages.view-profile.user-role-error`)}
                  </FormHelperText>
                )}
              </FormControl>
              {selectedUserRole === RoleName.TRAINER && (
                <Grid
                  container
                  display="flex"
                  alignContent="center"
                  mt={2}
                  rowSpacing={2}
                >
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Box width="100%">
                      <FormControl
                        fullWidth
                        variant="filled"
                        sx={{ marginRight: 2 }}
                      >
                        <InputLabel>
                          {t('pages.view-profile.trainer-role')}
                        </InputLabel>
                        <Controller
                          name={`roles.${index}.trainerRoles.trainerRole`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              data-testid="trainer-role-select"
                              label={t('pages.view-profile.trainer-role')}
                              sx={{ flexGrow: 1, marginRight: 1 }}
                              {...field}
                              fullWidth={isMobile}
                              multiple
                              value={field.value}
                              renderValue={selected =>
                                selected.map(s => capitalize(s)).join(', ')
                              }
                            >
                              {trainerRolesNames.map(roleName => (
                                <MenuItem value={roleName} key={roleName}>
                                  <Checkbox
                                    checked={field.value?.includes(roleName)}
                                  />
                                  {roleName == TrainerRoleTypeName.AOL_ETA ||
                                  roleName == TrainerRoleTypeName.TRAINER_ETA
                                    ? t(`trainer-role-types.eta`)
                                    : t(`trainer-role-types.${roleName}`)}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Box>

                    <Button
                      variant="text"
                      onClick={() => {
                        setValue(`roles.${index}.trainerRoles.trainerRole`, [])
                      }}
                    >
                      {t(`pages.view-profile.remove-role`)}
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Box width="100%">
                      <FormControl
                        fullWidth
                        variant="filled"
                        sx={{ marginRight: 2 }}
                      >
                        <InputLabel>
                          {t('pages.view-profile.bild-role')}
                        </InputLabel>
                        <Controller
                          name={
                            `roles.${index}.trainerRoles.BILDRole` as 'roles.0.trainerRoles.BILDRole'
                          }
                          control={control}
                          render={({ field }) => (
                            <Select
                              data-testid="bild-role-select"
                              label={t('pages.view-profile.bild-role')}
                              sx={{ flexGrow: 1, marginRight: 1 }}
                              {...field}
                              value={field.value}
                              fullWidth={isMobile}
                            >
                              {BILDRolesNames.map(roleName => (
                                <MenuItem value={roleName} key={roleName}>
                                  {t(`trainer-role-types.${roleName}`)}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Box>
                    <Button
                      variant="text"
                      onClick={() => {
                        setValue(`roles.${index}.trainerRoles.BILDRole`, '')
                      }}
                    >
                      {t(`pages.view-profile.remove-role`)}
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box mt={2}>
                      <FormControl fullWidth variant="filled">
                        <Controller
                          name={
                            `roles.${index}.trainerRoles.moderatorRole` as 'roles.0.trainerRoles.moderatorRole'
                          }
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              key={field.name}
                              value={field.value}
                              control={
                                <Switch
                                  {...field}
                                  checked={Boolean(field.value)}
                                />
                              }
                              label={t(`common.moderator`)}
                              sx={{ alignItems: 'center' }}
                            />
                          )}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              )}
              {selectedUserRole === employeeRole.name && (
                <FormGroup>
                  <List>
                    <Controller
                      name={
                        `roles.${index}.employeeRoles` as 'roles.0.employeeRoles'
                      }
                      control={control}
                      render={({ field }) => (
                        <>
                          {employeeRolesNames.map(roleName => (
                            <FormControlLabel
                              key={roleName}
                              control={
                                <Checkbox
                                  {...field}
                                  checked={field.value.includes(roleName)}
                                  value={roleName}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      field.onChange([
                                        ...field.value,
                                        e.target.value as EmployeeRoleName,
                                      ])
                                    } else {
                                      const isSalesOption =
                                        e.target.value === salesRole.name
                                      if (isSalesOption) {
                                        const updatedRoles = [...fields]
                                        updatedRoles[index].employeeRoles = [
                                          ...field.value.filter(
                                            value =>
                                              value !==
                                              (e.target
                                                .value as EmployeeRoleName)
                                          ),
                                        ]
                                        updatedRoles[index].salesRoles = []
                                        replace(updatedRoles)
                                      } else {
                                        field.onChange(
                                          field.value.filter(
                                            value =>
                                              value !==
                                              (e.target
                                                .value as EmployeeRoleName)
                                          )
                                        )
                                      }
                                    }
                                  }}
                                />
                              }
                              label={t(`pages.view-profile.roles.${roleName}`)}
                            />
                          ))}
                        </>
                      )}
                    />
                  </List>
                  {errors?.roles?.[index]?.employeeRoles && (
                    <FormHelperText error sx={{ marginLeft: 0 }}>
                      {t(`pages.view-profile.employee-role-error`)}
                    </FormHelperText>
                  )}
                </FormGroup>
              )}
              {selectedEmployeeRoles &&
                Array.isArray(selectedEmployeeRoles) &&
                selectedEmployeeRoles.includes(salesRole.name) && (
                  <FormControl>
                    <FormLabel id="sales-permissions-label">
                      {t(`pages.view-profile.sales-permissions`)}
                    </FormLabel>
                    <List>
                      <Controller
                        name={
                          `roles.${index}.salesRoles` as 'roles.0.salesRoles'
                        }
                        control={control}
                        render={({ field }) => (
                          <>
                            {salesRolesNames.map(roleName => (
                              <FormControlLabel
                                key={roleName}
                                label={t(
                                  `pages.view-profile.roles.${roleName}`
                                )}
                                control={
                                  <Checkbox
                                    {...field}
                                    checked={field.value.includes(roleName)}
                                    value={roleName}
                                    onChange={e => {
                                      if (e.target.checked) {
                                        field.onChange([
                                          ...field.value,
                                          e.target.value as RoleName,
                                        ])
                                      } else {
                                        field.onChange(
                                          field.value.filter(
                                            value =>
                                              value !==
                                              (e.target.value as RoleName)
                                          )
                                        )
                                      }
                                    }}
                                  />
                                }
                              />
                            ))}
                          </>
                        )}
                      />
                    </List>
                    {errors?.roles?.[index]?.salesRoles && (
                      <FormHelperText error sx={{ marginLeft: 0 }}>
                        {t(`pages.view-profile.sales-role-error`)}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
            </Box>
            {showAddRoleButton && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ marginTop: 2 }}
                onClick={() => {
                  append({
                    userRole: RoleName.USER,
                    employeeRoles: [] as RoleName[],
                    salesRoles: [] as RoleName[],
                    trainerRoles: {
                      trainerRole: [],
                      BILDRole: '',
                      moderatorRole: false,
                    },
                  })
                }}
              >
                {t('pages.view-profile.add-role')}
              </Button>
            )}
          </Box>
        )
      })}
    </>
  )
}
