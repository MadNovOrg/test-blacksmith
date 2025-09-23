import { addDays, format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  GetCertificateQuery,
  InsertCourseCertificateChangelogMutation,
} from '@app/generated/graphql'
import { NonNullish } from '@app/types'

import { _render, renderHook, screen, userEvent } from '@test/index'

import { CertificateChangelog } from '../../pages/CourseCertification/types'

import PutOnHoldModal, { HoldReasons } from './PutOnHoldModal'

describe(PutOnHoldModal.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('should _render', () => {
    _render(
      <PutOnHoldModal
        participantId={''}
        certificateId={''}
        certificateExpiryDate={''}
        edit={false}
        changelogs={[]}
        onClose={vi.fn()}
        refetch={vi.fn()}
      />,
    )
    expect(screen.getByText(t('common.reason')))
  })
  it('should _render all fields and buttons', () => {
    _render(
      <PutOnHoldModal
        participantId={''}
        certificateId={''}
        certificateExpiryDate={''}
        edit={false}
        changelogs={[]}
        onClose={vi.fn()}
        refetch={vi.fn()}
      />,
    )
    expect(screen.getByText(t('common.reason'))).toBeInTheDocument()
    expect(
      screen.getByText(t('common.course-certificate.put-on-hold-modal.notes')),
    ).toBeInTheDocument()
    expect(screen.getByText(t('common.from'))).toBeInTheDocument()
    expect(screen.getByText(t('common.to'))).toBeInTheDocument()
  })
  it('should validate fields upon submission', async () => {
    _render(
      <PutOnHoldModal
        participantId={''}
        certificateId={''}
        certificateExpiryDate={''}
        edit={false}
        changelogs={[]}
        onClose={vi.fn()}
        refetch={vi.fn()}
      />,
    )
    const submitButton = screen.getByTestId('submit-on-hold')
    await userEvent.click(submitButton)
    expect(
      screen.getAllByText(t('validation-errors.required-date')),
    ).toHaveLength(2)
    expect(
      screen.getByText(
        t('common.course-certificate.put-on-hold-modal.select-reason-error'),
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        t('common.course-certificate.put-on-hold-modal.note-error'),
      ),
    ).toBeInTheDocument()
  })
  it('should close modal', async () => {
    const onClose = vi.fn()
    _render(
      <PutOnHoldModal
        participantId={''}
        certificateId={''}
        certificateExpiryDate={''}
        edit={false}
        changelogs={[]}
        onClose={onClose}
        refetch={vi.fn()}
      />,
    )
    const cancelButton = screen.getByText(t('common.cancel'))
    await userEvent.click(cancelButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
  it('should prefill fields when edit is true', () => {
    const startDate = addDays(new Date(), 1).toISOString().split('T')[0]
    const endDate = addDays(new Date(), 365).toISOString().split('T')[0]

    const holdRequests = [
      {
        start_date: startDate,
        expiry_date: endDate,
      },
    ] as GetCertificateQuery['certificateHoldRequest'][0][]

    const changelogs = [
      {
        author: 'Test Author',
        payload: {
          reason: 'Test Reason',
          note: 'Test Notes',
          start_date: startDate,
          expiry_date: endDate,
        },
      },
    ] as unknown as NonNullish<CertificateChangelog['certificateChanges']>

    _render(
      <PutOnHoldModal
        participantId={''}
        certificateId={''}
        certificateExpiryDate={''}
        edit={true}
        changelogs={changelogs}
        holdRequest={holdRequests[0]}
        onClose={vi.fn()}
        refetch={vi.fn()}
      />,
    )
    expect(screen.getByDisplayValue('Test Reason')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Notes')).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(format(new Date(startDate), 'dd/MM/yyyy')),
    ).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(format(new Date(endDate), 'dd/MM/yyyy')),
    ).toBeInTheDocument()
  })
  it('should submit and show date amendment modal', async () => {
    const startDate = addDays(new Date(), 1).toISOString().split('T')[0]
    const endDate = addDays(new Date(), 365).toISOString().split('T')[0]

    const holdRequests = [
      {
        start_date: startDate,
        expiry_date: endDate,
      },
    ] as GetCertificateQuery['certificateHoldRequest'][0][]

    const changelogs = [
      {
        author: 'Test Author',
        payload: {
          reason: 'Test Reason',
          note: 'Test Notes',
          start_date: startDate,
          expiry_date: endDate,
        },
      },
    ] as unknown as NonNullish<CertificateChangelog['certificateChanges']>

    _render(
      <PutOnHoldModal
        participantId={''}
        certificateId={''}
        certificateExpiryDate={''}
        edit={true}
        changelogs={changelogs}
        holdRequest={holdRequests[0]}
        onClose={vi.fn()}
        refetch={vi.fn()}
      />,
    )
    const submitButton = screen.getByTestId('submit-on-hold')
    await userEvent.click(submitButton)
    expect(
      screen.getByText(t('common.course-certificate.email-notification')),
    ).toBeInTheDocument()
  })
  it('inserts log when submitting', async () => {
    const startDate = addDays(new Date(), 1).toISOString().split('T')[0]
    const endDate = addDays(new Date(), 365).toISOString().split('T')[0]

    const holdRequests = [
      {
        start_date: startDate,
        expiry_date: endDate,
      },
    ] as GetCertificateQuery['certificateHoldRequest'][0][]

    const changelogs = [
      {
        author: 'Test Author',
        payload: {
          reason: HoldReasons.Maternity,
          note: 'Test Notes',
          start_date: startDate,
          expiry_date: endDate,
        },
      },
    ] as unknown as NonNullish<CertificateChangelog['certificateChanges']>

    const client = {
      executeMutation: vi.fn(() => never),
    }
    client.executeMutation.mockImplementation(() => {
      return fromValue<{ data: InsertCourseCertificateChangelogMutation }>({
        data: {
          insertChangeLog: {
            id: '1',
          },
        },
      })
    })

    _render(
      <Provider value={client as unknown as Client}>
        <PutOnHoldModal
          participantId={''}
          certificateId={''}
          certificateExpiryDate={''}
          edit={true}
          changelogs={changelogs}
          holdRequest={holdRequests[0]}
          onClose={vi.fn()}
          refetch={vi.fn()}
        />
        ,
      </Provider>,
    )
    const submitButton = screen.getByTestId('submit-on-hold')
    await userEvent.click(submitButton)

    const datesConfirmModal = screen.getByText(
      t('common.course-certificate.confirm-dates'),
    )
    await userEvent.click(datesConfirmModal)

    expect(client.executeMutation).toHaveBeenCalledTimes(1)
  })
})
