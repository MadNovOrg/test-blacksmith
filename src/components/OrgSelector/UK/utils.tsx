import { SxProps, TextFieldProps } from '@mui/material'
import { useMemo } from 'react'

import {
  Dfe_Establishment,
  Org_Created_From_Enum,
} from '@app/generated/graphql'
import { Establishment, OfstedRating, Organization } from '@app/types'
import { organizationData as localSavedOrgToBeCreated } from '@app/util'

export enum OfstedRatingEnum {
  OUTSTANDING = 'Outstanding',
  INADEQUATE = 'Inadequate',
  REQUIRES_IMPROVEMENT = 'Requires improvement',
  INSUFFICIENT_EVIDENCE = 'Insufficient evidence',
  SERIOUS_WEAKNESSES = 'Serious Weaknesses',
  GOOD = 'Good',
  SPECIAL_MEASURES = 'Special Measures',
}

export const ofstedRating: Record<OfstedRatingEnum & 'default', OfstedRating> =
  {
    [OfstedRatingEnum.OUTSTANDING]: OfstedRating.OUTSTANDING,
    [OfstedRatingEnum.INADEQUATE]: OfstedRating.INADEQUATE,
    [OfstedRatingEnum.REQUIRES_IMPROVEMENT]: OfstedRating.REQUIRES_IMPROVEMENT,
    [OfstedRatingEnum.INSUFFICIENT_EVIDENCE]:
      OfstedRating.INSUFFICIENT_EVIDENCE,
    [OfstedRatingEnum.SERIOUS_WEAKNESSES]: OfstedRating.SERIOUS_WEAKNESSES,
    [OfstedRatingEnum.GOOD]: OfstedRating.GOOD,
    [OfstedRatingEnum.SPECIAL_MEASURES]: OfstedRating.SPECIAL_MEASURES,
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

export type OrgSelectorProps = {
  allowAdding?: boolean
  autocompleteMode?: boolean
  canSearchByAddress?: boolean
  countryCode?: string
  createdFrom?: Org_Created_From_Enum
  disabled?: boolean
  disableOrganisationEnquiryOrCreation?: boolean
  error?: string
  isEditProfile?: boolean
  isShallowRetrieval?: boolean
  label?: string
  onChange: (org: CallbackOption) => void
  onInputChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  searchOnlyByPostCode?: boolean
  showDfeResults?: boolean
  showHubResults?: boolean
  showTrainerOrgOnly?: boolean
  sx?: SxProps
  textFieldProps?: TextFieldProps
  userOrgIds?: string[]
  value?: Pick<Organization, 'name' | 'id'> | null
}

export type SuggestionOption = {
  id?: string
  name: string
  xeroId?: string
}
export type CallbackOption =
  | Organization
  | Dfe_Establishment
  | SuggestionOption
  | null

export const useOrganizationToBeCreatedOnRegistration = () => {
  return useMemo(() => localSavedOrgToBeCreated, [localSavedOrgToBeCreated]) //eslint-disable-line  react-hooks/exhaustive-deps
}
