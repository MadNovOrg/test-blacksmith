import { addHours } from 'date-fns'
import { DocumentNode } from 'graphql'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Level_Enum,
  Accreditors_Enum,
  CoursePriceQuery,
  GetBildStrategiesQuery,
} from '@app/generated/graphql'
import { COURSE_PRICE_QUERY } from '@app/hooks/useCoursePrice'
import { QUERY as BILD_STRATEGIES_QUERY } from '@app/queries/bild/get-bild-strategies'
import { BildStrategies, CourseType, ValidCourseInput } from '@app/types'

import { chance, render, screen, userEvent, waitFor } from '@test/index'

import { CreateCourseProvider, useCreateCourse } from '../CreateCourseProvider'

import { OrderDetails } from '.'

const CreateCourseContextConsumer: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { invoiceDetails } = useCreateCourse()

  return <>{invoiceDetails?.orgId ? <p>Invoice details are saved!</p> : null}</>
}

vi.mock('@app/components/OrgSelector', () => ({
  OrgSelector: vi.fn(({ onChange }) => {
    return (
      <input
        name="org-selector"
        data-testid="org-selector"
        onChange={() => onChange({ id: 'org-id' })}
      />
    )
  }),
}))

vi.mock('@app/hooks/useCourseDraft', () => ({
  useCourseDraft: vi
    .fn()
    .mockReturnValue({ removeDraft: vi.fn(), setDraft: vi.fn() }),
}))

describe('component: OrderDetails', () => {
  it('displays course details, and pricing with trainer expenses for an ICM course', async () => {
    const courseDate = new Date(1, 1, 2023)

    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [{ priceAmount: 100, priceCurrency: 'GBP' }],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <CreateCourseProvider
          courseType={CourseType.CLOSED}
          initialValue={{
            courseData: {
              maxParticipants: 10,
              organization: { id: 'org-id' },
              minParticipants: 10,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 0,
            } as unknown as ValidCourseInput,
          }}
        >
          <OrderDetails />
        </CreateCourseProvider>
      </Provider>
    )

    expect(
      screen.getByTestId('course-title-duration').textContent
    ).toMatchInlineSnapshot(
      `"Positive Behaviour Training: Level One  - 8 hours"`
    )

    expect(
      screen.getByTestId('course-price-row').textContent
    ).toMatchInlineSnapshot(`"Course Cost£1,000.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent
    ).toMatchInlineSnapshot(`"Sub total£1,000.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"VAT (20%)£200.00"`
    )

    expect(
      screen.getByTestId('total-costs-row').textContent
    ).toMatchInlineSnapshot(`"Amount due (GBP)£1,200.00"`)
  })

  it('displays course details, and pricing with trainer expenses for a BILD course', async () => {
    const courseDate = new Date(1, 1, 2023)

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === BILD_STRATEGIES_QUERY) {
          return fromValue<{ data: GetBildStrategiesQuery }>({
            data: {
              strategies: [
                {
                  id: chance.guid(),
                  name: BildStrategies.Primary,
                  shortName: 'P',
                  modules: {},
                },
                {
                  id: chance.guid(),
                  name: BildStrategies.Secondary,
                  shortName: 'S',
                  modules: {},
                },
              ],
            },
          })
        }

        if (query === COURSE_PRICE_QUERY) {
          return fromValue<{ data: CoursePriceQuery }>({
            data: {
              coursePrice: [],
            },
          })
        }

        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <CreateCourseProvider
          courseType={CourseType.CLOSED}
          initialValue={{
            courseData: {
              accreditedBy: Accreditors_Enum.Bild,
              bildStrategies: {
                PRIMARY: true,
                SECONDARY: true,
              },
              maxParticipants: 10,
              organization: { id: 'org-id' },
              minParticipants: 10,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 0,
              price: 200,
            } as unknown as ValidCourseInput,
          }}
        >
          <OrderDetails />
        </CreateCourseProvider>
      </Provider>
    )

    expect(
      screen.getByTestId('course-title-duration').textContent
    ).toMatchInlineSnapshot(`"BILD Certified Course: PS - 8 hours"`)

    expect(
      screen.getByTestId('course-price-row').textContent
    ).toMatchInlineSnapshot(`"Course Cost£2,000.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent
    ).toMatchInlineSnapshot(`"Sub total£2,000.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"VAT (20%)£400.00"`
    )

    expect(
      screen.getByTestId('total-costs-row').textContent
    ).toMatchInlineSnapshot(`"Amount due (GBP)£2,400.00"`)
  })

  it('saves invoice details and navigates to order review step when submitted', async () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [{ priceAmount: 100, priceCurrency: 'GBP' }],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <CreateCourseProvider
          courseType={CourseType.INDIRECT}
          initialValue={{
            courseData: {
              maxParticipants: 10,
              organization: { id: 'org-id' },
            } as unknown as ValidCourseInput,
          }}
        >
          <Routes>
            <Route path="/order-details" element={<OrderDetails />} />
            <Route
              path="/review-and-confirm"
              element={<CreateCourseContextConsumer />}
            />
          </Routes>
        </CreateCourseProvider>
      </Provider>,
      {},
      { initialEntries: ['/order-details'] }
    )
    await userEvent.type(screen.getByTestId('org-selector'), 'Organization')
    await userEvent.type(screen.getByLabelText('First Name *'), 'John')
    await userEvent.type(screen.getByLabelText('Surname *'), 'Doe')
    await userEvent.type(
      screen.getByLabelText('Email *'),
      'john.doe@example.com'
    )
    await userEvent.type(screen.getByLabelText('Phone *'), '1234567890')

    await userEvent.click(screen.getByText('Review & confirm'))

    await waitFor(() => {
      expect(screen.getByText(/invoice details are saved/i)).toBeInTheDocument()
    })
  })
})
