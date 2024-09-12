import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Typography } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Dialog } from '@app/components/dialogs'
import { OrgSelector } from '@app/components/OrgSelector/ANZ'
import { CallbackOption } from '@app/components/OrgSelector/ANZ/utils'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useLinkAffiliatedOrganisation } from '@app/modules/organisation/hooks/useLinkAffiliatedOrganisation'
import { yup } from '@app/schemas'

export type AddAffiliatedOrgModalProps = {
  mainOrgId: string
  mainOrgName: string
  mainOrgCountryCode: string
  onClose: () => void
  onSave: () => void
}

export type FormInput = {
  affiliatedOrgId: string
  affiliatedOrgName: string
}

export const AddAffiliatedOrgModal = ({
  mainOrgId,
  mainOrgName,
  mainOrgCountryCode,
  onClose,
  onSave,
}: AddAffiliatedOrgModalProps) => {
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.affiliated-orgs.add-affiliate',
  )
  const schema = useMemo(() => {
    return yup.object({
      affiliatedOrgName: yup
        .string()
        .required(t('validation-errors.affiliate-org-required')),
    })
  }, [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      affiliatedOrgId: '',
      affiliatedOrgName: '',
    },
  })

  const [, linkAffiliatedOrganisation] = useLinkAffiliatedOrganisation()
  const onAffiliatedOrgSelected = useCallback(
    async (org: CallbackOption) => {
      setValue('affiliatedOrgId', org?.id ?? '')
      setValue('affiliatedOrgName', org?.name ?? '', { shouldValidate: true })
    },
    [setValue],
  )
  const onAffiliatedOrgInputChange = useCallback(
    (value: string) => {
      setValue('affiliatedOrgName', value ?? '', { shouldValidate: true })
    },
    [setValue],
  )

  const onFormSubmit = async (data: FormInput) => {
    await linkAffiliatedOrganisation({
      mainOrgId,
      affiliatedOrgId: data.affiliatedOrgId,
    })
    onSave()
  }

  return (
    <Dialog
      open
      onClose={onClose}
      minWidth={600}
      data-testid="add-affiliated-org-modal"
      slots={{
        Title: () => (
          <Typography variant="h4" fontWeight={600}>
            {t('title')}
          </Typography>
        ),
      }}
    >
      <Box>
        <Typography sx={{ padding: '10px 0px' }}>
          {t('description')}
          <strong>{mainOrgName}</strong>
        </Typography>
        <OrgSelector
          data-testid="affiliated-org"
          sx={{
            padding: '10px 0px',
          }}
          label={t('org-selector-placeholder')}
          required
          {...register('affiliatedOrgName')}
          error={errors.affiliatedOrgName?.message}
          allowAdding
          autocompleteMode={true}
          onChange={onAffiliatedOrgSelected}
          onInputChange={onAffiliatedOrgInputChange}
          textFieldProps={{
            variant: 'filled',
          }}
          showDfeResults={false}
          allowedOrgCountryCode={mainOrgCountryCode}
          showOnlyPossibleAffiliatedOrgs={true}
          mainOrgId={mainOrgId}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
          }}
        >
          <Button
            data-testid="close-link-affiliate-org-button"
            type="button"
            onClick={onClose}
          >
            {t('close-button')}
          </Button>
          <Button
            data-testid="confirm-link-affiliate-org-button"
            onClick={handleSubmit(onFormSubmit)}
            type="button"
            color="primary"
            variant="contained"
          >
            {t('confirm-button')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
