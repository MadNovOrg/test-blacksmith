import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Link,
} from '@mui/material'
import { FC, PropsWithChildren, useMemo } from 'react'
import { useQuery } from 'urql'

import { LinkToProfile } from '@app/components/LinkToProfile'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import {
  GetCourseParticipantDietOrDisabilitiesDataQuery,
  GetCourseParticipantDietOrDisabilitiesDataQueryVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { GET_DIETARY_OR_DISABILITIES_DATA } from '@app/queries/course-participant/get-participant-dietary-restrictions-by-course-id'

export const DisabilitiesTab: FC<PropsWithChildren<{ courseId: number }>> = ({
  courseId,
}) => {
  const { acl } = useAuth()
  const { t } = useScopedTranslation('pages.course-details.tabs.disabilities')
  const [{ data: disabilitiesData }] = useQuery<
    GetCourseParticipantDietOrDisabilitiesDataQuery,
    GetCourseParticipantDietOrDisabilitiesDataQueryVariables
  >({
    query: GET_DIETARY_OR_DISABILITIES_DATA,
    variables: { courseId, withDisabilities: true },
  })
  const cols = useMemo(
    () =>
      [
        {
          id: 'name',
          label: t('name'),
          sorting: false,
        },
        {
          id: 'email',
          label: t('email'),
          sorting: false,
        },
        {
          id: 'organisation',
          label: t('organisation'),
          sorting: false,
        },
        {
          id: 'disabilities',
          label: t('disabilities'),
          sorting: false,
        },
      ].filter(Boolean),
    [t]
  )
  return (
    <>
      <Typography variant="subtitle1" data-testid="trainer-evaluation-title">
        {t('title')}
      </Typography>
      <Table sx={{ mt: 2 }}>
        <TableHead cols={cols} />
        <TableBody>
          {[
            ...(disabilitiesData?.disabilities ?? []),
            ...(disabilitiesData?.trainerDisabilities ?? []),
          ].map(({ profile }) => (
            <TableRow key={profile.fullName}>
              <TableCell>
                <LinkToProfile profileId={profile.id}>
                  {profile.fullName}
                </LinkToProfile>
              </TableCell>
              <TableCell width="35%">
                <LinkToProfile profileId={profile.id}>
                  {profile.email}
                </LinkToProfile>
              </TableCell>
              <TableCell>
                {profile.organizations.map(org =>
                  acl.canViewOrganizations() ? (
                    <Link
                      data-testid="dietary-requirements-organization"
                      href={`/organisations/${org.organization.id}`}
                      key={org.organization.id}
                    >
                      <Typography>{org.organization.name}</Typography>
                    </Link>
                  ) : (
                    <Typography key={org.organization.id}>
                      {org.organization.name}
                    </Typography>
                  )
                )}
              </TableCell>
              <TableCell>
                <Typography>{profile.disabilities}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
  return <>Disabilities</>
}
