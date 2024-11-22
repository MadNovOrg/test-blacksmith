import { Alert, Link } from '@mui/material'
import Typography from '@mui/material/Typography'

import { Dialog } from '@app/components/dialogs'
import {
  Course_Status_Enum,
  GetAffiliatedOrganisationsQuery,
} from '@app/generated/graphql'

export const UnlinkAffiliatedOrgForbiddenModal = ({
  affiliatedOrgsForbiddenToUnlink,
  onClose,
}: {
  affiliatedOrgsForbiddenToUnlink: Pick<
    Exclude<
      GetAffiliatedOrganisationsQuery['organizations'][number],
      'undefined'
    >,
    'id' | 'activeIndirectBLCourses' | 'name'
  >[]
  onClose: () => void
}) => {
  return (
    <Dialog
      open
      onClose={onClose}
      minWidth={600}
      data-testid="remove-affiliated-org-modal"
      slots={{
        Title: () => (
          <Typography variant="h4" fontWeight={600}>
            {affiliatedOrgsForbiddenToUnlink.length === 1
              ? 'This organisation cannot be unlinked'
              : 'Some organisations can not be unlinked'}
          </Typography>
        ),
        Content: () => (
          <Alert severity="warning" variant="outlined">
            {affiliatedOrgsForbiddenToUnlink.length === 1
              ? 'This organisation cannot be unlinked until all Indirect BlendedLearning courses are Completed and there are no pending invitations within existing Completed Indirect Blended Learning courses.'
              : 'Some organisations can not be unlinked until all Indirect Blended Learning courses are Completed and there are no pending invitations within existing Completed Indirect Blended Learning courses'}
            <br />
            <br />
            {affiliatedOrgsForbiddenToUnlink.length === 1
              ? 'Completed Indirect Blended Learning courses with pending invitations or ongoing courses:'
              : 'Organisations with Completed Indirect Blended Learning courses with pending invitations or ongoing courses:'}

            <ul>
              {affiliatedOrgsForbiddenToUnlink.length === 1
                ? affiliatedOrgsForbiddenToUnlink[0].activeIndirectBLCourses.map(
                    course => (
                      <li key={course.id}>
                        <Link
                          href={`/manage-courses/all/${course.id}/details`}
                          underline="none"
                        >
                          {course.course_code}
                        </Link>{' '}
                        (
                        {`${
                          course.status === Course_Status_Enum.Completed
                            ? `${
                                course.pendingInvites.aggregate?.count
                              } pending invite${
                                course.pendingInvites.aggregate?.count === 1
                                  ? ''
                                  : 's'
                              }`
                            : 'ongoing course'
                        }`}
                        )
                      </li>
                    ),
                  )
                : affiliatedOrgsForbiddenToUnlink.map(org => (
                    <li key={org.id} style={{ marginBottom: '8px' }}>
                      <Link href={`/organisations/${org.id}`} underline="none">
                        {org.name}
                      </Link>

                      <ul>
                        {org.activeIndirectBLCourses.map(course => (
                          <li key={course.id} style={{ marginBottom: '4px' }}>
                            <Link
                              href={`/manage-courses/all/${course.id}/details`}
                              underline="none"
                            >
                              {course.course_code}
                            </Link>{' '}
                            (
                            {`${
                              course.status === Course_Status_Enum.Completed
                                ? `${
                                    course.pendingInvites.aggregate?.count
                                  } pending invite${
                                    course.pendingInvites.aggregate?.count === 1
                                      ? ''
                                      : 's'
                                  }`
                                : 'ongoing course'
                            }`}
                            )
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
            </ul>
          </Alert>
        ),
      }}
    ></Dialog>
  )
}
