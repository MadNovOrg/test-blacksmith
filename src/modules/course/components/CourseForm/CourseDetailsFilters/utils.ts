export type OrgAndName = {
  selectedOrganization: string
  keywordArray: string[]
}

const getNameFilterCondition = (
  filterCondition: Record<string, object>,
  keywordArray: string[],
): Record<string, object> => {
  if (keywordArray.length && keywordArray[0] !== '') {
    filterCondition = filterCondition.profile
      ? {
          profile: {
            _and: [
              filterCondition.profile,
              {
                _and: keywordArray.map(w => ({
                  _or: [
                    { fullName: { _ilike: `%${w}%` } },
                    { email: { _ilike: `%${w}%` } },
                    { translatedGivenName: { _ilike: `%${w}%` } },
                    { translatedFamilyName: { _ilike: `%${w}%` } },
                  ],
                })),
              },
            ],
          },
        }
      : {
          profile: {
            _and: keywordArray.map(w => ({
              _or: [
                { fullName: { _ilike: `%${w}%` } },
                { email: { _ilike: `%${w}%` } },
                { translatedGivenName: { _ilike: `%${w}%` } },
                { translatedFamilyName: { _ilike: `%${w}%` } },
              ],
            })),
          },
        }
  }
  return filterCondition
}

const getOrganizationFilterCondition = (
  filterCondition: Record<string, object>,
  selectedOrganization: string,
): Record<string, object> => {
  if (selectedOrganization && selectedOrganization !== '') {
    filterCondition = filterCondition.profile
      ? {
          profile: {
            _and: [
              filterCondition.profile,
              {
                organizations: {
                  organization: { name: { _eq: selectedOrganization } },
                },
              },
            ],
          },
        }
      : {
          profile: {
            organizations: {
              organization: { name: { _eq: selectedOrganization } },
            },
          },
        }
  }
  return filterCondition
}

export const getAttendeeTabWhereCondition = (
  keywordArray: string[],
  selectedOrganization: string,
  filterByHandS: boolean,
  filterByCourseEvaluation: boolean,
) => {
  const filterConditions: Record<string, object> = {}
  Object.assign(
    filterConditions,
    getOrganizationFilterCondition(filterConditions, selectedOrganization),
  )

  Object.assign(
    filterConditions,
    getNameFilterCondition(filterConditions, keywordArray),
  )

  if (filterByHandS) {
    Object.assign(filterConditions, {
      healthSafetyConsent: { _eq: true },
    })
  }
  if (filterByCourseEvaluation) {
    Object.assign(filterConditions, {
      completed_evaluation: { _eq: true },
    })
  }
  return filterConditions
}

export const getGradingTabWhereCondition = (
  keywordArray: string[],
  selectedOrganization: string,
): Record<string, object> => {
  const filterConditions: Record<string, object> = {}
  Object.assign(
    filterConditions,
    getOrganizationFilterCondition(filterConditions, selectedOrganization),
  )

  Object.assign(
    filterConditions,
    getNameFilterCondition(filterConditions, keywordArray),
  )

  return filterConditions
}
