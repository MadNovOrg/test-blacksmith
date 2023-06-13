import { t } from 'i18next'

import video from './assets/flower.webm'
import image from './assets/preview.png'

export default [
  {
    id: 'create-new-course',
    image,
    video,
    title: t('getting-started-item.create-new-course.title'),
    description: t('getting-started-item.create-new-course.description'),
    steps: [
      t('getting-started-item.step-1'),
      t('getting-started-item.step-2'),
      t('getting-started-item.step-3'),
      t('getting-started-item.step-4'),
      t('getting-started-item.step-5'),
    ],
  },
  {
    id: 'edit-special-instructions',
    image,
    video,
    title: t('getting-started-item.edit-special-instructions.title'),
    description: t(
      'getting-started-item.edit-special-instructions.description'
    ),
    steps: [
      t('getting-started-item.step-1'),
      t('getting-started-item.step-2'),
      t('getting-started-item.step-3'),
      t('getting-started-item.step-4'),
      t('getting-started-item.step-5'),
    ],
  },
  {
    id: 'invite-attendee',
    image,
    video,
    title: t('getting-started-item.invite-attendee.title'),
    description: t('getting-started-item.invite-attendee.description'),
    steps: [
      t('getting-started-item.step-1'),
      t('getting-started-item.step-2'),
      t('getting-started-item.step-3'),
      t('getting-started-item.step-4'),
      t('getting-started-item.step-5'),
    ],
  },
]
