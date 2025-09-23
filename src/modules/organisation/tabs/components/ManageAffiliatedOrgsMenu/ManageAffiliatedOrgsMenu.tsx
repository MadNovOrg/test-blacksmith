import Delete from '@mui/icons-material/Delete'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { GetAffiliatedOrganisationsQuery } from '@app/generated/graphql'
import {
  Action,
  ActionsMenu,
} from '@app/modules/course_details/course_attendees_tab/components/ActionsMenu'

enum AffiliatedOrgAction {
  Unlink,
}
type AffiliatedOrganisation = Pick<
  Exclude<
    GetAffiliatedOrganisationsQuery['organizations'][number],
    'undefined'
  >,
  'id' | 'activeIndirectBLCourses' | 'name'
>
type ManageAffiliatedOrgsMenuProps = {
  onUnlinkClick: (item: AffiliatedOrganisation) => void
  affiliatedOrg: AffiliatedOrganisation
}
export const ManageAffiliatedOrgsMenu = ({
  onUnlinkClick,
  affiliatedOrg,
}: ManageAffiliatedOrgsMenuProps) => {
  const { t } = useTranslation()
  const actions: Record<
    AffiliatedOrgAction,
    Action<AffiliatedOrganisation>
  > = useMemo(
    () => ({
      [AffiliatedOrgAction.Unlink]: {
        label: t('common.unlink-organisation'),
        onClick: onUnlinkClick,
        testId: 'unlink-affiliated-org',
        icon: <Delete color="primary" />,
      },
    }),
    [t, onUnlinkClick],
  )
  const allowedActions = Object.values(actions).map(action => {
    return action
  })

  return (
    <ActionsMenu
      actions={allowedActions}
      item={affiliatedOrg}
      label={t('pages.org-details.tabs.affiliated-orgs.manage-affiliated-org')}
      testId="manage-affiliated-orgs"
    />
  )
}
