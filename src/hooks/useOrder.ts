import { useQuery } from 'urql'

import { GetOrderQuery, GetOrderQueryVariables } from '@app/generated/graphql'
import { QUERY as GET_ORDER } from '@app/queries/order/get-order'

export const useOrder = (orderId: string) => {
  const result = useQuery<GetOrderQuery, GetOrderQueryVariables>({
    query: GET_ORDER,
    variables: { orderId },
    requestPolicy: 'cache-and-network',
  })

  return result
}
