import { styled, Box, Typography } from '@mui/material'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { WorkbookDeliveryAddress } from '../WorkbookDeliveryAddress'

type Props = {
  details: WorkbookDeliveryAddress
}

const ItemRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}))

export const WorkbookAddressDetails: React.FC<
  React.PropsWithChildren<Props>
> = ({ details }) => {
  const { t } = useScopedTranslation(
    'pages.create-course.license-order-details.workbook-address',
  )
  const infoRows: Record<string, string> = {
    [t('order-contact.title')]: details.orgContactFullName,
    [t('organisation.title')]: details.orgName,
    [t('address.country.title')]: details.country,
    [t('address.line-1.title')]: details.addressLine1,
    [t('address.line-2.title')]: details.addressLine2,
    [t('address.suburb.title')]: details.suburb,
    [t('address.city.title')]: details.city,
    [t('address.region.title')]: details.regionOther
      ? details.regionOther
      : details.region,
    [t('address.postcode.title')]: details.postcode,
  }

  return (
    <>
      <Typography variant="h6" mb={2}>
        {t('title')}
      </Typography>
      {Object.keys(infoRows).map(rowKey =>
        infoRows[rowKey] ? (
          <ItemRow key={rowKey}>
            <Typography color="textSecondary">{rowKey}</Typography>
            <Typography>{infoRows[rowKey]}</Typography>
          </ItemRow>
        ) : null,
      )}
    </>
  )
}
