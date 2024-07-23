import { GridValidRowModel } from '@mui/x-data-grid'
import { zonedTimeToUtc } from 'date-fns-tz'
import { useMutation } from 'urql'

import {
  Course_Pricing,
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
  rowBeforeChange: GridValidRowModel
  pricing: Course_Pricing | null
  authorId: string
}

export const useUpdatePricingEntry = () => {
  const [{ data, error }, updateCoursePricingSchedule] = useMutation<
    SetCoursePricingScheduleMutation,
    SetCoursePricingScheduleMutationVariables
  >(UPDATE_COURSE_PRICING)

  const updatePricingSchedule = async ({
    rowAfterChange,
    rowBeforeChange,
    pricing,
    authorId,
  }: PricingDetails) => {
    const { data } = await updateCoursePricingSchedule({
      id: rowAfterChange.id,
      coursePricingId: pricing?.id,
      oldPrice: rowBeforeChange.priceAmount,
      priceAmount: rowAfterChange.priceAmount,
      authorId,
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
