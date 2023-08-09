import {
  CallbackOption,
  SuggestionOption,
} from '@app/components/OrgSelector/index'
import {
  Establishment,
  OfstedRating,
  Organization,
  TrustType,
} from '@app/types'

export function getTrustType(dfeValue?: string) {
  if (dfeValue === 'Supported by a multi-academy trust') {
    return TrustType.MultiAcademyTrust
  } else if (dfeValue === 'Supported by a single-academy trust') {
    return TrustType.SingleAcademyTrust
  } else if (dfeValue === 'Supported by a trust') {
    return TrustType.SupportedByATrust
  } else {
    return TrustType.NotApplicable
  }
}

export function getOfstedRating(dfeValue?: string) {
  if (dfeValue === 'Outstanding') {
    return OfstedRating.OUTSTANDING
  } else if (dfeValue === 'Inadequate') {
    return OfstedRating.INADEQUATE
  } else if (dfeValue === 'Requires improvement') {
    return OfstedRating.REQUIRES_IMPROVEMENT
  } else if (dfeValue === 'Insufficient evidence') {
    return OfstedRating.INSUFFICIENT_EVIDENCE
  } else if (dfeValue === 'Serious Weaknesses') {
    return OfstedRating.SERIOUS_WEAKNESSES
  } else if (dfeValue === 'Good') {
    return OfstedRating.GOOD
  } else if (dfeValue === 'Special Measures') {
    return OfstedRating.SPECIAL_MEASURES
  } else {
    return null
  }
}

export type XeroSuggestion = {
  id: string
  contactID: string
}

export const isDfeSuggestion = (o: CallbackOption): o is Establishment =>
  !!o && 'urn' in o

export const isXeroSuggestion = (o: CallbackOption): o is SuggestionOption =>
  !!o && 'fromXero' in o

export const isHubOrg = (o: CallbackOption): o is Organization =>
  !!o && 'id' in o && !isDfeSuggestion(o)
