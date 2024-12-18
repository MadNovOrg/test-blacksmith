import { useAuth } from '@app/context/auth'
import { Course, CourseParticipant } from '@app/types'

import { VariantMinimal } from './variants'
import { VariantComplete as ANZVariantComplete } from './variants/VariantComplete/ANZ'
import { VariantComplete as UKVariantComplete } from './variants/VariantComplete/UK'

export type CancelAttendeeDialogVariant = 'minimal' | 'complete'

export type CancelAttendeeDialogProps = {
  participant: CourseParticipant
  course: Course
  variant?: CancelAttendeeDialogVariant
  onClose: () => void
  onSave: () => void
}

export const CancelAttendeeDialog = ({
  variant,
  participant,
  course,
  onClose,
  onSave,
}: CancelAttendeeDialogProps) => {
  const { acl } = useAuth()
  switch (variant) {
    case 'minimal':
      return (
        <VariantMinimal
          participant={participant}
          course={course}
          onClose={onClose}
          onSubmit={onSave}
        />
      )
    case 'complete':
    default:
      return acl.isUK() ? (
        <UKVariantComplete
          participant={participant}
          course={course}
          onClose={onClose}
          onSubmit={onSave}
        />
      ) : (
        <ANZVariantComplete
          participant={participant}
          course={course}
          onClose={onClose}
          onSubmit={onSave}
        />
      )
  }
}
