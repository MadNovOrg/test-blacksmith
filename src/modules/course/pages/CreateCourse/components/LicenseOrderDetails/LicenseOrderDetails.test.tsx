import { useFeatureFlagEnabled } from 'posthog-js/react'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  OrgLicensesWithHistoryQuery,
} from '@app/generated/graphql'
import { ResourcePacksOptions } from '@app/modules/course/components/CourseForm/components/ResourcePacksTypeSection/types'
import { AwsRegions, ValidCourseInput } from '@app/types'

import { fireEvent, render, screen, userEvent, waitFor } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import { CreateCourseProvider, useCreateCourse } from '../CreateCourseProvider'

import { LicenseOrderDetails } from '.'

vi.mock('posthog-js/react')
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

vi.mock('@app/components/OrgSelector/UK', () => ({
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

vi.mock('@app/components/OrgSelector/ANZ', () => ({
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

vi.mock('@app/modules/course/hooks/useCourseDraft', () => ({
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
        <CreateCourseProvider courseType={Course_Type_Enum.Indirect}>
          <LicenseOrderDetails />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('license-order-details-not-found').textContent,
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
          courseType={Course_Type_Enum.Indirect}
          initialValue={{
            courseData: {
              organization: { id: 'org-id' },
            } as unknown as ValidCourseInput,
          }}
        >
          <LicenseOrderDetails />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('license-order-details-not-found').textContent,
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
          courseType={Course_Type_Enum.Indirect}
          initialValue={{
            courseData: {
              maxParticipants: 10,
              organization: { id: 'org-id' },
            } as unknown as ValidCourseInput,
          }}
        >
          <LicenseOrderDetails />
        </CreateCourseProvider>
      </Provider>,
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
      <Provider value={client as unknown as Client}>
        <CreateCourseProvider
          courseType={Course_Type_Enum.Indirect}
          initialValue={{
            courseData: {
              maxParticipants: 10,
              organization: { id: 'org-id' },
            } as unknown as ValidCourseInput,
          }}
        >
          <LicenseOrderDetails />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(screen.getByText('Review & confirm')).toBeDisabled()

    await userEvent.type(screen.getByTestId('org-selector'), 'Organization')
    await userEvent.type(screen.getByLabelText('First Name *'), 'John')
    await userEvent.type(screen.getByLabelText('Surname *'), 'Doe')
    await userEvent.type(
      screen.getByLabelText('Email *'),
      'john.doe@example.com',
    )
    await userEvent.type(screen.getByLabelText('Phone *'), '1234567890', {
      delay: 100,
    })

    await waitFor(() => {
      expect(screen.getByText('Review & confirm')).toBeEnabled()
    })
  })

  it('validates workbook delivery address form', async () => {
    useFeatureFlagEnabledMock.mockReturnValue(true)
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
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
          courseType={Course_Type_Enum.Indirect}
          initialValue={{
            courseData: {
              maxParticipants: 10,
              courseLevel: Course_Level_Enum.Level_1,
              organization: { id: 'org-id' },
              resourcePacksType: ResourcePacksOptions.PrintWorkbookExpress,
              residingCountry: 'AU',
            } as unknown as ValidCourseInput,
          }}
        >
          <LicenseOrderDetails />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(screen.getByText('Review & confirm')).toBeDisabled()
    expect(screen.getByText('Workbooks delivery address')).toBeInTheDocument()
    // Fill Workbook delivery address details
    await userEvent.type(
      screen.getByLabelText('Order Contact Full Name *'),
      'John Doe',
    )
    await userEvent.type(
      screen.queryAllByTestId('org-selector')[0],
      'Organization',
    )
    await userEvent.type(
      screen.getByLabelText('Postal Address Line 1 *'),
      '123 Street',
    )
    await userEvent.type(
      screen.getByLabelText('Postal Address Line 2'),
      'Apt 2',
    )
    await userEvent.type(screen.getByTestId('input-suburb'), 'Suburb')
    await userEvent.type(
      screen.getByLabelText('Postal Address Town/City *'),
      'Sydney',
    )

    const regionSelector = screen.getByLabelText(
      'Postal Address State/Territory',
      {
        exact: false,
      },
    )

    expect(regionSelector).toBeInTheDocument()
    fireEvent.click(regionSelector)
    await userEvent.keyboard('{tab} {enter}')

    // Fill Invoice details
    await userEvent.type(
      screen.queryAllByTestId('org-selector')[1],
      'Organization',
    )
    await userEvent.type(screen.getByLabelText('First Name *'), 'John')
    await userEvent.type(screen.getByLabelText('Surname *'), 'Doe')
    await userEvent.type(
      screen.getByLabelText('Email *'),
      'john.doe@example.com',
    )
    await userEvent.type(screen.getByLabelText('Phone *'), '455555555', {
      delay: 200,
    })

    await waitFor(() => {
      expect(screen.getByText('Review & confirm')).toBeEnabled()
    })
  })

  it('saves into context and navigates to the review step when submitted', async () => {
    useFeatureFlagEnabledMock.mockReturnValue(false)
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
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
          courseType={Course_Type_Enum.Indirect}
          initialValue={{
            courseData: {
              blendedLearning: true,
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
      { initialEntries: ['/license-order-details'] },
    )

    await userEvent.type(screen.getByTestId('org-selector'), 'Organization')
    await userEvent.type(screen.getByLabelText('First Name *'), 'John')
    await userEvent.type(screen.getByLabelText('Surname *'), 'Doe')
    await userEvent.type(
      screen.getByLabelText('Email *'),
      'john.doe@example.com',
    )
    await userEvent.type(screen.getByLabelText('Phone *'), '1234567890')

    await waitFor(
      () => {
        expect(screen.getByText('Review & confirm')).toBeEnabled()
      },
      {
        timeout: 4000,
      },
    )

    await userEvent.click(screen.getByText('Review & confirm'))

    await waitFor(() => {
      expect(screen.getByText('Prices are saved!')).toBeInTheDocument()
      expect(screen.getByText('Invoice details are saved!')).toBeInTheDocument()
    })
  })
})
