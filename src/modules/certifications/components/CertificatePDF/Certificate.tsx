import pdf, { Styles } from '@react-pdf/renderer'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import BILDOutlineImage from '@app/assets/bild-outline.jpg'
import ICMOutlineImage from '@app/assets/outline_icm.jpg'
import {
  ForeignScriptFontPaths,
  getForeignScript,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Accreditors_Enum,
  Grade_Enum,
  Course_Level_Enum,
} from '@app/generated/graphql'
import theme from '@app/theme'

// workaround for using react-pdf with vite
const { Document, Image, Page, StyleSheet, Text, Font } = pdf

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
      fontWeight: 700,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf',
      fontWeight: 800,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf',
      fontWeight: 900,
    },
  ],
})

const defaultStyles = {
  pageBackground: {
    position: 'absolute',
    minWidth: '99%',
    minHeight: '99%',
    height: '99%',
    width: '99%',
  },
  page: {
    textAlign: 'center',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Inter',
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: '24px',
    fontFamily: 'Inter',
  },
  text: {
    fontFamily: 'Inter',
  },
  grey: {
    color: theme.palette.grey[800],
  },
  smallerText: {
    fontFamily: 'Inter',
    fontSize: '10px',
  },
  blue: {
    color: '#0D2860',
  },
  largerText: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '15px',
  },
  largestText: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '18px',
  },
  footer: {
    fontSize: '8px',
    width: '70%',
    marginLeft: '120',
    marginRight: '120',
    fontFamily: 'Inter',
  },
}

const styles = StyleSheet.create(defaultStyles as Styles)

type CertificateDocumentProps = {
  participantName: string
  courseLevel: Course_Level_Enum
  grade: Grade_Enum
  certificationNumber: string
  expiryDate: string
  accreditedBy: Accreditors_Enum
  blendedLearning: boolean
  reaccreditation: boolean
  isAustralia?: boolean
}

export const CertificateDocument: React.FC<
  React.PropsWithChildren<CertificateDocumentProps>
> = ({
  participantName,
  courseLevel,
  grade,
  certificationNumber,
  expiryDate,
  accreditedBy,
  blendedLearning,
  reaccreditation,
  isAustralia = false,
}) => {
  const { t } = useTranslation()

  const participantNameStyles: Styles = useMemo(() => {
    const foreignScript = getForeignScript(participantName)
    if (foreignScript) {
      Font.register({
        family: foreignScript,
        fonts: ForeignScriptFontPaths[foreignScript],
      })

      return StyleSheet.create({
        name: {
          fontFamily: foreignScript,
          fontWeight: 500,
        },
      } as Styles)
    }

    return StyleSheet.create({
      name: {
        fontFamily: 'Inter',
        fontWeight: 600,
      },
    } as Styles)
  }, [participantName])

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Image
          src={
            accreditedBy === Accreditors_Enum.Icm
              ? ICMOutlineImage
              : BILDOutlineImage
          }
          style={styles.pageBackground}
        />

        <Text style={{ ...styles.title, marginBottom: theme.spacing(2) }}>
          {t('common.course-certificate.title')}
        </Text>
        <Text
          style={{
            ...participantNameStyles.name,
            marginBottom: theme.spacing(1),
          }}
        >
          {participantName}
        </Text>
        <Text style={{ ...styles.smallerText, marginBottom: theme.spacing(1) }}>
          {t('common.course-certificate.completed-message')}
        </Text>
        {accreditedBy === Accreditors_Enum.Icm && (
          <Text
            style={{
              ...styles.text,
              ...styles.largerText,
              ...styles.grey,
              marginBottom: theme.spacing(2),
            }}
          >
            {t(
              `common.course-certificate.course-title-${accreditedBy}${
                accreditedBy === Accreditors_Enum.Icm && isAustralia
                  ? '-ANZ'
                  : ''
              }`,
            )}
          </Text>
        )}

        <Text
          style={{
            ...styles.largestText,
            ...styles.title,
            width: '80%',
            marginLeft: 'auto ',
            marginRight: 'auto',
            marginBottom: theme.spacing(1),
          }}
        >
          {[
            t(`course-levels.${courseLevel}`),
            reaccreditation ? t('common.reaccreditation') : null,
          ]
            .filter(Boolean)
            .join(' ')}
        </Text>

        <Text
          style={{
            ...styles.text,
            ...styles.largerText,
            ...styles.grey,
            marginBottom: theme.spacing(1),
          }}
        >
          {t(`common.course-certificate.${grade.toLowerCase()}-title`)}
        </Text>

        {[
          Course_Level_Enum.Level_1,
          Course_Level_Enum.Level_2,
          Course_Level_Enum.Advanced,
          Course_Level_Enum.BildRegular,
        ].includes(courseLevel) ? (
          <Text
            style={{
              ...styles.smallerText,
              lineHeight: 1.6,
              width: '80%',
              marginLeft: 'auto ',
              marginRight: 'auto',
              fontWeight: 600,
              marginBottom: theme.spacing(2),
            }}
          >
            {[
              t('common.course-certificate.levels-limitation-message'),
              grade === Grade_Enum.ObserveOnly
                ? t('common.course-certificate.physical-limitation-message')
                : null,
              blendedLearning
                ? t('common.course-certificate.blended-learning-message')
                : null,
            ]
              .filter(Boolean)
              .join(' ')}
          </Text>
        ) : null}

        {[
          Course_Level_Enum.IntermediateTrainer,
          Course_Level_Enum.AdvancedTrainer,
          Course_Level_Enum.BildIntermediateTrainer,
          Course_Level_Enum.BildAdvancedTrainer,
        ].includes(courseLevel) && grade === Grade_Enum.AssistOnly ? (
          <Text
            style={{
              ...styles.smallerText,
              fontWeight: 600,
              marginBottom: theme.spacing(2),
            }}
          >
            {t('common.course-certificate.assist-pass-limitation-message')}
          </Text>
        ) : null}

        <Text
          style={{
            ...styles.smallerText,
            fontWeight: 600,
            marginBottom: theme.spacing(1),
          }}
        >
          {' '}
          {t('common.course-certificate.certification-number-message', {
            num: certificationNumber,
          })}
        </Text>
        <Text
          style={{
            ...styles.smallerText,
            fontWeight: 600,
            marginBottom: theme.spacing(2),
          }}
        >
          {' '}
          {t('common.course-certificate.certification-valid-until-message', {
            date: expiryDate,
          })}
        </Text>
        <Text style={styles.footer}>
          {t(
            `common.course-certificate.certificate-footer-${accreditedBy}${
              accreditedBy === Accreditors_Enum.Icm && isAustralia ? '-ANZ' : ''
            }`,
          )}
        </Text>
      </Page>
    </Document>
  )
}
