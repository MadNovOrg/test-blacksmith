import { TableCell, Typography, Link } from '@mui/material'
import { FC } from 'react'

import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { CourseParticipant, Course } from '@app/types'

export const OrdersColumn: FC<{
  participant: CourseParticipant
  course: Course
}> = ({ participant, course }) => {
  const {
    acl: { canViewOrders },
  } = useAuth()

  if (course.type === Course_Type_Enum.Open && canViewOrders()) {
    return (
      <TableCell>
        {participant.order ? (
          <Link
            href={`/orders/${participant.order.id}`}
            data-testid="order-item-link"
            key="order-item-link"
          >
            {participant.order.xeroInvoiceNumber}
          </Link>
        ) : (
          <Typography color="InactiveCaption" style={{ userSelect: 'none' }}>
            -
          </Typography>
        )}
      </TableCell>
    )
  }
  return null
}
