import {
  Grid,
  Typography,
  Button,
  Box,
  Autocomplete,
  TextField,
  FormControlLabel,
  Switch,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { FC, useCallback, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { ConfirmDialog } from '@app/components/dialogs'
import { useJobTitles } from '@app/components/JobTitleSelector/useJobTitles'
import { OrgSelector } from '@app/components/OrgSelector/ANZ'
import { CallbackOption as AnzOrganisationSelectorOption } from '@app/components/OrgSelector/ANZ/utils'
import { CallbackOption as UkOrganisationSelectorOption } from '@app/components/OrgSelector/UK/utils'
import { useAuth } from '@app/context/auth'
import {
  GetProfileDetailsQuery,
  Org_Created_From_Enum,
} from '@app/generated/graphql'
import { Organization } from '@app/types'
import { Shards } from '@app/util'

import { useUpdateProfile } from '../../hooks/useUpdateProfile'
import { EditProfileInputs } from '../../pages/EditProfile/utils'
import { OrgMemberType } from '../../utils'

type CallbackOption =
  | AnzOrganisationSelectorOption
  | UkOrganisationSelectorOption

type Props = {
  profile: GetProfileDetailsQuery['profile']
}
export const EditProfileOrganizationsSection: FC<Props> = ({ profile }) => {
  const [displayOrgSelector, setDisplayOrgSelector] = useState(false)
  const [orgToLeave, setOrgToLeave] = useState<OrgMemberType>()
  const { id } = useParams()

  const { t } = useTranslation()
  const anzJobs = useJobTitles(Shards.ANZ)
  const ukJobs = useJobTitles(Shards.UK)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { isUKCountry } = useWorldCountries()
  const {
    acl: { isAustralia, isTTAdmin, canEditOrgUser },
  } = useAuth()

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EditProfileInputs>()

  const values = watch()

  const { removeOrgMember, updateOrgMember } = useUpdateProfile()

  const allowAddingOrganisations = useMemo(() => {
    if (isAustralia()) return false
    return Boolean(values.countryCode) && !isUKCountry(values.countryCode)
  }, [isAustralia, values.countryCode, isUKCountry])

  const orgSelectorOnChange = useCallback(
    (organization: CallbackOption) => {
      if (organization) {
        setValue('organization', organization as Organization, {
          shouldValidate: true,
        })
      }
    },
    [setValue],
  )

  const deleteOrgMember = useCallback(
    async (orgMember: OrgMemberType) => {
      await removeOrgMember({
        id: orgMember.id,
      })
      setOrgToLeave(undefined)
    },
    [removeOrgMember],
  )

  const updatePosition = useCallback(
    async (orgMember: OrgMemberType, position: string) => {
      await updateOrgMember({
        id: orgMember.id,
        member: {
          position: position,
        },
      })
    },
    [updateOrgMember],
  )

  const allPositions = useMemo(() => {
    return isAustralia() ? anzJobs : ukJobs
  }, [anzJobs, isAustralia, ukJobs])

  if (!profile) return

  return (
    <Grid item my={3}>
      <Grid
        container
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        my={2}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={displayOrgSelector ? 12 : 5}
          lg={5}
          mx={2}
        >
          <Typography variant="subtitle2" my={2}>
            {t('pages.my-profile.organization-details')}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={displayOrgSelector ? 12 : 5}
          lg={5}
          mx={2}
          display={displayOrgSelector ? '' : 'flex'}
          justifyContent={(() => {
            if (displayOrgSelector) return ''
            return isMobile ? 'flex-start' : 'flex-end'
          })()}
        >
          {displayOrgSelector ? (
            <OrgSelector
              allowAdding={allowAddingOrganisations}
              required
              countryCode={values.countryCode}
              {...register('organization')}
              autocompleteMode={false}
              showTrainerOrgOnly={false}
              error={errors.organization?.message}
              isEditProfile={true}
              userOrgIds={profile?.organizations.map(
                org => org.organization.id,
              )}
              value={
                (values.organization as unknown as Pick<
                  Organization,
                  'name' | 'id'
                >) ?? null
              }
              onChange={orgSelectorOnChange}
              textFieldProps={{
                variant: 'filled',
              }}
              isShallowRetrieval
              createdFrom={Org_Created_From_Enum.EditProfilePage}
            />
          ) : (
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => {
                setDisplayOrgSelector(true)
              }}
            >
              {t('pages.my-profile.add-new-organization-button')}
            </Button>
          )}
        </Grid>
      </Grid>

      {profile.organizations.length > 0 ? (
        <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
          {profile.organizations.map((orgMember, index) => {
            const isAdminEditable = isTTAdmin() || orgMember.isAdmin

            const editable = !id || isAdminEditable

            return (
              <Box key={orgMember.id}>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  align-items="stretch"
                >
                  <Box>
                    <Typography variant="body1" fontWeight="600">
                      {orgMember.organization.name}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={!canEditOrgUser()}
                    onClick={() => setOrgToLeave(orgMember)}
                  >
                    {t('common.leave')}
                  </Button>
                </Grid>

                <Autocomplete
                  value={orgMember.position}
                  disabled={!editable}
                  options={allPositions}
                  onChange={(_, value) =>
                    updatePosition(orgMember, value ?? '')
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="filled"
                      label={t('common.position')}
                      inputProps={{
                        ...params.inputProps,
                        sx: { height: 40 },
                      }}
                      sx={{ bgcolor: 'grey.100', my: 2 }}
                    />
                  )}
                />
                <FormControlLabel
                  sx={{ py: 2 }}
                  control={
                    <Switch
                      disabled={!isAdminEditable}
                      checked={
                        values?.org?.[index]
                          ? values?.org[index].isAdmin
                          : Boolean(orgMember.isAdmin)
                      }
                      onChange={e => {
                        setValue(`org.${index}.isAdmin`, e.target.checked)
                        setValue(`org.${index}.id`, orgMember.id)
                      }}
                      sx={{ px: 2 }}
                    />
                  }
                  label={
                    <Typography variant="body1">
                      {t(
                        'pages.org-details.tabs.users.edit-user-modal.organization-admin',
                      )}
                    </Typography>
                  }
                />
              </Box>
            )
          })}
        </Box>
      ) : null}
      {orgToLeave ? (
        <ConfirmDialog
          open={Boolean(orgToLeave)}
          message={t('pages.my-profile.org-leave-confirm-message', {
            name: orgToLeave.organization.name,
          })}
          onCancel={() => setOrgToLeave(undefined)}
          onOk={() => deleteOrgMember(orgToLeave)}
        />
      ) : null}
    </Grid>
  )
}
