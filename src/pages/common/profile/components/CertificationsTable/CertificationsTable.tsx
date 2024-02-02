import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Button,
} from '@mui/material'
import { formatDistanceToNow, isPast } from 'date-fns'
import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { CertificateStatusChip } from '@app/components/CertificateStatusChip'
import { useAuth } from '@app/context/auth'
import {
  GetProfileDetailsQuery,
  CertificateStatus,
} from '@app/generated/graphql'

type CertificationsTableProps = {
  verified: boolean
  certifications: GetProfileDetailsQuery['certificates']
}

export const CertificationsTable: FC<
  PropsWithChildren<CertificationsTableProps>
> = ({ verified, certifications }) => {
  const { t } = useTranslation()
  const certificateExpired = (expiryDate: string) =>
    isPast(new Date(expiryDate))
  const navigate = useNavigate()
  const { acl } = useAuth()
  const tableHeadCells = [
    t('course-name'),
    t('certificate'),
    t('status'),
    t('certificate'),
  ]
  return (
    <>
      {verified && (
        <>
          <Typography variant="subtitle2" mt={3}>
            {t('certifications')}
          </Typography>
          <Box sx={{ mt: 1, overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    '&&.MuiTableRow-root': {
                      backgroundColor: 'grey.300',
                    },
                    '&& .MuiTableCell-root': {
                      py: 1,
                      color: 'grey.700',
                      fontWeight: '600',
                    },
                  }}
                >
                  {tableHeadCells.map((cell, index) => (
                    <TableCell key={cell + index}>{cell}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(certifications ?? []).map(certificate => {
                  const isRevoked =
                    certificate.status === CertificateStatus.Revoked

                  return (
                    <TableRow
                      data-testid={'certificate-' + certificate.number}
                      key={certificate.id}
                      sx={{
                        '&&.MuiTableRow-root': {
                          backgroundColor: 'common.white',
                        },
                      }}
                    >
                      <TableCell>{certificate.courseName}</TableCell>
                      <TableCell>{certificate.number}</TableCell>
                      <TableCell>
                        <Grid container direction="column" alignItems="start">
                          {certificate.status ? (
                            <CertificateStatusChip
                              status={certificate.status as CertificateStatus}
                              tooltip={
                                certificate.participant?.certificateChanges[0]
                                  ?.payload?.note
                              }
                            />
                          ) : null}
                          {!isRevoked && (
                            <Typography mt={1} variant="body2" color="grey.700">
                              {certificateExpired(certificate.expiryDate ?? '')
                                ? `${formatDistanceToNow(
                                    new Date(certificate.expiryDate)
                                  )} ${t('common.ago')}`
                                : certificate.expiryDate}
                            </Typography>
                          )}
                        </Grid>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            navigate(`/certification/${certificate.id}`)
                          }
                          disabled={isRevoked && !acl.canViewRevokedCert()}
                        >
                          {t('components.certification-list.view-certificate')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Box>
        </>
      )}
    </>
  )
}
