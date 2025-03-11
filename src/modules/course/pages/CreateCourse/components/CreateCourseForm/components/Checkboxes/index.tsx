import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Link,
} from '@mui/material'
import { t } from 'i18next'
import { useEffect, useMemo, useState } from 'react'
import { Trans } from 'react-i18next'
type Props = {
  formSubmitted: boolean
  courseResidingCountry: string
  displayConnectFeeCondition: boolean
  displayResourcePacksCondition: boolean
  isBILDCourse: boolean
  handleConsentFlagChanged: (value: ConsentFlags) => void
}

export type ConsentFlags = {
  healthLeaflet: boolean
  practiceProtocols: boolean
  validID: boolean
  needsAnalysis?: boolean
  connectFee?: boolean
  resourcePacks?: boolean
}

export const CourseFormCheckboxes: React.FC<React.PropsWithChildren<Props>> = ({
  formSubmitted,
  courseResidingCountry,
  displayConnectFeeCondition,
  displayResourcePacksCondition,
  isBILDCourse,
  handleConsentFlagChanged,
}) => {
  const [consentFlags, setConsentFlags] = useState({
    healthLeaflet: false,
    practiceProtocols: false,
    validID: false,
    ...(isBILDCourse ? { needsAnalysis: false } : {}),
    ...(displayConnectFeeCondition ? { connectFee: false } : {}),
    ...(displayResourcePacksCondition ? { resourcePacks: false } : {}),
  })

  const checkboxError = useMemo(
    () =>
      formSubmitted &&
      (!consentFlags.healthLeaflet ||
        !consentFlags.practiceProtocols ||
        !consentFlags.validID ||
        (displayConnectFeeCondition && !consentFlags.connectFee) ||
        (displayResourcePacksCondition && !consentFlags.resourcePacks) ||
        (isBILDCourse && !consentFlags.needsAnalysis)),
    [
      formSubmitted,
      consentFlags.healthLeaflet,
      consentFlags.practiceProtocols,
      consentFlags.validID,
      consentFlags.connectFee,
      consentFlags.resourcePacks,
      consentFlags.needsAnalysis,
      displayConnectFeeCondition,
      displayResourcePacksCondition,
      isBILDCourse,
    ],
  )

  const handleChange = (flag: keyof typeof consentFlags, checked: boolean) => {
    setConsentFlags({
      ...consentFlags,
      [flag]: checked,
    })
  }

  useEffect(() => {
    handleConsentFlagChanged(consentFlags)
  }, [consentFlags, handleConsentFlagChanged])

  useEffect(() => {
    setConsentFlags({
      healthLeaflet: false,
      practiceProtocols: false,
      validID: false,
      ...(isBILDCourse ? { needsAnalysis: false } : {}),
      ...(displayConnectFeeCondition ? { connectFee: false } : {}),
      ...(displayResourcePacksCondition ? { resourcePacks: false } : {}),
    })
  }, [
    courseResidingCountry,
    displayConnectFeeCondition,
    displayResourcePacksCondition,
    isBILDCourse,
  ])

  return (
    <FormControl required error={checkboxError}>
      <FormGroup sx={{ marginTop: 3 }} data-testid="acknowledge-checks">
        <FormControlLabel
          control={
            <Checkbox
              checked={consentFlags.healthLeaflet}
              onChange={e => handleChange('healthLeaflet', e.target.checked)}
            />
          }
          label={t('pages.create-course.form.health-leaflet-copy')}
          sx={{ mb: 1 }}
          data-testid="healthLeaflet"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={consentFlags.practiceProtocols}
              onChange={e =>
                handleChange('practiceProtocols', e.target.checked)
              }
            />
          }
          label={t('pages.create-course.form.practice-protocol-copy')}
          sx={{ mb: 2 }}
          data-testid="practiceProtocols"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={consentFlags.validID}
              onChange={e => handleChange('validID', e.target.checked)}
            />
          }
          label={t('pages.create-course.form.valid-id-copy')}
          sx={{ mb: 2 }}
          data-testid="validID"
        />

        {displayConnectFeeCondition ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={consentFlags.connectFee}
                onChange={e => handleChange('connectFee', e.target.checked)}
              />
            }
            label={t('pages.create-course.form.connect-fee-notification')}
            data-testid="connectFee"
          />
        ) : null}

        {isBILDCourse ? (
          <FormControlLabel
            required
            control={
              <Checkbox
                checked={consentFlags.needsAnalysis}
                onChange={e => handleChange('needsAnalysis', e.target.checked)}
              />
            }
            label={t('pages.create-course.form.needs-analysis-copy')}
            data-testid="needsAnalysis"
          />
        ) : null}
        {displayResourcePacksCondition ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={consentFlags.resourcePacks}
                onChange={e => handleChange('resourcePacks', e.target.checked)}
              />
            }
            label={
              <Trans
                i18nKey="pages.create-course.form.resource-pack-notification"
                components={{
                  resourcePacksOrdersLink: (
                    <Link
                      target="_blank"
                      rel="noreferrer"
                      sx={{
                        color: '#0000EE',
                        textDecoration: 'underline',
                      }}
                      href={
                        'https://www.teamteach.com/au/resource-pack-orders/'
                      }
                    />
                  ),
                }}
              />
            }
            data-testid="resourcePacks"
          />
        ) : null}

        {checkboxError && (
          <FormHelperText data-testid="checkbox-error">
            {t('pages.create-course.form.checkboxes-missing')}
          </FormHelperText>
        )}
      </FormGroup>
    </FormControl>
  )
}
