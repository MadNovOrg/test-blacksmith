import pdf from '@react-pdf/renderer'
import React from 'react'
import { useTranslation } from 'react-i18next'

import BILDOutlineImage from '@app/assets/outline_bild.jpg'
import ICMOutlineImage from '@app/assets/outline_icm.jpg'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Grade_Enum,
} from '@app/generated/graphql'
import { CourseLevel } from '@app/types'

// workaround for using react-pdf with vite
const { Document, Image, Page, StyleSheet, Text } = pdf

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
  },
  title: {
    color: '#0D2860',
    fontWeight: 990,
    marginBottom: '20',
    fontSize: '24px',
  },
  text: {
    marginBottom: '20',
  },
  grey: {
    color: 'grey',
  },
  smallerText: {
    fontSize: '10px',
    marginBottom: '12',
  },
  blue: {
    color: '#0D2860',
  },
  largerText: {
    fontWeight: 990,
    fontSize: '15px',
  },
  largestText: {
    fontWeight: 990,
    fontSize: '18px',
  },
  participantName: {
    marginBottom: '20',
    fontWeight: 'black',
  },
  footer: {
    fontSize: '8px',
    width: '70%',
    marginLeft: '120',
    marginRight: '120',
    marginTop: '30',
  },
})

type CertificateDocumentProps = {
  participantName: string
  courseName: string
  courseLevel: CourseLevel
  grade: Grade_Enum
  courseDeliveryType: Course_Delivery_Type_Enum
  certificationNumber: string
  expiryDate: string
  accreditedBy: Accreditors_Enum
}

export const CertificateDocument: React.FC<
  React.PropsWithChildren<CertificateDocumentProps>
> = ({
  participantName,
  courseName,
  courseLevel,
  grade,
  courseDeliveryType,
  certificationNumber,
  expiryDate,
  accreditedBy,
}) => {
  const { t } = useTranslation()

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {accreditedBy === Accreditors_Enum.Icm ? (
          <Image src={ICMOutlineImage} style={styles.pageBackground} />
        ) : (
          <Image src={BILDOutlineImage} style={styles.pageBackground} />
        )}

        <Text style={{ ...styles.title, marginTop: '100' }}>
          {' '}
          {t('common.course-certificate.title')}
        </Text>
        <Text style={styles.participantName}>{participantName}</Text>
        <Text style={{ ...styles.grey, ...styles.smallerText }}>
          {t('common.course-certificate.completed-message')}
        </Text>
        <Text style={{ ...styles.text, ...styles.largerText }}>
          {courseName}
        </Text>

        {[
          CourseLevel.Level_1,
          CourseLevel.Level_2,
          CourseLevel.Advanced,
        ].includes(courseLevel) ? (
          <Text style={styles.smallerText}>
            {t('common.course-certificate.levels-limitation-message')}
          </Text>
        ) : null}
        {courseDeliveryType !== Course_Delivery_Type_Enum.F2F ||
        grade === Grade_Enum.ObserveOnly ? (
          <Text style={styles.smallerText}>
            {t('common.course-certificate.physical-limitation-message')}
          </Text>
        ) : null}
        <Text style={styles.smallerText}>
          {' '}
          {t('common.course-certificate.certification-number-message', {
            num: certificationNumber,
          })}
        </Text>
        <Text style={styles.smallerText}>
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
