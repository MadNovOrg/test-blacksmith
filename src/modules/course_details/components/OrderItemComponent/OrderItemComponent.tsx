import { Typography, Link } from '@mui/material'
import { Trans } from 'react-i18next'

type OrderItemComponentProps = {
  xeroInvoiceNumber?: string
  canOnlyViewOrderItemAsText?: boolean
  linkedOrderItemId?: string
}

export const OrderItemComponent: React.FC<
  React.PropsWithChildren<OrderItemComponentProps>
> = ({ xeroInvoiceNumber, canOnlyViewOrderItemAsText, linkedOrderItemId }) => {
  const component = canOnlyViewOrderItemAsText ? (
    <Typography
      data-testid="order-item-text"
      key="order-item-text"
      display="inline-flex"
      fontWeight="600"
      fontSize="1rem"
    />
  ) : (
    <Link
      href={`/orders/${linkedOrderItemId}`}
      data-testid="order-item-link"
      key="order-item-link"
      color="Highlight"
      fontWeight="600"
    />
  )
  return (
    <Trans
      i18nKey="common.order-item"
      defaults="Order: <0>{{invoiceNumber}}</0>"
      components={[component]}
      values={{
        invoiceNumber: xeroInvoiceNumber,
      }}
    />
  )
}
