import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { FC, useState } from 'react'

import { Dialog, Props } from '@app/components/dialogs'
import { GetOrganisationDetailsQuery } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { MergeOrganisationsWarning } from '../MergeOrganisationsWarning/MergeOrganisationsWarning'

export const MergeOrganisationsDialog: FC<
  Props & { selectedOrgs: GetOrganisationDetailsQuery['orgs'][0][] }
> = props => {
  const { selectedOrgs } = props
  const { t, _t } = useScopedTranslation('pages.admin.organizations.merge')
  const [selectedMain, setSelectedMain] = useState<string>('')

  const [showWarning, setShowWarning] = useState(false)

  return (
    <>
      <Dialog
        maxWidth={700}
        {...props}
        slots={{
          Title: () => <>{t('select-main')}</>,
          Content: () => (
            <>
              <Alert
                severity="success"
                color="warning"
                variant="outlined"
                sx={{ mb: 2 }}
              >
                {t('merge-alert')}
              </Alert>
              <RadioGroup
                onClick={e =>
                  setSelectedMain((e.target as HTMLInputElement).value)
                }
              >
                {selectedOrgs.map(org => {
                  const {
                    headEmailAddress: _headEmailAddress,
                    headFirstName: _headFirstName,
                    headSurname: _headSurname,
                    settingName: _settingName,
                    ofstedRating: _ofstedRating,
                    localAuthority: _localAuthority,
                    ofstedLastInspection: _ofstedLastInspection,
                    ...attributes
                  } = (org?.attributes ?? {}) as {
                    headSurname?: string
                    settingName?: string
                    headFirstName?: string
                    headEmailAddress?: string
                    ofstedRating?: string
                    localAuthority?: string
                    ofstedLastInspection?: string
                  }

                  const { countryCode: _countryCode, ...address } =
                    (org?.address ?? {}) as {
                      countryCode?: string
                    }

                  const attrs = {
                    ...attributes,
                    type: org.organisationType,
                  }
                  return (
                    <FormControlLabel
                      key={org.id}
                      value={org.id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="h6">{org.name}</Typography>
                          <Typography variant="body2">
                            <b>{t('address')}: </b>
                            {Object.values(address ?? {})
                              .filter(Boolean)
                              .join(', ') || '-'}
                          </Typography>
                          <Typography variant="body2">
                            <b>{t('details')}:</b>{' '}
                            {Object.values(attrs ?? {})
                              .filter(Boolean)
                              .join(', ') || '-'}
                          </Typography>
                        </Box>
                      }
                    />
                  )
                })}
              </RadioGroup>
            </>
          ),
          Actions: () => (
            <Grid container justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                onClick={() => setShowWarning(true)}
                disabled={!selectedMain}
              >
                {t('merge')}
              </Button>
              <Button variant="outlined" onClick={props.onClose}>
                {_t('cancel')}
              </Button>
            </Grid>
          ),
        }}
      />
      <MergeOrganisationsWarning
        open={showWarning}
        onClose={() => {
          setShowWarning(false)
          props.onClose()
        }}
        selectedMain={selectedMain}
        selectedOrgs={selectedOrgs}
      />
    </>
  )
}
