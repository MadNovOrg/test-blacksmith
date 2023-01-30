import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'

import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  ParamsType as FindLegacyCertificateParamsType,
  QUERY as FindLegacyCertificateQuery,
  ResponseType as FindLegacyCertificateResponseType,
} from '@app/queries/certificate/find-legacy-certificate'
import {
  MUTATION as ImportLegacyCertificateMutation,
  ParamsType as ImportLegacyCertificateParamsType,
} from '@app/queries/certificate/import-legacy-certificate'
import { CourseLevel } from '@app/types'

export type ImportCertificateModalProps = {
  onCancel: () => void
  onSubmit: () => void
}

const COURSE_PREFIX_TO_LEVEL = {
  LEVEL1: CourseLevel.Level_1,
  LEVEL2: CourseLevel.Level_2,
}

function parseCourseLevel(number: string) {
  const [levelPrefix] = number.split('.')
  if (levelPrefix in COURSE_PREFIX_TO_LEVEL) {
    return COURSE_PREFIX_TO_LEVEL[
      levelPrefix as keyof typeof COURSE_PREFIX_TO_LEVEL
    ]
  } else {
    return null
  }
}

const ImportCertificateModal: React.FC<ImportCertificateModalProps> =
  function ({ onCancel, onSubmit }) {
    const { t } = useTranslation()
    const fetcher = useFetcher()
    const { profile } = useAuth()

    const [code, setCode] = useState('')
    const [error, setError] = useState<string>()

    const submitHandler = useCallback(async () => {
      const errorMessage = t(
        'common.course-certificate.certification-code-incorrect'
      )
      if (!profile || !code) {
        return
      }
      setError(undefined)
      try {
        const { results } = await fetcher<
          FindLegacyCertificateResponseType,
          FindLegacyCertificateParamsType
        >(FindLegacyCertificateQuery, {
          code: code,
          firstName: profile.givenName,
          lastName: profile.familyName,
        })
        if (results.length !== 1) {
          setError(errorMessage)
        } else {
          const certificate = results[0]
          const mappedLevel = parseCourseLevel(certificate.number)
          if (!mappedLevel) {
            setError(errorMessage)
            return
          }
          await fetcher<null, ImportLegacyCertificateParamsType>(
            ImportLegacyCertificateMutation,
            {
              id: uuidv4(),
              number: certificate.number,
              expiryDate: certificate.expiryDate,
              certificationDate: certificate.certificationDate,
              profileId: profile.id,
              courseName: certificate.courseName,
              courseLevel: mappedLevel,
            }
          )
          onSubmit()
        }
      } catch (e) {
        setError(errorMessage)
      }
    }, [code, t, fetcher, onSubmit, profile])

    return (
      <Box>
        <Typography variant="body1" color="grey.700">
          {t('common.course-certificate.import-certificate-description')}
        </Typography>

        <TextField
          sx={{ my: 3 }}
          onChange={event => setCode(event.target.value)}
          variant="filled"
          label={t('common.course-certificate.enter-valid-certification-code')}
          error={Boolean(error)}
          helperText={error}
          fullWidth
          value={code}
        />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            size="large"
            onClick={onCancel}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            onClick={submitHandler}
            disabled={!code}
          >
            {t('common.course-certificate.update-certification')}
          </Button>
        </Box>
      </Box>
    )
  }

export default ImportCertificateModal
