import { t } from 'i18next'

import { screen, _render } from '@test/index'

import { CourseFormCheckboxes } from '.'

describe(CourseFormCheckboxes.name, () => {
  const confirmations = [
    t('pages.create-course.form.health-leaflet-copy'),
    t('pages.create-course.form.practice-protocol-copy'),
    t('pages.create-course.form.valid-id-copy'),
    t('pages.create-course.form.needs-analysis-copy'),
    t('pages.create-course.form.connect-fee-notification'),
  ]
  it.each(confirmations)(
    'should _render component with confirmation %s',
    confirmation => {
      _render(
        <CourseFormCheckboxes
          formSubmitted={false}
          courseResidingCountry={'AU'}
          displayConnectFeeCondition={true}
          displayResourcePacksCondition={true}
          isBILDCourse={true}
          handleConsentFlagChanged={vi.fn()}
        />,
      )
      expect(
        screen.getByLabelText(confirmation, { exact: false }),
      ).toBeInTheDocument()

      expect(screen.getByTestId('resourcePacks')).toBeInTheDocument()
    },
  )
})
