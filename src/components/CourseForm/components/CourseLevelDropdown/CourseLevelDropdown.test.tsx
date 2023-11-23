import React from 'react'
import { noop } from 'ts-essentials'

import { Accreditors_Enum, Course_Level_Enum } from '@app/generated/graphql'
import { CourseType, RoleName } from '@app/types'

import { render, screen, userEvent, within } from '@test/index'

import { CourseLevelDropdown } from './index'

const getOption = (level: string | RegExp, query = false) => {
  const dropdown = screen.getByRole('listbox')

  if (query) {
    return within(dropdown).queryByText(level)
  }

  return within(dropdown).getByText(level)
}

describe('component: CourseLevelDropdown', () => {
  it('renders correctly when type is OPEN', async () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.OPEN}
        courseAccreditor={Accreditors_Enum.Icm}
      />,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(5)

    expect(getOption(/level one/i)).toBeInTheDocument()
    expect(getOption(/level two/i)).toBeInTheDocument()
    expect(getOption(/intermediate trainer/i)).toBeInTheDocument()
    expect(getOption(/3-day safety responses trainer/i)).toBeInTheDocument()
    expect(getOption(/advanced trainer/i)).toBeInTheDocument()
  })

  it('renders correctly when type is CLOSED', async () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.CLOSED}
        courseAccreditor={Accreditors_Enum.Icm}
      />,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(5)

    expect(getOption(/level one/i)).toBeInTheDocument()
    expect(getOption(/level two/i)).toBeInTheDocument()
    expect(getOption(/advanced modules/i)).toBeInTheDocument()
    expect(getOption(/intermediate trainer/i)).toBeInTheDocument()
    expect(getOption(/advanced trainer/i)).toBeInTheDocument()
  })

  it('renders correctly when type is INDIRECT', async () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.INDIRECT}
        courseAccreditor={Accreditors_Enum.Icm}
      />,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(3)

    expect(getOption(/level one/i)).toBeInTheDocument()
    expect(getOption(/level two/i)).toBeInTheDocument()
    expect(getOption(/advanced modules/i)).toBeInTheDocument()
  })

  it("doesn't render Advanced modules if a trainer isn't Advanced Trainer or BILD Advanced trainer certified", async () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.INDIRECT}
        courseAccreditor={Accreditors_Enum.Icm}
      />,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          certificates: [
            {
              expiryDate: new Date().toISOString(),
              courseLevel: Course_Level_Enum.IntermediateTrainer,
            },
          ],
          activeCertificates: [Course_Level_Enum.IntermediateTrainer],
        },
      }
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(2)

    expect(getOption(/level one/i)).toBeInTheDocument()
    expect(getOption(/level two/i)).toBeInTheDocument()
    expect(getOption(/advanced modules/i, true)).not.toBeInTheDocument()
  })

  it('renders Advanced modules if a trainer has an Advanced trainer certificate', async () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.INDIRECT}
        courseAccreditor={Accreditors_Enum.Icm}
      />,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          activeCertificates: [Course_Level_Enum.AdvancedTrainer],
        },
      }
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(3)

    expect(getOption(/level one/i)).toBeInTheDocument()
    expect(getOption(/level two/i)).toBeInTheDocument()
    expect(getOption(/advanced modules/i)).toBeInTheDocument()
  })

  it('renders Advanced modules if a trainer has a BILD Advanced trainer certificate', async () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.INDIRECT}
        courseAccreditor={Accreditors_Enum.Icm}
      />,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          activeCertificates: [Course_Level_Enum.BildAdvancedTrainer],
        },
      }
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(3)

    expect(getOption(/level one/i)).toBeInTheDocument()
    expect(getOption(/level two/i)).toBeInTheDocument()
    expect(getOption(/advanced modules/i)).toBeInTheDocument()
  })
})
