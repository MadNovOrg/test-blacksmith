import { subYears } from 'date-fns'
import { t } from 'i18next'
import { RefObject } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { InferType } from 'yup'

import { GetProfileDetailsQuery } from '@app/generated/graphql'
import { yup, schemas } from '@app/schemas'
import {
  Organization,
  RoleName,
  TrainerAgreementTypeName,
  TrainerRoleTypeName,
} from '@app/types'

import { RolesFields, rolesFormSchema } from '../../components/EditRoles/UK'
import {
  anzDefaultTrainerRoles,
  BILDRolesNames,
  DietaryRestrictionRadioValues,
  DisabilitiesRadioValues,
  employeeRole,
  EmployeeRoleName,
  employeeRolesNames,
  salesRole,
  salesRolesNames,
  ukDefaultTrainerRoles,
  UserRoleName,
  userRolesNames,
  userSubRoles,
} from '../../utils'

export const editProfileFormSchema = () => {
  return yup
    .object({
      avatar: yup.string().nullable(),
      firstName: yup
        .string()
        .required(
          t('validation-errors.required-field', { name: t('first-name') }),
        ),
      surname: yup
        .string()
        .required(
          t('validation-errors.required-field', { name: t('surname') }),
        ),
      countryCode: yup.string(),
      country: yup.string().required(
        t('validation-errors.required-field', {
          name: t('country'),
        }),
      ),
      canAccessKnowledgeHub: yup.boolean().optional(),
      phone: schemas.phone(t),
      phoneCountryCode: yup.string().optional(),
      dob: yup
        .date()
        .nullable()
        .max(subYears(new Date(), 16), t('validation-errors.date-too-early')),
      jobTitle: yup
        .string()
        .required(
          t('validation-errors.required-field', { name: t('job-title') }),
        ),
      otherJobTitle: yup.string().when('jobTitle', ([jobTitle], schema) => {
        return jobTitle === 'Other'
          ? schema.required(t('validation-errors.other-job-title-required'))
          : schema
      }),
      org: yup.array().of(
        yup.object({
          isAdmin: yup.boolean().required(),
          id: yup.string().required(),
        }),
      ),
      organization: yup
        .object<Partial<Organization>>()
        .shape({
          id: yup.string(),
          name: yup.string(),
          moderatorRole: yup.boolean(),
        })
        .required(t('components.course-form.organisation-required')),
      disabilitiesRadioValue: yup
        .mixed<DisabilitiesRadioValues>()
        .oneOf(Object.values(DisabilitiesRadioValues)),
      dietaryRestrictionRadioValue: yup
        .mixed<DietaryRestrictionRadioValues>()
        .oneOf(Object.values(DietaryRestrictionRadioValues)),
      disabilities: yup
        .string()
        .nullable()
        .test(
          'disabilities-validation',
          t('validation-errors.required-field', {
            name: t('disabilities'),
          }),
          (value, context) => {
            const { disabilitiesRadioValue } = context.parent
            if (disabilitiesRadioValue === DisabilitiesRadioValues.YES)
              return !!value
            return true
          },
        ),
      dietaryRestrictions: yup
        .string()
        .nullable()
        .test(
          'dietary-validation',
          t('validation-errors.required-field', {
            name: t('dietary-restrictions'),
          }),
          (value, context) => {
            const { dietaryRestrictionRadioValue } = context.parent
            if (
              dietaryRestrictionRadioValue === DietaryRestrictionRadioValues.YES
            ) {
              return !!value
            }
            return true
          },
        ),
      roles: rolesFormSchema(),
    })
    .required()
}

