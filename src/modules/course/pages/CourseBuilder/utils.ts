import i18next from 'i18next'

export const getBackButtonForBuilderPage = ({
  editMode,
  existsCourse,
  isInternalUser,
}: {
  editMode: boolean
  existsCourse: boolean
  isInternalUser: boolean
}) => {
  if (isInternalUser) {
    return {
      label: i18next.t('pages.course-participants.back-button'),
      to: '/manage-courses/all',
    }
  }

  if (!existsCourse || editMode) {
    return {
      label: i18next.t('Back'),
      to: undefined,
    }
  }

  return {
    label: i18next.t('pages.course-participants.back-button'),
    to: '/courses',
  }
}
