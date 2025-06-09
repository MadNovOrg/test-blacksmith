import { useTranslation } from 'react-i18next'

import { Trainer_Agreement_Type_Enum } from '@app/generated/graphql'

import { render, renderHook, screen } from '@test/index'

import UserRole from './UserRole'

describe('UserRole component', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('displays agreement type chips when available.', async () => {
    render(
      <UserRole
        agreementTypes={[
          Trainer_Agreement_Type_Enum.Aol,
          Trainer_Agreement_Type_Enum.Eta,
        ]}
        isOrganisationAdmin={false}
        user={[]}
      />,
    )

    expect(
      screen.getByText(
        t(`trainer-agreement-types.${Trainer_Agreement_Type_Enum.Aol}`),
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        t(`trainer-agreement-types.${Trainer_Agreement_Type_Enum.Eta}`),
      ),
    ).toBeInTheDocument()
  })

  it("doesn't render any agreement type chips when the list is empty.", async () => {
    render(<UserRole isOrganisationAdmin={false} user={[]} />)

    expect(
      screen.queryByText(
        t(`trainer-agreement-types.${Trainer_Agreement_Type_Enum.Aol}`),
      ),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText(
        t(`trainer-agreement-types.${Trainer_Agreement_Type_Enum.Eta}`),
      ),
    ).not.toBeInTheDocument()
  })
})
