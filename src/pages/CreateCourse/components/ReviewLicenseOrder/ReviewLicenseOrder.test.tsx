import { addHours, addMonths, addWeeks, format } from 'date-fns'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import {
  Accreditors_Enum,
  Course_Status_Enum,
  Currency,
  Payment_Methods_Enum,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { dateFormats } from '@app/i18n/config'
import { MUTATION } from '@app/queries/courses/insert-course'
import {
  CourseDeliveryType,
  CourseLevel,
  CourseTrainerType,
  CourseType,
  Draft,
  Organization,
  TrainerInput,
  TrainerRoleTypeName,
} from '@app/types'

import { chance, render, screen, userEvent, waitFor } from '@test/index'
import { profile } from '@test/providers'

import { CreateCourseProvider } from '../CreateCourseProvider'

import { ReviewLicenseOrder } from '.'

jest.mock('@app/hooks/useCourseDraft', () => ({
  useCourseDraft: jest
    .fn()
    .mockReturnValue({ removeDraft: jest.fn(), setDraft: jest.fn() }),
}))

jest.mock('@app/hooks/use-fetcher')
const useFetcherMock = jest.mocked(useFetcher)

function createFetchingClient() {
  return {
    executeQuery: () => never,
  } as unknown as Client
}

describe('component: ReviewLicenseOrder', () => {
  it('displays an alert if there is no course or pricing data in the context', () => {
    render(
      <Provider value={createFetchingClient()}>
        <CreateCourseProvider courseType={CourseType.INDIRECT}>
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
      courseLevel: CourseLevel.Level_1,
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
          courseType={CourseType.INDIRECT}
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

  it('creates a course with the order when clicked on the save button', async () => {
    const startDate = addWeeks(new Date(), 5)
    const endDate = addHours(startDate, 8)
    const trainer: TrainerInput = {
      profile_id: chance.guid(),
      trainer_role_types: [
        { trainer_role_type: { name: TrainerRoleTypeName.PRINCIPAL } },
      ],
      type: CourseTrainerType.Leader,
      levels: [
        {
          courseLevel: CourseLevel.AdvancedTrainer,
          expiryDate: addMonths(new Date(), 6).toISOString(),
        },
      ],
    }

    const courseData: Partial<Draft['courseData']> = {
      accreditedBy: Accreditors_Enum.Icm,
      courseLevel: CourseLevel.Level_1,
      startDateTime: startDate,
      endDateTime: endDate,
      type: CourseType.INDIRECT,
      reaccreditation: false,
      blendedLearning: true,
      maxParticipants: 12,
      deliveryType: CourseDeliveryType.F2F,
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
        firstName: 'John',
        surname: 'Doe',
        phone: 'phone',
        email: 'email',
        purchaseOrder: '1234',
      },
    }

    const fetcherMock = jest.fn()
    fetcherMock.mockResolvedValue({
      insertCourse: { inserted: [{ id: 'course-id' }] },
    })

    useFetcherMock.mockReturnValue(fetcherMock)

    render(
      <Provider value={createFetchingClient()}>
        <CreateCourseProvider
          courseType={CourseType.INDIRECT}
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

      expect(fetcherMock).toHaveBeenCalledTimes(1)

      const [mutation, variables] = fetcherMock.mock.calls[0]
      expect(mutation).toEqual(MUTATION)
      expect(variables).toEqual({
        course: {
          accreditedBy: Accreditors_Enum.Icm,
          bildStrategies: undefined,
          deliveryType: courseData.deliveryType,
          name: expect.any(String),
          level: 'LEVEL_1',
          reaccreditation: courseData.reaccreditation,
          go1Integration: courseData.blendedLearning,
          exceptionsPending: false,
          max_participants: courseData.maxParticipants,
          type: courseData.type,
          organization_id: courseData.organization?.id,
          notes: undefined,
          parking_instructions: undefined,
          special_instruction: undefined,
          status: Course_Status_Enum.TrainerPending,
          trainers: {
            data: [
              {
                type: trainer.type,
                profile_id: trainer.profile_id,
                status: undefined,
              },
            ],
          },
          schedule: {
            data: [
              {
                start: courseData.startDateTime,
                end: courseData.endDateTime,
                venue_id: undefined,
                virtualLink: undefined,
              },
            ],
          },
          orders: {
            data: [
              {
                registrants: [],
                billingEmail: go1Licensing.invoiceDetails.email,
                billingGivenName: go1Licensing.invoiceDetails.firstName,
                billingFamilyName: go1Licensing.invoiceDetails.surname,
                billingPhone: go1Licensing.invoiceDetails.phone,
                organizationId: go1Licensing.invoiceDetails.orgId,
                billingAddress: go1Licensing.invoiceDetails.billingAddress,
                paymentMethod: Payment_Methods_Enum.Invoice,
                quantity: 0,
                currency: Currency.Gbp,
                clientPurchaseOrder: go1Licensing.invoiceDetails.purchaseOrder,
                user: {
                  email: profile?.email,
                  fullName: profile?.fullName,
                  phone: profile?.phone,
                },
              },
            ],
          },
        },
      })
    })
  })
})
