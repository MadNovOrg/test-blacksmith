import { addYears, differenceInCalendarMonths, format } from 'date-fns'
import React from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'
import { dateFormats } from '@app/i18n/config'

import { chance, render, screen, userEvent, waitFor } from '@test/index'

import { Go1LicenseInfo, UserGo1License } from '.'

function buildGo1License(overrides?: Partial<Go1LicenseInfo>): Go1LicenseInfo {
  const baseDate = new Date(2022, 7, 1)

  return {
    id: chance.guid(),
    expireDate: addYears(baseDate, 1),
    enrolledOn: baseDate,
    ...overrides,
  }
}

vi.mock('@app/hooks/use-fetcher')
const useFetcherMock = vi.mocked(useFetcher)

describe('component: UserGo1License', () => {
  it('displays Go1 license information', () => {
    const enrolledDate = new Date()
    const expiresDate = addYears(enrolledDate, 1)

    const go1License = buildGo1License({
      enrolledOn: enrolledDate,
      expireDate: expiresDate,
    })

    render(<UserGo1License license={go1License} editable={false} />)

    expect(screen.getByTestId('enrolled-on')).toHaveTextContent(
      `Enrolled on ${format(enrolledDate, dateFormats.date_defaultShort)}`
    )

    expect(screen.getByTestId('expires-in')).toHaveTextContent(
      `Active until ${format(
        expiresDate,
        dateFormats.date_defaultShort
      )} (expires in ${differenceInCalendarMonths(
        expiresDate,
        new Date()
      )} months).`
    )

    expect(screen.queryByText('Remove')).not.toBeInTheDocument()
  })

  it('deletes Go1 license when clicked on remove button', async () => {
    const LICENSE_ID = 'license-id'
    const handleDeletedMock = vi.fn()
    const fetcherMock = vi.fn()

    useFetcherMock.mockReturnValue(fetcherMock)
    fetcherMock.mockResolvedValue({
      delete_go1_licenses_by_pk: {
        id: LICENSE_ID,
      },
    })

    const go1License = buildGo1License({ id: LICENSE_ID })

    render(
      <UserGo1License
        license={go1License}
        editable
        onDeleted={handleDeletedMock}
      />
    )

    await userEvent.click(screen.getByText('Remove'))

    await waitFor(() => {
      expect(handleDeletedMock).toHaveBeenCalledTimes(1)
    })
  })

  it('displays a message if there is an error deleting the license', async () => {
    const LICENSE_ID = 'license-id'
    const handleDeletedMock = vi.fn()
    const fetcherMock = vi.fn()

    useFetcherMock.mockReturnValue(fetcherMock)
    fetcherMock.mockRejectedValue(new Error())

    const go1License = buildGo1License({ id: LICENSE_ID })

    render(
      <UserGo1License
        license={go1License}
        editable
        onDeleted={handleDeletedMock}
      />
    )

    await userEvent.click(screen.getByText('Remove'))

    await waitFor(() => {
      expect(handleDeletedMock).not.toHaveBeenCalled()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
