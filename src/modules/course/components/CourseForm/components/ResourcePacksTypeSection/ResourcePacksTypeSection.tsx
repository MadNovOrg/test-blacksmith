import {
  Alert,
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material'
import { useMemo } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Trans } from 'react-i18next'

import { InfoPanel } from '@app/components/InfoPanel'
import { Resource_Packs_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useOrgResourcePacks } from '@app/modules/course/hooks/useOrgResourcePacks'
import { CourseInput } from '@app/types'

import { getResourcePacksTypeOptionLabels } from './utils'

type ResourcePacksTypeSectionProps = {
  disabledFields: Set<string>
}

export const ResourcePacksTypeSection = ({
  disabledFields,
}: ResourcePacksTypeSectionProps) => {
  const { t, _t } = useScopedTranslation('components.course-form')

  const theme = useTheme()

  const {
    control,
    formState: { errors },
  } = useFormContext<CourseInput>()

  const org = useWatch({ control, name: 'organization' })

  const resourcePacks = useOrgResourcePacks({ orgId: org?.id })

  const options = useMemo(() => getResourcePacksTypeOptionLabels(_t), [_t])

  return (
    <InfoPanel
      renderContent={(content, props) => (
        <Box {...props} p={3} pt={4}>
          {content}
        </Box>
      )}
      title={t('resource-packs-section-title')}
      titlePosition="outside"
      panelDescription={
        <Trans
          i18nKey="components.course-form.resource-packs.section-description"
          components={{
            resourcePacksOrdersLink: (
              <Link
                target="_blank"
                data-testid="resource-packs-section-description"
                rel="noreferrer"
                sx={{
                  color: '#0000EE',
                  textDecoration: 'underline',
                }}
                href={'https://www.teamteach.com/au/resource-pack-orders/'}
              />
            ),
          }}
        />
      }
    >
      <Box>
        <FormControl fullWidth sx={{ mb: theme.spacing(2) }} variant="filled">
          <InputLabel required>{_t('resource-packs-type')}</InputLabel>
          <Controller
            name="resourcePacksType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                data-testid="course-resource-packs-type-select"
                disabled={disabledFields.has('resourcePacksType')}
              >
                {Object.entries(options).map(([key, value]) => {
                  return (
                    <MenuItem
                      data-testid={`course-resource-packs-type-select-${key}`}
                      key={key}
                      value={key}
                    >
                      {value}
                    </MenuItem>
                  )
                })}
              </Select>
            )}
          />
          {errors.resourcePacksType?.message ? (
            <FormHelperText error>
              {errors.resourcePacksType?.message}
            </FormHelperText>
          ) : null}
        </FormControl>

        {org ? (
          <div>
            <Box sx={{ display: 'flex', justifyContent: 'start', gap: '4px' }}>
              <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                Balance:{' '}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: '14px', fontWeight: 400 }}
              >
                Digital Workbook & Connect:{' '}
                <Typography
                  component={'span'}
                  sx={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {resourcePacks.balance[
                    Resource_Packs_Type_Enum.DigitalWorkbook
                  ] ?? 'Unknown'}
                </Typography>
                , Print Workbook & Connect:{' '}
                <Typography
                  component={'span'}
                  sx={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {resourcePacks.balance[
                    Resource_Packs_Type_Enum.PrintWorkbook
                  ] ?? 'Unknown'}
                </Typography>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'start', gap: '4px' }}>
              <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                Reserved balance:{' '}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: '14px', fontWeight: 400 }}
              >
                Digital Workbook & Connect:{' '}
                <Typography
                  component={'span'}
                  sx={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {resourcePacks.reserved[
                    Resource_Packs_Type_Enum.DigitalWorkbook
                  ] ?? 'Unknown'}
                </Typography>
                , Print Workbook & Connect:{' '}
                <Typography
                  component={'span'}
                  sx={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {resourcePacks.reserved[
                    Resource_Packs_Type_Enum.PrintWorkbook
                  ] ?? 'Unknown'}
                </Typography>
              </Typography>
            </Box>
          </div>
        ) : null}

        <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
          <Trans
            components={[
              <Link
                href={`mailto:${
                  import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS_ANZ
                }`}
                key="contact"
                underline="always"
              />,
            ]}
            i18nKey="components.course-form.resource-packs-alert"
            values={{
              email: import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS_ANZ,
            }}
          />
        </Alert>
      </Box>
    </InfoPanel>
  )
}
