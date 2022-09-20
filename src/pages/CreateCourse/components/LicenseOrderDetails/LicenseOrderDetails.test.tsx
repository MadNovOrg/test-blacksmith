import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import { OrgLicensesWithHistoryQuery } from '@app/generated/graphql'
import { CourseType, ValidCourseInput } from '@app/types'

import { render, screen, userEvent, waitFor } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import { CreateCourseProvider, useCreateCourse } from '../CreateCourseProvider'

import { LicenseOrderDetails } from '.'

jest.mock('@app/components/OrgSelector', () => ({
  OrgSelector: jest.fn(({ onChange }) => {
    return (
      <input
        name="org-selector"
        data-testid="org-selector"
        onChange={() => onChange({ id: 'org-id' })}
      />
    )
  }),
}))

jest.mock('@app/hooks/useCourseDraft', () => ({
  useCourseDraft: jest
    .fn()
    .mockReturnValue({ removeDraft: jest.fn(), setDraft: jest.fn() }),
}))

const CreateCourseContextConsumer: React.FC = () => {
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
      <MemoryRouter>
        <Provider value={client as unknown as Client}>
          <CreateCourseProvider courseType={CourseType.INDIRECT}>
            <LicenseOrderDetails />
          </CreateCourseProvider>
        </Provider>
      </MemoryRouter>
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
      <MemoryRouter>
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
      </MemoryRouter>
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
      <MemoryRouter>
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
      </MemoryRouter>
    )

    expect(screen.getByTestId('amount-due')).toBeInTheDocument()
  })

  it('validates invoice form', async () => {
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
      <MemoryRouter>
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
      </MemoryRouter>
    )

    expect(screen.getByText('Review & confirm')).toBeDisabled()

    userEvent.type(screen.getByTestId('org-selector'), 'Organization')
    userEvent.type(screen.getByLabelText('First Name *'), 'John')
    userEvent.type(screen.getByLabelText('Surname *'), 'Doe')
    userEvent.type(screen.getByLabelText('Email *'), 'john.doe@example.com')
    userEvent.type(screen.getByLabelText('Phone *'), '11111111')

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
      <MemoryRouter initialEntries={['/license-order-details']}>
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
        </Provider>
      </MemoryRouter>
    )

    userEvent.type(screen.getByTestId('org-selector'), 'Organization')
    userEvent.type(screen.getByLabelText('First Name *'), 'John')
    userEvent.type(screen.getByLabelText('Surname *'), 'Doe')
    userEvent.type(screen.getByLabelText('Email *'), 'john.doe@example.com')
    userEvent.type(screen.getByLabelText('Phone *'), '11111111')

    await waitFor(() => {
      userEvent.click(screen.getByText('Review & confirm'))
    })

    await waitFor(() => {
      expect(screen.getByText('Prices are saved!'))
      expect(screen.getByText('Invoice details are saved!'))
    })
  })
})
