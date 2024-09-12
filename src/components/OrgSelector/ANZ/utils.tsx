import { SxProps, TextFieldProps } from '@mui/material'
import { useMemo } from 'react'

import { Organization } from '@app/types'
import { organizationData as localSavedOrgToBeCreated } from '@app/util'

export type XeroSuggestion = {
  id: string
  contactID: string
}

export const isXeroSuggestion = (o: CallbackOption): o is SuggestionOption =>
  !!o && 'fromXero' in o

export const isHubOrg = (o: CallbackOption): o is Organization =>
  !!o && 'id' in o

export type OrgSelectorProps = {
  label?: string
  allowAdding?: boolean
  autocompleteMode?: boolean
  countryCode?: string
  disabled?: boolean
  error?: string
  isEditProfile?: boolean
  isShallowRetrieval?: boolean
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
  canSearchByAddress?: boolean
  showOnlyMainOrgs?: boolean
  showOnlyPossibleAffiliatedOrgs?: boolean
  allowedOrgCountryCode?: string
  mainOrgId?: string
}

export type SuggestionOption = {
  id?: string
  name: string
  xeroId?: string
}
export type CallbackOption = Organization | SuggestionOption | null

export const useOrganizationToBeCreatedOnRegistration = () => {
  return useMemo(() => localSavedOrgToBeCreated, [localSavedOrgToBeCreated]) //eslint-disable-line  react-hooks/exhaustive-deps
}
