import userEvent from '@testing-library/user-event'
import React from 'react'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { ReInviteTrainerMutation } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { InviteStatus, RoleName } from '@app/types'

import { providers, _render, renderHook, screen } from '@test/index'
import {
  buildCourseAssistant,
  buildCourseLeader,
  buildCourseModerator,
  buildProfile,
} from '@test/mock-data-utils'

import { CourseTrainersInfo } from '.'

describe('component: CourseTrainersInfo', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useScopedTranslation('pages.course-participants'))

  const client = {
    executeMutation: () =>
      fromValue<{ data: ReInviteTrainerMutation }>({
        data: {
          insertCourseTrainer: { id: 'id' },
          deleteCourseTrainer: { id: 'id' },
        },
      }),
  } as unknown as Client

  it('displays show more button', () => {
    const trainers = [
      buildCourseLeader(),
      buildCourseAssistant(),
      buildCourseAssistant(),
      buildCourseAssistant(),
    ]

    _render(<CourseTrainersInfo trainers={trainers} />)

    expect(screen.getByText(t('show-more'))).toBeInTheDocument()
  })

  it('does not displays show more button', () => {
    const trainers = [
      buildCourseLeader(),
      buildCourseAssistant(),
      buildCourseAssistant(),
    ]

    _render(<CourseTrainersInfo trainers={trainers} />)

    expect(screen.queryByText(t('show-more'))).toBeNull()
  })

  it('Link to profile is correctly generated when Admin', async () => {
    const profile = buildProfile()
    providers.auth.activeRole = RoleName.TT_ADMIN

    const trainers = [
      buildCourseLeader({
        profile: { ...profile, fullName: 'Leader', id: '1' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 1', id: '2' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 2', id: '3' },
      }),
    ]

    _render(<CourseTrainersInfo trainers={trainers} />)

    providers.auth.activeRole = providers.auth.defaultRole
    const linkToProfile = screen.queryAllByTestId('link-to-profile')

    linkToProfile.forEach(element => {
      expect(element).toBeInTheDocument()
    })
  })

  it('Link to profile is not generated when standard user', async () => {
    const profile = buildProfile()

    const trainers = [
      buildCourseLeader({
        profile: { ...profile, fullName: 'Leader', id: '1' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 1', id: '2' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 2', id: '3' },
      }),
    ]

    _render(<CourseTrainersInfo trainers={trainers} />)

    providers.auth.activeRole = providers.auth.defaultRole
    const linkToProfile = screen.queryAllByTestId('link-to-profile')

    linkToProfile.forEach(element => {
      expect(element).toBeNull()
    })
  })

  it('display you are trainer text if id match', () => {
    const profile = buildProfile()

    const logInId = providers.auth.profile?.id || 'logInId'

    const trainers = [
      buildCourseLeader({
        profile: { ...profile, fullName: 'Leader', id: logInId },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 1', id: '2' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 2', id: '3' },
      }),
    ]

    _render(<CourseTrainersInfo trainers={trainers} />)
    expect(screen.getByText(t('trainer'))).toBeInTheDocument()
  })

  it('displays trainer name with apostrophe', () => {
    const profile = buildProfile()
    const leaderName = "Leader's"
    const assistantName = "Assistant's"
    const moderatorName = "Moderator's"

    const trainers = [
      buildCourseLeader({
        profile: { ...profile, fullName: leaderName, id: '1' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: assistantName, id: '2' },
      }),
      buildCourseModerator({
        profile: { ...profile, fullName: moderatorName, id: '3' },
      }),
    ]

    _render(<CourseTrainersInfo trainers={trainers} />)

    expect(screen.getByText(leaderName)).toBeInTheDocument()
    expect(screen.getByText(assistantName)).toBeInTheDocument()
    expect(screen.getByText(moderatorName)).toBeInTheDocument()
  })

  it('display you are assist trainer text if id match', () => {
    const profile = buildProfile()

    const logInId = providers.auth.profile?.id || 'logInId'

    const trainers = [
      buildCourseLeader({
        profile: { ...profile, fullName: 'Leader', id: '1' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 1', id: logInId },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 2', id: '3' },
      }),
    ]

    _render(<CourseTrainersInfo trainers={trainers} />)
    expect(screen.getByText(t('assistant'))).toBeInTheDocument()
  })

  it('display resend trainer invite button and remove after invite', async () => {
    const profile = buildProfile()

    const trainers = [
      buildCourseLeader({
        profile: { ...profile, fullName: 'Leader', id: '1' },
        status: InviteStatus.DECLINED,
      }),
    ]

    _render(
      <Provider value={client}>
        <CourseTrainersInfo canReInviteTrainer={true} trainers={trainers} />
      </Provider>,
    )

    const resendTrainerInviteBtn = screen.getByText(t('resend-trainer-invite'))

    expect(resendTrainerInviteBtn).toBeInTheDocument()

    await userEvent.click(resendTrainerInviteBtn)

    expect(resendTrainerInviteBtn).not.toBeInTheDocument()
  })
})
