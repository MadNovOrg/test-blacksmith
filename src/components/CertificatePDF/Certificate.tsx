import pdf from '@react-pdf/renderer'
import React from 'react'
import { useTranslation } from 'react-i18next'

import BILDOutlineImage from '@app/assets/outline_bild.jpg'
import ICMOutlineImage from '@app/assets/outline_icm.jpg'
import { Accreditors_Enum, Grade_Enum } from '@app/generated/graphql'
import theme from '@app/theme'
import { Course, CourseLevel } from '@app/types'

// workaround for using react-pdf with vite
const { Document, Image, Page, StyleSheet, Text, Font } = pdf

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
      fontWeight: 400,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf',
      fontWeight: 500,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
      fontWeight: 600,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
      fontWeight: 700,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf',
      fontWeight: 800,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf',
      fontWeight: 900,
    },
  ],
})

const styles = StyleSheet.create({
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
  participantName: {
    fontWeight: 600,
    fontFamily: 'Inter',
  },
  footer: {
    fontSize: '8px',
    width: '70%',
    marginLeft: '120',
    marginRight: '120',
    fontFamily: 'Inter',
  },
})

type CertificateDocumentProps = {
  participantName: string
  courseLevel: CourseLevel
  grade: Grade_Enum
  certificationNumber: string
  expiryDate: string
  accreditedBy: Accreditors_Enum
  blendedLearning: boolean
  reaccreditation: boolean
  bildStrategies: Course['bildStrategies']
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
  bildStrategies,
}) => {
  const { t } = useTranslation()

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
          style={{ ...styles.participantName, marginBottom: theme.spacing(1) }}
        >
          {participantName}
        </Text>
        <Text style={{ ...styles.smallerText, marginBottom: theme.spacing(1) }}>
          {t('common.course-certificate.completed-message')}
        </Text>
        <Text
          style={{
            ...styles.text,
            ...styles.largerText,
            ...styles.grey,
            marginBottom: theme.spacing(2),
          }}
        >
          {t(`common.course-certificate.course-title-${accreditedBy}`)}
        </Text>

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
            accreditedBy === Accreditors_Enum.Icm
              ? t(`course-levels.${courseLevel}`)
              : bildStrategies
                  .map(s => t(`bild-strategies.${s.strategyName}`))
                  .join(', '),
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
          CourseLevel.Level_1,
          CourseLevel.Level_2,
          CourseLevel.Advanced,
          CourseLevel.BildRegular,
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
          CourseLevel.IntermediateTrainer,
          CourseLevel.AdvancedTrainer,
          CourseLevel.BildIntermediateTrainer,
          CourseLevel.BildAdvancedTrainer,
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
          {t(`common.course-certificate.certificate-footer-${accreditedBy}`)}
        </Text>
      </Page>
    </Document>
  )
}
