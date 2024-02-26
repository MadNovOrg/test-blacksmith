import { LoadingButton } from '@mui/lab'
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material'
import Link from '@mui/material/Link'
import { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  SaveHealthSafetyConsentMutation,
  SaveHealthSafetyConsentMutationVariables,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { MUTATION } from '@app/queries/user-queries/save-health-safety-consent'
import { validUserSignature } from '@app/util'

export const CourseHealthAndSafetyForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams()
  const { profile } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const courseId = params.id as string
  const { data: courseData } = useCourse(courseId ?? '')

  const [healthCheck, setHealthCheck] = useState(false)
  const [riskCheck, setRiskCheck] = useState(false)
  const [signature, setSignature] = useState('')
  const [hasFocus, setHasFocus] = useState(false)

  const validSignature = useMemo(
    () => validUserSignature(profile?.fullName, signature),
    [profile?.fullName, signature]
  )

  const valid = healthCheck && riskCheck && validSignature

  const [{ error, fetching: submitting }, saveHealthAndSafety] = useMutation<
    SaveHealthSafetyConsentMutation,
    SaveHealthSafetyConsentMutationVariables
  >(MUTATION)

  const handleSubmit = async () => {
    if (profile) {
      const { data } = await saveHealthAndSafety({
        courseId: Number(courseId ?? 0),
        profileId: profile.id,
      })
      if (data) {
        navigate(`/courses/${courseId}/details?tab=CHECKLIST`)
      }
    }
  }

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ padding: theme.spacing(2, 0, 4, 0) }}>
        <Grid container>
          <Grid item md={3}>
            <Sticky top={20}>
              <Box mt={5} pr={3}>
                <BackButton
                  label={t('pages.hs-form.back-to-checklist')}
                  to={`/courses/${courseId}/details?tab=CHECKLIST`}
                />

                <Typography variant="h2" gutterBottom my={2}>
                  {t('pages.hs-form.heading')}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  {courseData?.course?.name}
                </Typography>
              </Box>
            </Sticky>
          </Grid>

          <Grid item md={7} pt={isMobile ? 2 : 10} px={2} container gap={3}>
            <Typography variant="subtitle1" mt={2}>
              {t('pages.hs-form.information.h1')}
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={healthCheck}
                    onChange={e => {
                      setHealthCheck(e.target.checked)
                    }}
                    sx={{ px: 2 }}
                  />
                }
                label={
                  <Trans
                    i18nKey="pages.hs-form.information.health-check-label"
                    components={{
                      formLink: (
                        <Link
                          href={
                            import.meta.env.VITE_HEALTH_AND_SAFETY_CONTENT_PATH
                          }
                          target="_blank"
                        />
                      ),
                    }}
                  />
                }
              />
            </FormGroup>

            <Typography variant="subtitle1" mt={2}>
              {t('pages.hs-form.information.h2')}
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={riskCheck}
                    onChange={e => {
                      setRiskCheck(e.target.checked)
                    }}
                    sx={{ px: 2 }}
                  />
                }
                label={t('pages.hs-form.information.risk-check-label')}
              />
            </FormGroup>

            <Typography variant="subtitle1" mt={2}>
              {t('pages.hs-form.information.h3')}
            </Typography>

            <Typography variant="body2">
              {t('pages.hs-form.information.p3')}
            </Typography>

            <TextField
              fullWidth
              value={signature}
              variant="filled"
              error={!hasFocus && !validSignature && Boolean(signature)}
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
              helperText={
                !hasFocus && !validSignature && Boolean(signature)
                  ? t('pages.hs-form.incorrect-signature')
                  : ''
              }
              placeholder={t('common.full-name')}
              onChange={event => setSignature(event.target.value)}
            />

            <Alert severity="info" sx={{ mt: 2 }}>
              {t('components.course-form.name-and-surname-validation-info')}
            </Alert>

            {error && (
              <Box mt={2}>
                <FormHelperText error>{error.message}</FormHelperText>
              </Box>
            )}

            <Box display="flex" justifyContent="flex-end" width="100%" mt={2}>
              <LoadingButton
                loading={submitting}
                type="submit"
                variant="contained"
                disabled={!valid}
                data-testid="submit-button"
                onClick={() => handleSubmit()}
              >
                {t('common.submit-form')}
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </FullHeightPageLayout>
  )
}
