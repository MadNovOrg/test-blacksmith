import { GridValidRowModel } from '@mui/x-data-grid'
import { zonedTimeToUtc } from 'date-fns-tz'
import { useMutation } from 'urql'

import {
  DeleteCoursePricingScheduleMutation,
  DeleteCoursePricingScheduleMutationVariables,
  InsertCoursePricingScheduleMutation,
  InsertCoursePricingScheduleMutationVariables,
  SetCoursePricingScheduleMutation,
  SetCoursePricingScheduleMutationVariables,
} from '@app/generated/graphql'

import {
  DELETE_COURSE_PRICING,
  INSERT_COURSE_PRICING,
  UPDATE_COURSE_PRICING,
} from '../queries'

export type PricingDetails = {
  rowAfterChange: GridValidRowModel
}

export const useUpdatePricingEntry = () => {
  const [{ data, error }, updateCoursePricingSchedule] = useMutation<
    SetCoursePricingScheduleMutation,
    SetCoursePricingScheduleMutationVariables
  >(UPDATE_COURSE_PRICING)

  const updatePricingSchedule = async ({ rowAfterChange }: PricingDetails) => {
    const { data } = await updateCoursePricingSchedule({
      id: rowAfterChange.id,
      priceAmount: rowAfterChange.priceAmount,
      effectiveFrom: zonedTimeToUtc(
        new Date(rowAfterChange.effectiveFrom),
        'GMT',
      ),
      effectiveTo:
        rowAfterChange.effectiveTo !== null
          ? zonedTimeToUtc(new Date(rowAfterChange.effectiveTo), 'GMT')
          : null,
    })
    return data
  }
  return { data, error, updatePricingSchedule }
}

export const useInsertPricingEntry = () => {
  return useMutation<
    InsertCoursePricingScheduleMutation,
    InsertCoursePricingScheduleMutationVariables
  >(INSERT_COURSE_PRICING)
}

export const useDeleteCoursePricing = () => {
  return useMutation<
    DeleteCoursePricingScheduleMutation,
    DeleteCoursePricingScheduleMutationVariables
  >(DELETE_COURSE_PRICING)
}

export * from './usePricingChangelog'
export * from './useCoursePricing'
