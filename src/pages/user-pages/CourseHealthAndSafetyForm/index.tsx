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
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import {
  MUTATION,
  ParamsType,
} from '@app/queries/user-queries/save-health-safety-consent'
import theme from '@app/theme'

export const CourseHealthAndSafetyForm = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const params = useParams()
  const { profile } = useAuth()

  const courseId = params.id as string
  const { data: course } = useCourse(courseId ?? '')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [healthCheck, setHealthCheck] = useState(false)
  const [riskCheck, setRiskCheck] = useState(false)
  const [signature, setSignature] = useState('')
  const [hasFocus, setHasFocus] = useState(false)

  const incorrectSignature = signature && signature !== profile?.fullName
  const valid = healthCheck && riskCheck && !incorrectSignature

  const handleSubmit = async () => {
    if (profile) {
      setSubmitting(true)
      try {
        await fetcher<null, ParamsType>(MUTATION, {
          courseId,
          profileId: profile.id,
        })
        navigate(`/courses/${courseId}/details?tab=CHECKLIST`)
      } catch (e: unknown) {
        setError((e as Error).message)
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
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
                  {course?.name}
                </Typography>
              </Box>
            </Sticky>
          </Grid>

          <Grid item md={7} pt={10} px={2} container gap={3}>
            <Typography variant="body1">
              {t('pages.hs-form.information.p1')}
            </Typography>

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
                label={t('pages.hs-form.information.health-check-label')}
              />
            </FormGroup>

            <Typography variant="body2">
              {t('pages.hs-form.information.p2')}
            </Typography>

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
              error={!hasFocus && Boolean(incorrectSignature)}
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
              helperText={
                !hasFocus && incorrectSignature
                  ? t('pages.hs-form.incorrect-signature')
                  : ''
              }
              placeholder={t('common.full-name')}
              onChange={event => setSignature(event.target.value)}
            />

            {error && (
              <Box mt={2}>
                <FormHelperText error>{error}</FormHelperText>
              </Box>
            )}

            <Box display="flex" justifyContent="flex-end" width="100%" mt={2}>
              <LoadingButton
                loading={submitting}
                type="submit"
                variant="contained"
                disabled={!valid}
                onClick={() => handleSubmit()}
              >
                {t('common.submit-form')}
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </FullHeightPage>
  )
}
