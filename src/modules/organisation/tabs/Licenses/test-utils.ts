import { userEvent, screen } from '@test/index'

import { FormData, Type } from './components/ManageLicensesForm'

export async function fillForm(data: Partial<FormData>) {
  if (data.type === Type.REMOVE) {
    await userEvent.click(screen.getByLabelText('Remove'))
  }

  if (data.issueRefund) {
    await userEvent.click(screen.getByTestId('issue-refund-checkbox'))
  }

  if (data.amount) {
    await userEvent.type(
      screen.getByLabelText('Number of licences *'),
      String(data.amount)
    )
  }

  if (data.invoiceId) {
    await userEvent.type(
      screen.getByLabelText('Invoice number *'),
      data.invoiceId
    )
  }

  if (data.note) {
    await userEvent.type(
      screen.getByLabelText('Add a note (optional)'),
      data.note
    )
  }

  if (data.licensePrice) {
    await userEvent.type(
      screen.getByLabelText('Price per licence *'),
      String(data.licensePrice)
    )
  }
}
