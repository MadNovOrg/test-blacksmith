import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { OrgLicensesWithHistoryQuery } from '@app/generated/graphql'
import { CourseType, ValidCourseInput } from '@app/types'

import { render, screen, userEvent, waitFor } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import { CreateCourseProvider, useCreateCourse } from '../CreateCourseProvider'

import { LicenseOrderDetails } from '.'

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

const CreateCourseContextConsumer: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { go1Licensing } = useCreateCourse()

  return (
    <>
      {go1Licensing?.prices.amountDue ? <p>Prices are saved!</p> : null}
      {go1Licensing?.invoiceDetails.orgId ? (
        <p>Invoice details are saved!</p>
      ) : null}
    </>
  )
}

describe('component: LicenseOrderDetails', () => {
  it('displays an alert if there is no course data in the context', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <CreateCourseProvider courseType={CourseType.INDIRECT}>
          <LicenseOrderDetails />
        </CreateCourseProvider>
      </Provider>
    )

    expect(
      screen.getByTestId('license-order-details-not-found').textContent
    ).toMatchInlineSnapshot(`"Course not found"`)
  })

  it('displays an alert if there is no organization with provided ID', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: OrgLicensesWithHistoryQuery }>({
          data: {
            organization_by_pk: null,
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <CreateCourseProvider
          courseType={CourseType.INDIRECT}
          initialValue={{
            courseData: {
              organization: { id: 'org-id' },
            } as unknown as ValidCourseInput,
          }}
        >
          <LicenseOrderDetails />
        </CreateCourseProvider>
      </Provider>
    )

    expect(
      screen.getByTestId('license-order-details-not-found').textContent
    ).toMatchInlineSnapshot(`"Course not found"`)
  })

  it('displays order details pricing', () => {
    const client = {
      executeQuery: () =>
        fromValue({
          data: {
            organization_by_pk: buildOrganization({
              overrides: { go1Licenses: 5 },
            }),
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <CreateCourseProvider
          courseType={CourseType.INDIRECT}
          initialValue={{
            courseData: {
              maxParticipants: 10,
              organization: { id: 'org-id' },
            } as unknown as ValidCourseInput,
          }}
        >
          <LicenseOrderDetails />
        </CreateCourseProvider>
      </Provider>
    )

    expect(screen.getByTestId('amount-due')).toBeInTheDocument()
  })

  /**
   * TODO Shamelessly ignore this test.
   * Come back to this test separately
   * @author Alexei.Gaidulean <alexei.gaidulean@teamteach.co.uk>
   */
  test.skip
  it.skip('validates invoice form', async () => {
    const client = {
      executeQuery: () =>
        fromValue({
          data: {
            organization_by_pk: buildOrganization({
              overrides: { go1Licenses: 5 },
            }),
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <CreateCourseProvider
          courseType={CourseType.INDIRECT}
          initialValue={{
            courseData: {
              maxParticipants: 10,
              organization: { id: 'org-id' },
            } as unknown as ValidCourseInput,
          }}
        >
          <LicenseOrderDetails />
        </CreateCourseProvider>
      </Provider>
    )

    expect(screen.getByText('Review & confirm')).toBeDisabled()

    await userEvent.type(screen.getByTestId('org-selector'), 'Organization')
    await userEvent.type(screen.getByLabelText('First Name *'), 'John')
    await userEvent.type(screen.getByLabelText('Surname *'), 'Doe')
    await userEvent.type(
      screen.getByLabelText('Email *'),
      'john.doe@example.com'
    )
    await userEvent.type(screen.getByLabelText('Phone *'), '1234567890', {
      delay: 100,
    })

    await waitFor(() => {
      expect(screen.getByText('Review & confirm')).toBeEnabled()
    })
  })

  it('saves into context and navigates to the review step when submitted', async () => {
    const client = {
      executeQuery: () =>
        fromValue({
          data: {
            organization_by_pk: buildOrganization({
              overrides: { go1Licenses: 5 },
            }),
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
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
            <Route
              path="/license-order-details"
              element={<LicenseOrderDetails />}
            />
            <Route
              path="/review-license-order"
              element={<CreateCourseContextConsumer />}
            />
          </Routes>
        </CreateCourseProvider>
      </Provider>,
      {},
      { initialEntries: ['/license-order-details'] }
    )

    await userEvent.type(screen.getByTestId('org-selector'), 'Organization')
    await userEvent.type(screen.getByLabelText('First Name *'), 'John')
    await userEvent.type(screen.getByLabelText('Surname *'), 'Doe')
    await userEvent.type(
      screen.getByLabelText('Email *'),
      'john.doe@example.com'
    )
    await userEvent.type(screen.getByLabelText('Phone *'), '1234567890')

    await waitFor(
      () => {
        expect(screen.getByLabelText('Phone *')).toHaveValue('1234 567890')
        expect(screen.getByText('Review & confirm')).toBeEnabled()
      },
      {
        timeout: 2000,
        interval: 300,
      }
    )

    await userEvent.click(screen.getByText('Review & confirm'))

    await waitFor(() => {
      expect(screen.getByText('Prices are saved!')).toBeInTheDocument()
      expect(screen.getByText('Invoice details are saved!')).toBeInTheDocument()
    })
  })
})
