import { ForeignScript } from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Accreditors_Enum,
  Course_Level_Enum,
  Grade_Enum,
} from '@app/generated/graphql'

import { chance, render, screen, waitFor } from '@test/index'

import { CertificateDocument } from './Certificate'

describe('CertificateDocument', () => {
  const defaultProps = {
    accreditedBy: Accreditors_Enum.Icm,
    blendedLearning: false,
    certificationNumber: chance.string({ numeric: true }),
    courseLevel: Course_Level_Enum.Level_1,
    expiryDate: '2024-12-31',
    grade: Grade_Enum.Pass,
    participantName: 'John Doe',
    reaccreditation: false,
  }

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

    render(<CertificateDocument {...props} />)

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

      render(<CertificateDocument {...props} />)

      await waitFor(() => {
        expect(screen.getByText(name)).toHaveStyle({
          fontFamily: 'Inter',
        })
      })
    },
  )
})
