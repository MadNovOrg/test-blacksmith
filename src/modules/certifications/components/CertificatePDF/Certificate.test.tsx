import { useTranslation } from 'react-i18next'

import { ForeignScript } from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Accreditors_Enum,
  Course_Level_Enum,
  Grade_Enum,
} from '@app/generated/graphql'

import { chance, _render, renderHook, screen, waitFor } from '@test/index'

import { CertificateDocument } from './Certificate'

describe('CertificateDocument', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const defaultProps = {
    accreditedBy: Accreditors_Enum.Icm,
    blendedLearning: false,
    certificationNumber: chance.string({ numeric: true }),
    courseLevel: Course_Level_Enum.Level_1,
    expiryDate: '2024-12-31',
    grade: Grade_Enum.Pass,
    isAustralia: false,
    participantName: 'John Doe',
    reaccreditation: false,
  }

  it("should display UK's content for non-Australian certificates", async () => {
    _render(<CertificateDocument {...defaultProps} />)

    await waitFor(() => {
      expect(
        screen.getByText(t('common.course-certificate.course-title-ICM')),
      ).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(
        screen.getByText(t('common.course-certificate.certificate-footer-ICM')),
      ).toBeInTheDocument()
    })
  })

  it("should display ANZ's content for Australian certificates", async () => {
    const props = { ...defaultProps, isAustralia: true }
    _render(<CertificateDocument {...props} />)

    await waitFor(() => {
      expect(
        screen.getByText(t('common.course-certificate.course-title-ICM-ANZ')),
      ).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(
        screen.getByText(
          t('common.course-certificate.certificate-footer-ICM-ANZ'),
        ),
      ).toBeInTheDocument()
    })
  })

  test.each([
    [ForeignScript.ARABIC, 'محمد أحمد'],
    [ForeignScript.ARMENIAN, 'Արամ Գրիգորյան'],
    [ForeignScript.CHINESE, '太郎 鈴木'],
    [ForeignScript.GEORGIAN, 'გიორგი კიკნაძე'],
    [ForeignScript.HEBREW, 'דוד כהן'],
    [ForeignScript.JAPANESE, 'アレックス'],
    [ForeignScript.KOREAN, '민준 김'],
    [ForeignScript.LAO, 'ສຸກສົມ ບຸນເຮັມ'],
    [ForeignScript.MYANMAR, 'မောင် တင်'],
    [ForeignScript.THAI, 'สมชาย ศรีสุข'],
  ])('should apply %s for %s name', async (script, name) => {
    const props = { ...defaultProps, participantName: name }

    _render(<CertificateDocument {...props} />)

    await waitFor(() => {
      expect(screen.getByText(name)).toHaveStyle({
        fontWeight: 500,
        fontFamily: script,
      })
    })
  })

  test.each(['Пётр', 'Ștefan', 'John Doe'])(
    'should apply default Inter font for %s name',
    async name => {
      const props = { ...defaultProps, participantName: name }

      _render(<CertificateDocument {...props} />)

      await waitFor(() => {
        expect(screen.getByText(name)).toHaveStyle({
          fontFamily: 'Inter',
        })
      })
    },
  )
})
