import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MUIImage from 'mui-image'

import { bildNewImage, cpdImage, icmImage, ntaImage } from '@app/assets'
import { CertificateStatusChip } from '@app/components/CertificateStatusChip'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Participant_Module,
  GetCertificateQuery,
  Grade_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { CertificateStatus, NonNullish, Strategy } from '@app/types'
import { transformModulesToGroups } from '@app/util'

import { ModuleGroupAccordion } from '../ModuleGroupAccordion/ModuleGroupAccordion'

type Participant = Pick<
  NonNullish<GetCertificateQuery['certificate']>,
  'participant'
>

type CertificateInfoProps = {
  courseParticipant?: Participant['participant']
  courseName: string
  grade: Grade_Enum
  accreditedBy: Accreditors_Enum
  revokedDate: string
  expiryDate: string
  certificationNumber: string
  dateIssued: string
  status: CertificateStatus
  statusTooltip?: string
  expireHoldDate?: string
  onShowChangelogModal: VoidFunction
}

export const CertificateInfo: React.FC<
  React.PropsWithChildren<CertificateInfoProps>
> = ({
  accreditedBy,
  courseParticipant,
  courseName,
  grade,
  revokedDate,
  expiryDate,
  certificationNumber,
  dateIssued,
  status,
  statusTooltip,
  expireHoldDate,
  onShowChangelogModal,
}) => {
  const imageSize = '10%'
  const { t, _t } = useScopedTranslation('common.course-certificate')
  const { acl } = useAuth()

  const filterModules = (strategy: Strategy): Strategy => {
    const filteredModules = strategy.modules?.filter(
      obj1 => !strategy.groups?.some(obj2 => obj2.name === obj1.name)
    )
    return { modules: filteredModules, groups: strategy.groups }
  }

  const moduleGroupsWithModules = courseParticipant
    ? transformModulesToGroups(
        courseParticipant.gradingModules as unknown as Course_Participant_Module[]
      )
    : null

  const isRevoked = status === CertificateStatus.REVOKED
  const isOnHold = status === CertificateStatus.ON_HOLD

  const strategyModules: Record<string, Strategy> =
    courseParticipant?.bildGradingModules?.modules

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box mt={isMobile ? 8 : 0}>
      {!courseParticipant && (
        <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
          {t('completed-modules-unavailable')}
        </Alert>
      )}

      {isRevoked ? (
        <Alert
          severity="warning"
          sx={{
            mb: 2,
            '&& .MuiAlert-message': {
              width: '100%',
            },
          }}
          variant="outlined"
          data-testid="revoked-cert-alert"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {t('revoked-warning', { date: revokedDate })}
            {acl.isTTAdmin() ? (
              <Box>
                <Button
                  variant="text"
                  color="primary"
                  sx={{ ml: 1, py: 0 }}
                  size="small"
                  onClick={onShowChangelogModal}
                  startIcon={<RemoveRedEyeIcon />}
                >
                  {_t('view-details')}
                </Button>
              </Box>
            ) : null}
          </Box>
        </Alert>
      ) : null}

      <Typography
        color={theme.palette.dimGrey.main}
        variant="subtitle2"
        sx={{ mb: 2 }}
      >
        {t('certified-message')}
      </Typography>

      <Typography data-testid="certificate-grade" variant="h2" gutterBottom>
        {t(`${grade.toLowerCase()}-title`)}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        {courseName}
      </Typography>

      {grade !== Grade_Enum.Fail ? (
        <>
          <Grid container spacing={2} mt={4}>
            <Grid item md={3} xs={12}>
              <Typography
                data-testid="certificate-issue-date"
                variant="body2"
                sx={{ mb: 1 }}
                color="grey.600"
              >
                {t('issue-date')}
              </Typography>
              <Typography variant="body1">
                {_t('dates.default', { date: dateIssued })}
              </Typography>
            </Grid>

            <Grid item md={3} xs={12}>
              <Typography variant="body2" sx={{ mb: 1 }} color="grey.600">
                {t('number')}
              </Typography>
              <Typography data-testid="certificate-number" variant="body1">
                {certificationNumber}
              </Typography>
            </Grid>

            {isRevoked ? (
              <Grid item md={3} xs={12}>
                <Typography variant="body2" sx={{ mb: 1 }} color="grey.600">
                  {t('revoked-on')}
                </Typography>
                <Typography variant="body1">
                  {_t('dates.default', { date: revokedDate })}
                </Typography>
              </Grid>
            ) : (
              <Grid item md={3} xs={12}>
                <Typography
                  data-testid="certificate-valid-until"
                  variant="body2"
                  sx={{ mb: 1 }}
                  color="grey.600"
                >
                  {t('valid-until')}
                </Typography>
                <Typography variant="body1">
                  {_t('dates.default', { date: expiryDate })}
                </Typography>
              </Grid>
            )}
            <Grid item xs={3}>
              <Typography variant="body2" sx={{ mb: 1 }} color="grey.600">
                {_t('status')}
              </Typography>
              <Box display="flex" alignItems="center">
                <CertificateStatusChip
                  status={status}
                  tooltip={statusTooltip}
                />
                {isOnHold ? (
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {t(`on-hold-until`, {
                      expireDate: expireHoldDate,
                    })}
                  </Typography>
                ) : null}
              </Box>
            </Grid>
          </Grid>

          <Box mt={8} gap={6} display="flex" mb={9} alignItems="center">
            {accreditedBy === Accreditors_Enum.Icm ? (
              <MUIImage
                duration={0}
                src={icmImage}
                width={imageSize}
                height={imageSize}
              />
            ) : null}

            {accreditedBy === Accreditors_Enum.Bild ? (
              <MUIImage
                duration={0}
                src={bildNewImage}
                width={imageSize}
                height={imageSize}
                style={{ filter: 'grayscale(1' }}
              />
            ) : null}

            <MUIImage
              duration={0}
              src={cpdImage}
              width={imageSize}
              height={imageSize}
            />
            <MUIImage
              duration={0}
              src={ntaImage}
              width={imageSize}
              height={imageSize}
            />
          </Box>
        </>
      ) : null}

      {moduleGroupsWithModules?.length ? (
        <>
          <Typography variant="h3" gutterBottom>
            {t('modules-list-title')}
          </Typography>
          {moduleGroupsWithModules.map(moduleGroupWithModules => {
            return (
              <ModuleGroupAccordion
                key={moduleGroupWithModules.id}
                moduleGroupName={moduleGroupWithModules.name}
                completedModules={moduleGroupWithModules.modules.filter(
                  module => module.completed
                )}
                uncompletedModules={moduleGroupWithModules.modules.filter(
                  module => !module.completed
                )}
              />
            )
          })}
        </>
      ) : null}

      {courseParticipant?.bildGradingModules?.modules ? (
        <>
          <Typography variant="h3" gutterBottom>
            {t('modules-list-title')}
          </Typography>
          {Object.keys(strategyModules).map(strategyName => (
            <>
              <Accordion
                key={strategyName}
                data-testid={`strategy-accordion-${strategyName}`}
              >
                <AccordionSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography variant="subtitle2">
                    {_t(`common.bild-strategies.${strategyName}`)}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                  <Stack spacing={1.5} mb={2}>
                    {strategyModules[strategyName].modules?.length
                      ? filterModules(
                          strategyModules[strategyName] as Strategy
                        ).modules?.map(
                          (bildModule: { name: string }, index: number) => (
                            <Typography mb={2} key={index}>
                              {bildModule.name}
                            </Typography>
                          )
                        )
                      : null}
                  </Stack>

                  {strategyModules[strategyName].groups?.length
                    ? strategyModules[strategyName].groups?.map(group => (
                        <Box key={group.name}>
                          <Typography fontWeight="500" mb={1}>
                            {group.name}
                          </Typography>

                          <Stack spacing={1.5} sx={{ pl: 2 }} ml={2}>
                            {group.modules?.length
                              ? group.modules.map(module => (
                                  <Typography key={module.name}>
                                    {module.name}
                                  </Typography>
                                ))
                              : null}
                          </Stack>
                        </Box>
                      ))
                    : null}
                </AccordionDetails>
              </Accordion>
              <Divider />
            </>
          ))}
        </>
      ) : null}
    </Box>
  )
}
