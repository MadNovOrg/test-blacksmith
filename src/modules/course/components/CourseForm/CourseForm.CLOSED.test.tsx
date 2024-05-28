import { t } from 'i18next'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import {
  CoursePriceQuery,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  GetCoursesSourcesQuery,
} from '@app/generated/graphql'
import { COURSE_PRICE_QUERY } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import { GET_COURSE_SOURCES_QUERY } from '@app/queries/courses/get-course-sources'
import { CourseInput, RoleName } from '@app/types'

import { chance, render, screen, userEvent, waitFor } from '@test/index'

import { renderForm, selectDelivery, selectLevel } from './test-utils'

import { CourseForm } from '.'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
}))

const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

describe('component: CourseForm - CLOSED', () => {
  const type = Course_Type_Enum.Closed

  // Delivery
  it('allows CLOSED+LEVEL_1 to be F2F, VIRTUAL or MIXED', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeEnabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts CLOSED+LEVEL_2 to be F2F or MIXED', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts CLOSED+ADVANCED to be F2F', async () => {
    await waitFor(() =>
      renderForm(type, Course_Level_Enum.IntermediateTrainer, RoleName.TT_ADMIN)
    )

    await selectLevel(Course_Level_Enum.Advanced)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts CLOSED+INTERMEDIATE_TRAINER to be F2F', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.IntermediateTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts CLOSED+ADVANCED_TRAINER to be F2F', async () => {
    await waitFor(() => renderForm(type, Course_Level_Enum.AdvancedTrainer))

    await selectLevel(Course_Level_Enum.AdvancedTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  // Blended
  it('allows CLOSED+LEVEL_1+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('restricts CLOSED+LEVEL_1+MIXED to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+VIRTUAL to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+MIXED to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('restricts CLOSED+ADVANCED+F2F to be Blended', async () => {
    await waitFor(() =>
      renderForm(type, Course_Level_Enum.IntermediateTrainer, RoleName.TT_ADMIN)
    )

    await selectLevel(Course_Level_Enum.Advanced)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts CLOSED+INTERMEDIATE_TRAINER+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.IntermediateTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts CLOSED+ADVANCED_TRAINER+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type, Course_Level_Enum.AdvancedTrainer))

    await selectLevel(Course_Level_Enum.AdvancedTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  // Reaccreditation
  it('allows CLOSED+LEVEL_1+F2F to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+MIXED to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+VIRTUAL to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+F2F to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+MIXED to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+INTERMEDIATE_TRAINER+F2F to be Reaccreditation but not Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.IntermediateTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+ADVANCED_TRAINER+F2F to be Reaccreditation but not Blended', async () => {
    await waitFor(() => renderForm(type, Course_Level_Enum.AdvancedTrainer))

    await selectLevel(Course_Level_Enum.AdvancedTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('displays price field for a Level two blended closed course that has 8 or less participants', async () => {
    await waitFor(() =>
      renderForm(type, Course_Level_Enum.IntermediateTrainer, RoleName.TT_ADMIN)
    )

    await selectLevel(Course_Level_Enum.Level_2)
    await userEvent.type(screen.getByLabelText(/number of attendees/i), '8')
    await userEvent.click(screen.getByLabelText(/blended learning/i))

    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument()
  })

  // skip for now - will sort it out in a different ticket - TTHP-3769
  it.skip('prepopulates price field a Level two blended closed course that has 8 or less participants', async () => {
    const pricePerAttendee = 100

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_SOURCES_QUERY) {
          console.log('SOURCESSSS')
          return fromValue<{ data: GetCoursesSourcesQuery }>({
            data: {
              sources: [
                {
                  name: chance.name(),
                },
              ],
            },
          })
        }

        if (query === COURSE_PRICE_QUERY) {
          console.log('enters heree')
          return fromValue<{ data: CoursePriceQuery }>({
            data: {
              coursePrice: [
                {
                  level: Course_Level_Enum.Level_2,
                  type: Course_Type_Enum.Closed,
                  blended: true,
                  reaccreditation: false,
                  pricingSchedules: [
                    {
                      priceAmount: pricePerAttendee,
                      priceCurrency: 'GBP',
                    },
                  ],
                },
              ],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <CourseForm courseInput={{} as CourseInput} type={type} />
      </Provider>,
      {
        auth: {
          activeCertificates: [Course_Level_Enum.Level_2],
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    await selectLevel(Course_Level_Enum.Level_2)
    await userEvent.type(screen.getByLabelText(/number of attendees/i), '8')
    await userEvent.click(screen.getByTestId('blendedLearning-switch'))

    const priceField = screen.getByPlaceholderText(/price/i)

    expect(priceField).toHaveValue(pricePerAttendee)

    await userEvent.clear(priceField)

    expect(
      screen.getByText(/price per attendee must be a positive number/i)
    ).toBeInTheDocument()
  })

  it('allows changing the residing country', async () => {
    useFeatureFlagEnabledMock.mockImplementation(
      (flag: string) => flag === 'course-residing-country'
    )
    renderForm(type)

    expect(
      screen.getByLabelText(t('components.course-form.residing-country'))
    ).toBeInTheDocument()
  })
})
