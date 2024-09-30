import { RefObject, Dispatch, SetStateAction, FC } from 'react'
import { UseFormTrigger, FormState, UseFormReset } from 'react-hook-form'

import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { CourseInput } from '@app/types'

import { AnzCourseForm } from './ANZ'
import { UkCourseForm } from './UK'

export type DisabledFields = Partial<keyof CourseInput>

export interface Props {
  type?: Course_Type_Enum
  courseInput?: CourseInput
  disabledFields?: Set<DisabledFields>
  isCreation?: boolean
  onChange?: (input: { data?: CourseInput; isValid?: boolean }) => void
  methodsRef?: RefObject<{
    trigger: UseFormTrigger<CourseInput>
    formState: FormState<CourseInput>
    reset: UseFormReset<CourseInput>
  }>
  trainerRatioNotMet?: boolean
  allowCourseEditWithoutScheduledPrice?: Dispatch<SetStateAction<boolean>>
  currentNumberOfParticipantsAndInvitees?: number
}

export const CourseForm: FC<Props> = props => {
  const {
    acl: { isAustralia },
  } = useAuth()

  if (isAustralia()) {
    return <AnzCourseForm {...props} />
  }
  return <UkCourseForm {...props} />
}
