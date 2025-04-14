import React, { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CombinedError } from 'urql'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  Resource_Packs_Pricing,
} from '@app/generated/graphql'
import { useAllResourcePacksPricing } from '@app/modules/organisation/hooks/useAllResourcePacksPricing'
import { useGetAllAffiliatedOrgIds } from '@app/modules/organisation/hooks/useGetAllAffiliatedOrgIds'
import { useMainOrgId } from '@app/modules/organisation/hooks/useMainOrgId'
import { useOrgResourcePacksPricingsByOrgId } from '@app/modules/organisation/hooks/useOrgResourcePacksPricingsByOrgId'
import { CourseTypeOrgRPPricings } from '@app/util'

import { GroupedResourcePacksPricing } from '../components/ResourcePacksPricingsByCourseType'

export type MinimalOrgResourcePacksPricing = {
  id: string
  resource_packs_pricing_id: string
  AUD_price: number
  NZD_price: number
}

export type ContextValue = {
  main_organisation_id: string | null
  fetching: boolean
  refetch: () => void
  groupedData: GroupedResourcePacksPricing[]
  pricing: GroupedResourcePacksPricing | null
  setSelectedPricing: (pricing: GroupedResourcePacksPricing | null) => void
  error: CombinedError | undefined
  orgResourcePacksPricings: MinimalOrgResourcePacksPricing[]
  affiliatesIds: string[]
  fetchingAffiliatesIds: boolean
  refetchAffiliatesIds: () => void
  differentPricesFromMain?: boolean
}

export const ResourcePacksPricingContext = React.createContext<
  ContextValue | undefined
>(undefined)

export const ResourcePacksPricingProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const { id: orgId } = useParams()

  const [pricing, setPricing] = useState<GroupedResourcePacksPricing | null>(
    null,
  )

  const { data: main_organisation_id } = useMainOrgId(orgId)

  const { data, fetching, error, refetch } = useAllResourcePacksPricing(
    CourseTypeOrgRPPricings,
    orgId ?? '',
  )

  const resourcePacksPricings = useMemo(
    () =>
      fetching
        ? []
        : (data?.resource_packs_pricing as Resource_Packs_Pricing[]),
    [fetching, data],
  )
  const groupedPricings = useMemo(() => {
    const map = new Map<string, Resource_Packs_Pricing[]>()
    resourcePacksPricings.forEach(p => {
      const key = `${p.course_type}-${p.course_level}-${p.reaccred}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)?.push(p)
    })

    return Array.from(map.entries()).map(([key, values]) => {
      const [courseType, courseLevel, reaccred] = key.split('-')
      return {
        key,
        courseType: courseType as Course_Type_Enum,
        courseLevel: courseLevel as Course_Level_Enum,
        reaccred: reaccred === 'true',
        values,
      } as GroupedResourcePacksPricing
    })
  }, [resourcePacksPricings])

  const orgResourcePacksPricings = useMemo(() => {
    const result = resourcePacksPricings.flatMap(item => {
      if (item.org_resource_packs_pricings?.length) {
        return item.org_resource_packs_pricings.map(value => ({
          id: value.id,
          resource_packs_pricing_id: item.id,
          AUD_price: value.AUD_price,
          NZD_price: value.NZD_price,
        }))
      }
      return []
    })
    return result.length && result.some(item => Object.keys(item).length)
      ? result
      : []
  }, [resourcePacksPricings])

  const { data: mainOrgResourcePacksPricings } =
    useOrgResourcePacksPricingsByOrgId(main_organisation_id)

  const differentPricesFromMain = useMemo(() => {
    if (
      mainOrgResourcePacksPricings?.length !== orgResourcePacksPricings.length
    )
      return true

    return orgResourcePacksPricings.some(pricing => {
      // find the main org pricing
      const mainOrgPricing = mainOrgResourcePacksPricings?.find(
        mainPricing =>
          mainPricing.resource_packs_pricing_id ===
          pricing.resource_packs_pricing_id,
      )
      // if main org does not have pricing for that resource_packs_pricing_id value, then it uses the default and pricings are different
      if (!mainOrgPricing) return true
      return (
        mainOrgPricing.AUD_price !== pricing.AUD_price ||
        mainOrgPricing.NZD_price !== pricing.NZD_price
      )
    })
  }, [mainOrgResourcePacksPricings, orgResourcePacksPricings])

  const {
    data: orgAffiliatesIds,
    fetching: fetchingAffiliatesIds,
    refetch: refetchIds,
  } = useGetAllAffiliatedOrgIds(orgId)

  const affiliatesIds = useMemo(() => {
    return orgAffiliatesIds?.flatMap(affiliate => affiliate.id)
  }, [orgAffiliatesIds])
  const refetchAffiliatesIds = useCallback(() => {
    refetchIds({ requestPolicy: 'network-only' })
  }, [refetchIds])

  const setSelectedPricing = useCallback<ContextValue['setSelectedPricing']>(
    pricing => {
      setPricing(pricing)
    },
    [],
  )

  const refetchPricings = useCallback(() => {
    refetch({ requestPolicy: 'network-only' })
  }, [refetch])

  const value = useMemo<ContextValue>(
    () => ({
      main_organisation_id,
      fetching,
      refetch: refetchPricings,
      groupedData: groupedPricings,
      pricing,
      setSelectedPricing,
      error,
      orgResourcePacksPricings: orgResourcePacksPricings ?? [],
      differentPricesFromMain,
      affiliatesIds: affiliatesIds ?? [],
      fetchingAffiliatesIds,
      refetchAffiliatesIds,
    }),
    [
      main_organisation_id,
      fetching,
      refetchPricings,
      groupedPricings,
      pricing,
      setSelectedPricing,
      error,
      orgResourcePacksPricings,
      differentPricesFromMain,
      affiliatesIds,
      fetchingAffiliatesIds,
      refetchAffiliatesIds,
    ],
  )

  return (
    <ResourcePacksPricingContext.Provider value={value}>
      {children}
    </ResourcePacksPricingContext.Provider>
  )
}
