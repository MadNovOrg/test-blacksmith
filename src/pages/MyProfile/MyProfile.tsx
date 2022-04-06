import PassIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import { format, formatDistanceToNow } from 'date-fns'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@app/components/Avatar'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import { SortOrder } from '@app/types'
import { now } from '@app/util'

type MyProfilePageProps = unknown

const formatCertDate = (value: string | Date, wordToAppend: string) => {
  const date = typeof value === 'string' ? new Date(value) : value

  if (date > now()) {
    return format(date, 'MMMM d, yyyy')
  }

  return `${formatDistanceToNow(date)} ${wordToAppend}`
}

const mockedCerts = [
  {
    id: 1,
    courseName: 'Level One - 6 Hour Reaccreditation',
    cert: 'PASS',
    certName: 'LEVEL1.CL.132569',
    validUntil: new Date(+new Date() + 1000 * 60 * 60 * 2),
  },

  {
    id: 2,
    courseName: 'Level One - 6 Hour Reaccreditation',
    cert: 'PASS',
    certName: 'INDR.1.CL-3825-384810',
    validUntil: new Date(+new Date() - 1000 * 60 * 60 * 24 * 2),
  },
]

const DetailsRow = ({ label, value }: { label: string; value: string }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Typography flex={1} color="grey.700">
      {label}
    </Typography>
    <Typography flex={2}>{value}</Typography>
  </Box>
)

export const MyProfilePage: React.FC<MyProfilePageProps> = () => {
  const { t } = useTranslation()
  const { profile } = useAuth()

  const cols = useMemo(
    () => [
      { id: 'courseName', label: t('course-name'), sorting: false },
      { id: 'cert', label: t('certificate'), sorting: false },
      { id: 'status', label: t('status'), sorting: false },
      { id: 'action', label: t('action'), sorting: false },
    ],
    [t]
  )

  const [order, setOrder] = useState<SortOrder>('asc')
  const [orderBy, setOrderBy] = useState(cols[2].id)

  const handleRequestSort = (col: string) => {
    const isAsc = orderBy === col && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(col)
  }

  const loading = false
  if (!profile) return null

  return (
    <Box bgcolor="grey.100" pb={6} pt={3}>
      <Container>
        <Grid container>
          <Grid
            item
            md={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              src={profile.avatar}
              name={profile.fullName}
              size={220}
              sx={{ mb: 4 }}
            />
            <Typography variant="h1" whiteSpace="nowrap">
              {profile.fullName}
            </Typography>
            <Typography variant="body1" color="grey.700">
              {profile.email}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              component={LinkBehavior}
              href="edit"
              startIcon={<EditIcon />}
              sx={{ mt: 5 }}
            >
              {t('edit-profile')}
            </Button>
          </Grid>
          <Grid item md={8}>
            <Typography variant="subtitle2" mb={1}>
              {t('personal-details')}
            </Typography>
            <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
              <DetailsRow label={t('first-name')} value={profile.givenName} />
              <DetailsRow label={t('surname')} value={profile.familyName} />
              <DetailsRow label={t('email')} value={profile.email} />
              <DetailsRow label={t('phone')} value={profile.phone} />
              <DetailsRow label={t('dob')} value={profile.dob} />
              <DetailsRow label={t('job-title')} value={profile.jobTitle} />
            </Box>

            <Typography variant="subtitle2" mb={1} mt={3}>
              {t('org-details')}
            </Typography>
            <Box bgcolor="common.white" p={3} pb={1} borderRadius={1}>
              <DetailsRow
                label={t('org-name')}
                value={profile.organizations
                  .map(o => o.organization.name)
                  .join(', ')}
              />
            </Box>

            <Typography variant="subtitle2" mb={1} mt={3}>
              {t('certifications')}
            </Typography>

            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }} data-testid="courses-table">
                <TableHead
                  cols={cols}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  sx={{
                    '& .MuiTableRow-root': { backgroundColor: 'grey.300' },
                  }}
                />
                <TableBody
                  sx={{
                    '&& .MuiTableRow-root': { backgroundColor: 'common.white' },
                  }}
                >
                  {mockedCerts.map(c => (
                    <TableRow key={c.id}>
                      <TableCell>{c.courseName}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" mb={1}>
                          <PassIcon color="success" />
                          <Typography ml={1}>{c.cert}</Typography>
                        </Box>
                        <Typography variant="body2" color="grey.600">
                          {c.certName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={c.validUntil > now() ? 'Active' : 'Expired'}
                          size="small"
                          color={c.validUntil > now() ? 'success' : 'warning'}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="grey.600">
                          {formatCertDate(c.validUntil, t('common.ago'))}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          {t('view-cert')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) ??
                    (loading && (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
