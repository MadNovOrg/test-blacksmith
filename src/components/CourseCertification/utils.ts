import { addMonths, isPast } from 'date-fns'

export const CertificateGracePeriod = {
  INTERMEDIATE_TRAINER: 3,
  THREE_DAY_SAFETY_RESPONSE_TRAINER: 3,
  ADVANCED_TRAINER: 1,
}

export function isCertificateOutsideGracePeriod(
  certificateExpiryDate: string,
  courseLevel: string
): boolean {
  const expiryDate = new Date(certificateExpiryDate)
  return isPast(
    addMonths(
      expiryDate,
      CertificateGracePeriod[
        courseLevel as keyof typeof CertificateGracePeriod
      ] ?? 0
    )
  )
}

export const isValidCertificate = (certificate: {
  expiryDate: string
  courseLevel: string
}) => {
  return (
    !isPast(new Date(certificate.expiryDate)) ||
    !isCertificateOutsideGracePeriod(
      certificate.expiryDate,
      certificate.courseLevel
    )
  )
}
