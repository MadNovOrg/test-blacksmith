import { addYears, differenceInCalendarMonths, format } from 'date-fns'
import { Client, CombinedError, Provider } from 'urql'
import { fromValue } from 'wonka'

import { DeleteGo1LicenseMutation } from '@app/generated/graphql'
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
    const client = {
      executeMutation: vi.fn(),
    }
    client.executeMutation.mockImplementation(() =>
      fromValue<{ data: DeleteGo1LicenseMutation }>({
        data: {
          delete_go1_licenses_by_pk: {
            id: LICENSE_ID,
          },
        },
      })
    )

    const go1License = buildGo1License({ id: LICENSE_ID })

    render(
      <Provider value={client as unknown as Client}>
        <UserGo1License
          license={go1License}
          editable
          onDeleted={handleDeletedMock}
        />
      </Provider>
    )

    await userEvent.click(screen.getByText('Remove'))

    expect(client.executeMutation).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(handleDeletedMock).toHaveBeenCalledTimes(1)
    })
  })
  // TODO: fix this -> the error is not being set
  it.skip('displays a message if there is an error deleting the license', async () => {
    const LICENSE_ID = 'license-id'
    const handleDeletedMock = vi.fn()

    const client = {
      executeMutation: vi.fn(),
    }
    client.executeMutation.mockImplementation(() =>
      fromValue({
        error: new CombinedError({
          networkError: Error('Something went wrong'),
        }),
      })
    )

    const go1License = buildGo1License({ id: LICENSE_ID })

    render(
      <Provider value={client as unknown as Client}>
        <UserGo1License
          license={go1License}
          editable
          onDeleted={handleDeletedMock}
        />
      </Provider>
    )

    await userEvent.click(screen.getByText('Remove'))

    await waitFor(() => {
      expect(handleDeletedMock).not.toHaveBeenCalled()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
