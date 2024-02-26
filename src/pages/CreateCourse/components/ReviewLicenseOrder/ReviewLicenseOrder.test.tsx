import { addHours, addMonths, addWeeks, format } from 'date-fns'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Accreditors_Enum,
  Course_Level_Enum,
  CourseLevel,
  Course_Type_Enum,
  Course_Delivery_Type_Enum,
  Course_Trainer_Type_Enum,
  InsertCourseMutation,
} from '@app/generated/graphql'
import { dateFormats } from '@app/i18n/config'
import {
  Draft,
  Organization,
  TrainerInput,
  TrainerRoleTypeName,
} from '@app/types'

import { chance, render, screen, userEvent, waitFor } from '@test/index'

import { CreateCourseProvider } from '../CreateCourseProvider'

import { ReviewLicenseOrder } from '.'

function createFetchingClient() {
  return {
    executeMutation: () => never,
  } as unknown as Client
}

describe('component: ReviewLicenseOrder', () => {
  it('displays an alert if there is no course or pricing data in the context', () => {
    render(
      <Provider value={createFetchingClient()}>
        <CreateCourseProvider courseType={Course_Type_Enum.Indirect}>
          <ReviewLicenseOrder />
        </CreateCourseProvider>
      </Provider>
    )

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"Course not found"`
    )
  })

  it('displays course summary and pricing information', () => {
    const startDate = new Date()
    const endDate = addHours(startDate, 8)

    const courseData: Partial<Draft['courseData']> = {
      courseLevel: Course_Level_Enum.Level_1,
      startDateTime: startDate,
      endDateTime: endDate,
      maxParticipants: 2,
    }

    const go1Licensing: Draft['go1Licensing'] = {
      prices: {
        subtotal: 200,
        vat: 20,
        amountDue: 220,
        allowancePrice: 0,
      },
      invoiceDetails: {
        billingAddress: chance.address(),
        orgId: 'org-id',
        orgName: chance.name(),
        firstName: chance.first(),
        surname: chance.last(),
        phone: chance.phone(),
        email: chance.phone(),
        purchaseOrder: '',
      },
    }

    render(
      <Provider value={createFetchingClient()}>
        <CreateCourseProvider
          courseType={Course_Type_Enum.Indirect}
          initialValue={{ courseData, go1Licensing } as Draft}
        >
          <ReviewLicenseOrder />
        </CreateCourseProvider>
      </Provider>
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    expect(
      screen.getByText(/blended learning - level one/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        `${format(startDate, dateFormats.date_long)} - ${format(
          endDate,
          dateFormats.date_long
        )}`
      )
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        `${format(startDate, dateFormats.date_onlyTime)} - ${format(
          endDate,
          dateFormats.date_onlyTime
        )}`
      )
    ).toBeInTheDocument()

    expect(
      screen.getByText(go1Licensing.invoiceDetails.billingAddress)
    ).toBeInTheDocument()
    expect(
      screen.getByText(go1Licensing.invoiceDetails.email)
    ).toBeInTheDocument()
    expect(
      screen.getByText(go1Licensing.invoiceDetails.firstName)
    ).toBeInTheDocument()
    expect(
      screen.getByText(go1Licensing.invoiceDetails.surname)
    ).toBeInTheDocument()
    expect(
      screen.getByText(go1Licensing.invoiceDetails.phone)
    ).toBeInTheDocument()
  })
  // TODO: Fix this test as right now it fails after migrating useSaveCourse to urql
  it.skip('creates a course with the order when clicked on the save button', async () => {
    const startDate = addWeeks(new Date(), 5)
    const endDate = addHours(startDate, 8)
    const residingCountry = chance.country()
    const trainer: TrainerInput = {
      profile_id: chance.guid(),
      trainer_role_types: [
        { trainer_role_type: { name: TrainerRoleTypeName.PRINCIPAL } },
      ],
      type: Course_Trainer_Type_Enum.Leader,
      levels: [
        {
          courseLevel:
            Course_Level_Enum.AdvancedTrainer as unknown as CourseLevel,
          expiryDate: addMonths(new Date(), 6).toISOString(),
        },
      ],
    }

    const courseData: Partial<Draft['courseData']> = {
      accreditedBy: Accreditors_Enum.Icm,
      courseLevel: Course_Level_Enum.Level_1,
      startDateTime: startDate,
      endDateTime: endDate,
      type: Course_Type_Enum.Indirect,
      reaccreditation: false,
      blendedLearning: true,
      maxParticipants: 12,
      residingCountry,
      deliveryType: Course_Delivery_Type_Enum.F2F,
      organization: {
        id: 'org-id',
      } as Organization,
    }

    const go1Licensing: Draft['go1Licensing'] = {
      prices: {
        subtotal: 200,
        vat: 20,
        amountDue: 220,
        allowancePrice: 0,
      },
      invoiceDetails: {
        billingAddress: 'Billing address',
        orgId: 'org-id',
        orgName: chance.name(),
        firstName: 'John',
        surname: 'Doe',
        phone: 'phone',
        email: 'email',
        purchaseOrder: '1234',
      },
    }
    const client = {
      useMutation: vi.fn(),
    }
    client.useMutation.mockImplementation(() => {
      fromValue<{ data: InsertCourseMutation }>({
        data: {
          insertCourse: {
            inserted: [
              {
                id: 1,
                orders: [],
                expenses: [],
              },
            ],
            affectedRows: 1,
          },
        },
      })
    })
    render(
      <Provider value={client as unknown as Client}>
        <CreateCourseProvider
          courseType={Course_Type_Enum.Indirect}
          initialValue={
            {
              courseData,
              go1Licensing,
              trainers: [trainer],
            } as Draft
          }
        >
          <Routes>
            <Route path="/" element={<ReviewLicenseOrder />} />
            <Route path="/courses/:id/modules" element={<p>Modules page</p>} />
          </Routes>
        </CreateCourseProvider>
      </Provider>
    )
    await userEvent.click(screen.getByText(/course builder/i))

    await waitFor(() => {
      expect(screen.getByText(/modules page/i)).toBeInTheDocument()
    })
  })
})
