import { Course, CourseParticipant } from '@app/types'

import { VariantMinimal, VariantComplete } from './variants'

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
      return (
        <VariantComplete
          participant={participant}
          course={course}
          onClose={onClose}
          onSubmit={onSave}
        />
      )
  }
}
