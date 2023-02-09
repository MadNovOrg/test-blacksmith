import { userEvent, screen } from '@test/index'

import { FormData, Type } from './components/ManageLicensesForm'

export function fillForm(data: Partial<FormData>) {
  if (data.type === Type.REMOVE) {
    userEvent.click(screen.getByLabelText('Remove'))
  }

  if (data.issueRefund) {
    userEvent.click(screen.getByTestId('issue-refund-checkbox'))
  }

  if (data.amount) {
    userEvent.type(
      screen.getByLabelText('Number of licences *'),
      String(data.amount)
    )
  }

  if (data.invoiceId) {
    userEvent.type(screen.getByLabelText('Invoice number *'), data.invoiceId)
  }

  if (data.note) {
    userEvent.type(screen.getByLabelText('Add a note (optional)'), data.note)
  }

  if (data.licensePrice) {
    userEvent.type(
      screen.getByLabelText('Price per licence *'),
      String(data.licensePrice)
    )
  }
}
