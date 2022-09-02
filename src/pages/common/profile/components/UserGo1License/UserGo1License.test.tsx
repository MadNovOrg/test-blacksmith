import { addYears } from 'date-fns'
import React from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'

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

jest.mock('@app/hooks/use-fetcher')
const useFetcherMock = jest.mocked(useFetcher)

describe('component: UserGo1License', () => {
  it('displays Go1 license information', () => {
    const go1License = buildGo1License()

    render(<UserGo1License license={go1License} editable={false} />)

    expect(screen.getByTestId('enrolled-on').textContent).toMatchInlineSnapshot(
      `"Enrolled on 1 Aug 2022"`
    )

    expect(screen.getByTestId('expires-in').textContent).toMatchInlineSnapshot(
      `" Active until 1 Aug 2023 (expires in 11 months)."`
    )

    expect(screen.queryByText('Remove')).not.toBeInTheDocument()
  })

  it('deletes Go1 license when clicked on remove button', async () => {
    const LICENSE_ID = 'license-id'
    const handleDeletedMock = jest.fn()
    const fetcherMock = jest.fn()

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

    userEvent.click(screen.getByText('Remove'))

    await waitFor(() => {
      expect(handleDeletedMock).toHaveBeenCalledTimes(1)
    })
  })

  it('displays a message if there is an error deleting the license', async () => {
    const LICENSE_ID = 'license-id'
    const handleDeletedMock = jest.fn()
    const fetcherMock = jest.fn()

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

    userEvent.click(screen.getByText('Remove'))

    await waitFor(() => {
      expect(handleDeletedMock).not.toHaveBeenCalled()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
