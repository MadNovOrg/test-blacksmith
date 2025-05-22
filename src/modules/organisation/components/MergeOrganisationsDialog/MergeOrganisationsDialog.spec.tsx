import { GetOrganisationDetailsQuery } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { chance, render, renderHook, screen, waitFor } from '@test/index'

import { MergeOrganisationsDialog } from './MergeOrganisationsDialog'

describe(MergeOrganisationsDialog.name, () => {
  const {
    result: {
      current: { t, _t },
    },
  } = renderHook(() => useScopedTranslation('pages.admin.organizations.merge'))
  const onClose = vi.fn()
  it('should render', () => {
    render(
      <MergeOrganisationsDialog
        open={true}
        onClose={onClose}
        selectedOrgs={[]}
      />,
    )
    expect(screen.getByText(t('select-main'))).toBeInTheDocument()
  })
  it('should render with selectedOrgs', () => {
    const orgname = chance.name()
    const orgaddress = chance.address().slice(0, 20)
    const randomAttribute = chance.syllable()
    render(
      <MergeOrganisationsDialog
        open={true}
        onClose={onClose}
        selectedOrgs={
          [
            {
              id: '1',
              name: orgname,
              address: { orgaddress },
              attributes: { randomAttribute },
            },
          ] as GetOrganisationDetailsQuery['orgs'][0][]
        }
      />,
    )
    expect(screen.getByText(t('select-main'))).toBeInTheDocument()
    expect(screen.getByText(orgname)).toBeInTheDocument()
    expect(screen.getByText(orgaddress)).toBeInTheDocument()
    expect(screen.getByText(randomAttribute)).toBeInTheDocument()
  })
  it('should show warning alert', () => {
    const orgname = chance.name()
    const orgaddress = chance.address().slice(0, 20)
    const randomAttribute = chance.syllable()
    render(
      <MergeOrganisationsDialog
        open={true}
        onClose={onClose}
        selectedOrgs={
          [
            {
              id: '1',
              name: orgname,
              address: { orgaddress },
              attributes: { randomAttribute },
            },
          ] as GetOrganisationDetailsQuery['orgs'][0][]
        }
      />,
    )
    expect(screen.getByText(t('merge-alert'))).toBeInTheDocument()
  })
  it('should show action buttons', () => {
    const orgname = chance.name()
    const orgaddress = chance.address().slice(0, 20)
    const randomAttribute = chance.syllable()
    render(
      <MergeOrganisationsDialog
        open={true}
        onClose={onClose}
        selectedOrgs={
          [
            {
              id: '1',
              name: orgname,
              address: { orgaddress },
              attributes: { randomAttribute },
            },
          ] as GetOrganisationDetailsQuery['orgs'][0][]
        }
      />,
    )
    expect(screen.getByText(t('merge'))).toBeInTheDocument()
    expect(screen.getByText(_t('cancel'))).toBeInTheDocument()
  })
  it('should call onClose', () => {
    const orgname = chance.name()
    const orgaddress = chance.address().slice(0, 20)
    const randomAttribute = chance.syllable()
    render(
      <MergeOrganisationsDialog
        open={true}
        onClose={onClose}
        selectedOrgs={
          [
            {
              id: '1',
              name: orgname,
              address: { orgaddress },
              attributes: { randomAttribute },
            },
          ] as GetOrganisationDetailsQuery['orgs'][0][]
        }
      />,
    )
    screen.getByText(_t('cancel')).click()
    expect(onClose).toHaveBeenCalled()
  })
  it('should call setShowWarning', () => {
    const orgname = chance.name()
    const orgaddress = chance.address().slice(0, 20)
    const randomAttribute = chance.syllable()
    render(
      <MergeOrganisationsDialog
        open={true}
        onClose={onClose}
        selectedOrgs={
          [
            {
              id: '1',
              name: orgname,
              address: { orgaddress },
              attributes: { randomAttribute },
            },
          ] as GetOrganisationDetailsQuery['orgs'][0][]
        }
      />,
    )
    screen.getByText(t('merge')).click()
    expect(onClose).not.toHaveBeenCalled()
    waitFor(() => {
      expect(
        screen.getByTestId('merge-organisations-warning-dialog'),
      ).toBeInTheDocument()
    })
  })
})
