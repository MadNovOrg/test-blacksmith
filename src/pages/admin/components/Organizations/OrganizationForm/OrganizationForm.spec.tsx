import { Organization } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { render, renderHook, screen, userEvent } from '@test/index'

import { OrganizationForm } from './OrganizationForm'

describe(OrganizationForm.name, () => {
  const {
    result: {
      current: { t, _t },
    },
  } = renderHook(() => useScopedTranslation('pages.create-organization'))
  const submitMock = vi.fn()
  it('renders the component', () => {
    render(<OrganizationForm onSubmit={submitMock} />)
    expect(screen.getByText(t('fields.organization-name'))).toBeInTheDocument()
  })
  it('does not submit if form isnt filled', async () => {
    render(<OrganizationForm onSubmit={submitMock} />)
    expect(screen.getByText(t('add-new-organization'))).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('create-org-form-submit-btn'))
    expect(submitMock).not.toBeCalled()
  })
  it('prefills if edit mode', async () => {
    const editOrgData = {
      name: 'Test org',
    } as Partial<Organization>
    render(
      <OrganizationForm
        onSubmit={submitMock}
        isEditMode={true}
        editOrgData={editOrgData}
      />
    )
    expect(screen.getByTestId('name')).toHaveValue(editOrgData.name)
  })
  it('renders field errors', async () => {
    render(<OrganizationForm onSubmit={submitMock} />)
    await userEvent.click(screen.getByTestId('create-org-form-submit-btn'))
    expect(
      screen.getByText(
        _t('validation-errors.required-field', {
          name: t('fields.organization-name'),
        })
      )
    ).toBeInTheDocument()
  })
})
