import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import useSWR from 'swr'

import { useFetcher } from '@app/hooks/use-fetcher'
import { PaymentMethod } from '@app/types'

import { render } from '@test/index'

import { CourseBookingDone } from './CourseBookingDone'

jest.mock('swr')
jest.mock('@app/hooks/use-fetcher')

const useFetcherMock = jest.mocked(useFetcher)
const useSWRMock = jest.mocked(useSWR)
const useSWRMockDefaults = {
  data: undefined,
  mutate: jest.fn(),
  isValidating: false,
  error: null,
  isLoading: false,
}

describe('CourseBookingDone', () => {
  const fetcherMock = jest.fn()
  useFetcherMock.mockReturnValue(fetcherMock)

  it('matches snapshot', async () => {
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { order: { paymentMethod: PaymentMethod.INVOICE } },
    })

    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CourseBookingDone />} />
        </Routes>
      </MemoryRouter>
    )

    expect(fetcherMock).toHaveReturnedTimes(1)
    expect(fetcherMock).toHaveBeenCalledWith(expect.any(String), {
      email: 'john.smith@example.com',
    })

    expect(view).toMatchSnapshot()
  })
})
