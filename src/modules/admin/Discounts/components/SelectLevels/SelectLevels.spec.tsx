import { t } from 'i18next'
import '@app/i18n/config'
import { ComponentProps } from 'react'

import { Course_Level_Enum } from '@app/generated/graphql'
import { AwsRegions } from '@app/types'

import { fireEvent, render, screen } from '@test/index'

import { getAvailableCourseLevels } from '../../utils'

import { SelectLevels } from './SelectLevels'

const onChangeMock = vi.fn()

const setup = (props: Partial<ComponentProps<typeof SelectLevels>> = {}) => {
  render(<SelectLevels value={[]} onChange={onChangeMock} {...props} />)
}

describe(`${SelectLevels.name} [UK]`, () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })
  it('should not display Level 1 BS, Advanced Modules and BILD Certified levels', () => {
    const levels = getAvailableCourseLevels(false).map(level =>
      t(`course-levels.${level}`),
    )
    setup()

    fireEvent.click(screen.getByRole('button'))

    levels.forEach(level => {
      expect(screen.getByText(level)).toBeInTheDocument()
    })

    expect(
      screen.queryByText(t(`course-levels.${Course_Level_Enum.Level_1Bs}`)),
    ).not.toBeInTheDocument()
  })
})

describe(`${SelectLevels.name} [ANZ]`, () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  })
  it('should display allowed levels', () => {
    const levels = getAvailableCourseLevels(true).map(level =>
      t(`course-levels.${level}`),
    )
    setup()

    fireEvent.click(screen.getByRole('button'))

    levels.forEach(level => {
      expect(screen.getByText(level)).toBeInTheDocument()
    })

    expect(
      screen.queryByText(t(`course-levels.${Course_Level_Enum.Level_1Bs}`)),
    ).not.toBeInTheDocument()
  })
})
