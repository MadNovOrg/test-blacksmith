import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'

import { RoleName } from '@app/types'

import { render, renderHook, screen, userEvent } from '@test/index'

import { ExceptionsApprovalAlert } from '.'

const urqlMockClient = {
  executeQuery: () => jest.fn(),
  executeMutation: () => jest.fn(),
  executeSubscription: () => jest.fn(),
} as never as Client

describe('component: ExceptionsApprovalAlert', () => {
  const { result } = renderHook(() => useTranslation())
  const t = result.current.t
  const setup = (activeRole = RoleName.LD) =>
    render(
      <Provider value={urqlMockClient}>
        <ExceptionsApprovalAlert />
      </Provider>,
      {
        auth: { activeRole },
      }
    )

  it('should render the ExceptionsApprovalAlert component', () => {
    setup()
    expect(screen.getByTestId('exceptions-approval')).toBeInTheDocument()
  })
  it('should render the Approve / Reject button', () => {
    setup()
    expect(screen.getByText(t('common.reject'))).toBeInTheDocument()
    expect(screen.getByText(t('common.approve'))).toBeInTheDocument()
  })
  it('should not render the Approve / Reject button if role is different than ADMIN or L&D', () => {
    setup(RoleName.USER)
    expect(screen.queryByText(t('common.reject'))).not.toBeInTheDocument()
    expect(screen.queryByText(t('common.approve'))).not.toBeInTheDocument()
  })
  it('should open the course rejection modal', async () => {
    setup()
    await userEvent.click(screen.getByText(t('common.reject')))
    expect(
      screen.getByText(
        t('pages.create-course.exceptions.modal-subtitle-reject')
      )
    ).toBeInTheDocument()
  })
  it('should open the course approval modal', async () => {
    setup()
    await userEvent.click(screen.getByText(t('common.approve')))
    expect(
      screen.getByText(
        t('pages.create-course.exceptions.modal-subtitle-approve')
      )
    ).toBeInTheDocument()
  })
})