export const profileEditDefaultValues = ({
  setValue,
  profile,
  isProfileStaleRef,
  isOtherJobTitle,
  trainerRolesNames,
  defaultTrainerRoles,
  trainerAgreementTypes,
}: {
  setValue: UseFormSetValue<EditProfileInputs>
  profile: GetProfileDetailsQuery['profile']
  isProfileStaleRef: RefObject<boolean>
  isOtherJobTitle: boolean
  trainerRolesNames: TrainerRoleTypeName[]
  trainerAgreementTypes?: TrainerAgreementTypeName[]
  defaultTrainerRoles:
    | typeof ukDefaultTrainerRoles
    | typeof anzDefaultTrainerRoles
}) => {
  // TODO: Refactor to reduce complexity, this function is too long
  if (profile && !isProfileStaleRef.current) {
    isProfileStaleRef.current = true
    setValue('avatar', profile.avatar as string)
    setValue('firstName', profile.givenName ?? '')
    setValue('surname', profile.familyName ?? '')
    setValue('phone', profile.phone ?? '')
    setValue('dob', profile.dob ? new Date(profile.dob) : null)
    setValue('disabilities', profile.disabilities ?? '')
    setValue('dietaryRestrictions', profile.dietaryRestrictions ?? '')
    setValue(
      'dietaryRestrictionRadioValue',
      getDietaryRestrictionsValue({
        restrictions: profile.dietaryRestrictions,
      }),
    )
    setValue(
      'disabilitiesRadioValue',
      getDisabilitiesValue({
        disabilities: profile.disabilities,
      }),
    )
    setValue('org', [])
    setValue(
      'canAccessKnowledgeHub',
      profile.canAccessKnowledgeHub ?? undefined,
    )
    setValue('country', profile.country ?? '')
    setValue('countryCode', profile.countryCode ?? '')
    setValue('phoneCountryCode', profile.phoneCountryCode ?? '')

    if (isOtherJobTitle) {
      setValue('jobTitle', 'Other')

      setValue('otherJobTitle', profile.jobTitle as string)
    } else if (profile?.jobTitle) {
      setValue('jobTitle', profile.jobTitle)
    }

    if (profile.roles.length) {
      const isEmployeeRole = (roleName: EmployeeRoleName) =>
        employeeRolesNames.some(name => name == roleName)

      const isSalesRole = (roleName: RoleName) =>
        salesRolesNames.some(name => name == roleName)

      const formattedTrainerRoleTypes = profile.trainer_role_types.reduce(
        (formattedTrainerRoleTypes, obj) => {
          if (
            trainerRolesNames.includes(
              obj.trainer_role_type.name as TrainerRoleTypeName,
            )
          ) {
            formattedTrainerRoleTypes.trainerRole = [
              ...formattedTrainerRoleTypes.trainerRole,
              obj.trainer_role_type.name,
            ]
          } else if (
            BILDRolesNames.includes(
              obj.trainer_role_type.name as TrainerRoleTypeName,
            )
          ) {
            ;(
              formattedTrainerRoleTypes as typeof ukDefaultTrainerRoles
            ).BILDRole = obj.trainer_role_type.name
          } else if (
            obj.trainer_role_type.name == TrainerRoleTypeName.MODERATOR
          ) {
            formattedTrainerRoleTypes.moderatorRole = true
          }
          return formattedTrainerRoleTypes
        },
        {
          ...defaultTrainerRoles,
        },
      )
      if (
        profile?.profile_trainer_agreement_types?.map(obj =>
          trainerAgreementTypes?.includes(
            obj.agreement_type as unknown as TrainerAgreementTypeName,
          ),
        )
      ) {
        ;(
          formattedTrainerRoleTypes as typeof ukDefaultTrainerRoles
        ).agreementTypes = profile.profile_trainer_agreement_types?.map(
          obj => obj.agreement_type,
        )
      }

      const formattedRoles = [] as RolesFields

      profile.roles.forEach(({ role }) => {
        const { name: roleName } = role
        const existingEmployeeRole = formattedRoles.find(
          obj => obj.userRole === employeeRole.name,
        )
        if (roleName === RoleName.TRAINER) {
          formattedRoles.push({
            userRole: roleName as UserRoleName,
            employeeRoles: [],
            salesRoles: [],
            trainerRoles: formattedTrainerRoleTypes,
          })
        } else if (isEmployeeRole(roleName as EmployeeRoleName)) {
          if (existingEmployeeRole) {
            existingEmployeeRole.employeeRoles.push(
              roleName as EmployeeRoleName,
            )
          } else {
            formattedRoles.push({
              userRole: employeeRole.name,
              employeeRoles: [roleName as EmployeeRoleName],
              salesRoles: [],
              trainerRoles: defaultTrainerRoles,
            })
          }
        } else if (isSalesRole(roleName as RoleName)) {
          if (existingEmployeeRole) {
            if (!existingEmployeeRole.employeeRoles.includes('sales')) {
              existingEmployeeRole.employeeRoles.push('sales')
            }
            existingEmployeeRole.salesRoles.push(roleName as RoleName)
          } else {
            formattedRoles.push({
              userRole: employeeRole.name,
              employeeRoles: [salesRole.name],
              salesRoles: [roleName as RoleName],
              trainerRoles: defaultTrainerRoles,
            })
          }
        } else if (userRolesNames.includes(roleName as UserRoleName)) {
          formattedRoles.push({
            userRole: roleName as UserRoleName,
            employeeRoles: [],
            salesRoles: [],
            trainerRoles: defaultTrainerRoles,
          })
        }
      })

      if (
        !formattedRoles.length &&
        profile.roles.some(r => userSubRoles.includes(r.role.name as RoleName))
      ) {
        formattedRoles.push({
          userRole: RoleName.USER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: defaultTrainerRoles,
        })
      }

      setValue('roles', formattedRoles)
    } else {
      setValue('roles', [
        {
          userRole: RoleName.USER,
          employeeRoles: [],
          salesRoles: [],
          trainerRoles: defaultTrainerRoles,
        },
      ])
    }
  }
}

export const ratherNotSayText = t<string>('rather-not-say')
export function getDisabilitiesValue({
  disabilities,
  ratherNotSaySpecificText,
}: {
  disabilities?: string | null
  // dummy, for unit tests
  ratherNotSaySpecificText?: string | null
}) {
  if (!disabilities) return DisabilitiesRadioValues.NO
  if (
    disabilities === ratherNotSayText ||
    disabilities === ratherNotSaySpecificText
  )
    return DisabilitiesRadioValues.RATHER_NOT_SAY
  return DisabilitiesRadioValues.YES
}

export function getDietaryRestrictionsValue({
  restrictions,
}: {
  restrictions?: string | null
}): DietaryRestrictionRadioValues {
  if (restrictions) return DietaryRestrictionRadioValues.YES
  return DietaryRestrictionRadioValues.NO
}

export type EditProfileInputs = InferType<
  ReturnType<typeof editProfileFormSchema>
>

export const navigateBackPath = (orgId: string | null) =>
  orgId ? `../?orgId=${orgId}` : '..'
