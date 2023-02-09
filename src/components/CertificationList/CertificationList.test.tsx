import React from 'react'
import {} from 'react-router-dom'

import { Grade, SortOrder } from '@app/types'

import { render, screen, within, userEvent } from '@test/index'
import { buildCertificate, buildParticipant } from '@test/mock-data-utils'

import {
  CertificationList,
  CertificationListColumns,
} from './CertificationList'

describe('component: CertificationList', () => {
  it('renders default columns', async () => {
    const participants = [buildParticipant()]
    const sorting = {
      by: 'name',
      dir: 'asc' as SortOrder,
      onSort: jest.fn(),
    }

    render(<CertificationList participants={participants} sorting={sorting} />)

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    const tableHead = within(table).getByTestId('table-head')
    expect(tableHead).toBeInTheDocument()
    const columnHeaders = within(tableHead).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(6)
    expect(within(columnHeaders[1]).getByText('Name')).toBeInTheDocument()
    expect(within(columnHeaders[2]).getByText('Contact')).toBeInTheDocument()
    expect(
      within(columnHeaders[3]).getByText('Organisation')
    ).toBeInTheDocument()
    expect(within(columnHeaders[4]).getByText('Grade')).toBeInTheDocument()
  })

  it('can render admin columns and fields', async () => {
    const participant = buildParticipant()
    participant.certificate = buildCertificate()
    participant.grade = Grade.PASS
    const participants = [participant]
    const sorting = {
      by: 'name',
      dir: 'asc' as SortOrder,
      onSort: jest.fn(),
    }
    const columns = [
      'name',
      'certificate',
      'course-code',
      'status',
    ] as CertificationListColumns

    render(
      <CertificationList
        participants={participants}
        sorting={sorting}
        columns={columns}
      />
    )

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    const tableHead = within(table).getByTestId('table-head')
    expect(tableHead).toBeInTheDocument()
    const columnHeaders = within(tableHead).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(6)
    expect(within(columnHeaders[1]).getByText('Name')).toBeInTheDocument()
    expect(
      within(columnHeaders[2]).getByText('Certificate')
    ).toBeInTheDocument()
    expect(
      within(columnHeaders[3]).getByText('Course code')
    ).toBeInTheDocument()
    expect(within(columnHeaders[4]).getByText('Status')).toBeInTheDocument()
    const tableBody = within(table).getByTestId('table-body')
    expect(tableBody).toBeInTheDocument()
    expect(
      within(tableBody).getByText(participant.profile.fullName)
    ).toBeInTheDocument()
    expect(within(tableBody).getByText('Pass')).toBeInTheDocument()
    expect(
      within(tableBody).getByText(participant.certificate.number)
    ).toBeInTheDocument()
    expect(
      within(tableBody).getByText(participant.course.course_code)
    ).toBeInTheDocument()
    expect(
      within(tableBody).getByText(participant.course.course_code)
    ).toBeInTheDocument()
    expect(within(tableBody).getByText('Active')).toBeInTheDocument()
  })

  it('checks the download selected certificates is disabled without selecting certificates', async () => {
    const participants = [buildParticipant()]
    const sorting = {
      by: 'name',
      dir: 'asc' as SortOrder,
      onSort: jest.fn(),
    }

    render(<CertificationList participants={participants} sorting={sorting} />)

    expect(
      screen.getByTestId('download-all-certifications')
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('download-selected-certifications')
    ).toBeDisabled()
    userEvent.click(screen.getByTestId('TableChecks-Head'))
    expect(screen.getByTestId('download-selected-certifications')).toBeEnabled()
  })
})
