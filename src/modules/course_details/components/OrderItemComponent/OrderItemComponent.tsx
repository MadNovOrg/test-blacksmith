import { Typography, Link } from '@mui/material'

type OrderItemComponentProps = {
  orders?: {
    xeroInvoiceNumber?: string
    linkedOrderItemId?: string
  }[]
  canOnlyViewOrderItemAsText?: boolean
}

export const OrderItemComponent: React.FC<
  React.PropsWithChildren<OrderItemComponentProps>
> = ({ canOnlyViewOrderItemAsText, orders }) => {
  return (
    <>
      Order:{' '}
      {orders?.map(order =>
        canOnlyViewOrderItemAsText ? (
          <>
            <Typography
              data-testid="order-item-text"
              key="order-item-text"
              display="inline-flex"
              fontWeight="600"
              fontSize="1rem"
            >
              {order.xeroInvoiceNumber}
            </Typography>{' '}
          </>
        ) : (
          <>
            <Link
              href={`/orders/${order.linkedOrderItemId}`}
              data-testid="order-item-link"
              key="order-item-link"
              color="Highlight"
              fontWeight="600"
            >
              {order.xeroInvoiceNumber}
            </Link>{' '}
          </>
        ),
      )}
    </>
  )
}
