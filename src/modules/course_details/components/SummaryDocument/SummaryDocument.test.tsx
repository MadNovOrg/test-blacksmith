import { build } from '@jackfranklin/test-data-bot'

import { ForeignScript } from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Evaluation_Question_Group_Enum,
  Course_Evaluation_Question_Type_Enum,
  Course_Invite_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  GetCourseByIdQuery,
} from '@app/generated/graphql'
import { CourseEvaluationGroupedQuestion } from '@app/types'

import { chance, Matcher, _render, screen, waitFor } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { SummaryDocument } from './SummaryDocument'

const buildCourseForSummaryDocument = build<
  Pick<
    NonNullable<GetCourseByIdQuery['course']>,
    | 'accreditedBy'
    | 'bildModules'
    | 'deliveryType'
    | 'curriculum'
    | 'name'
    | 'schedule'
    | 'trainers'
    | 'type'
  >
>({
  fields: {
    accreditedBy: Accreditors_Enum.Icm,
    bildModules: [],
    deliveryType: Course_Delivery_Type_Enum.F2F,
    curriculum: [],
    name: 'Test Course',
    schedule: [
      {
        id: chance.guid(),
        createdAt: new Date().toISOString(),
        end: new Date().toISOString(),
        start: new Date().toISOString(),
        timeZone: 'Europe/London',
        updatedAt: new Date().toISOString(),
      },
    ],
    trainers: [],
    type: Course_Type_Enum.Open,
  },
})

const buildGroupedPropForSummaryDocument =
  build<CourseEvaluationGroupedQuestion>({
    fields: {
      MATERIALS_AND_VENUE: {
        answers: [
          {
            id: chance.guid(),
            answer: chance.sentence(),
            profile: {
              id: chance.guid(),
              fullName: chance.name(),
              avatar: null,
              archived: false,
            },
            question: {
              questionKey: 'QUESTION_KEY_1',
              type: Course_Evaluation_Question_Type_Enum.Text,
              group: Course_Evaluation_Question_Group_Enum.MaterialsAndVenue,
            },
          },
        ],
      },
      TRAINER_STANDARDS: {
        answers: [
          {
            id: chance.guid(),
            answer: chance.sentence(),
            profile: {
              id: chance.guid(),
              fullName: chance.name(),
              avatar: null,
              archived: false,
            },
            question: {
              questionKey: 'QUESTION_KEY_2',
              type: Course_Evaluation_Question_Type_Enum.Text,
              group: Course_Evaluation_Question_Group_Enum.MaterialsAndVenue,
            },
          },
        ],
      },
      TRAINING_RATING: {
        answers: [
          {
            id: chance.guid(),
            answer: chance.sentence(),
            profile: {
              id: chance.guid(),
              fullName: chance.name(),
              avatar: null,
              archived: false,
            },
            question: {
              questionKey: 'QUESTION_KEY_3',
              type: Course_Evaluation_Question_Type_Enum.Text,
              group: Course_Evaluation_Question_Group_Enum.MaterialsAndVenue,
            },
          },
        ],
      },
      TRAINING_RELEVANCE: {
        answers: [
          {
            id: chance.guid(),
            answer: chance.sentence(),
            profile: {
              id: chance.guid(),
              fullName: chance.name(),
              avatar: null,
              archived: false,
            },
            question: {
              questionKey: 'QUESTION_KEY_4',
              type: Course_Evaluation_Question_Type_Enum.Text,
              group: Course_Evaluation_Question_Group_Enum.MaterialsAndVenue,
            },
          },
        ],
      },
      UNGROUPED: {
        answers: [
          {
            id: chance.guid(),
            answer: chance.sentence(),
            profile: {
              id: chance.guid(),
              fullName: 'John Doe',
              avatar: null,
              archived: false,
            },
            question: {
              questionKey: 'QUESTION_KEY_5',
              type: Course_Evaluation_Question_Type_Enum.Text,
              group: Course_Evaluation_Question_Group_Enum.MaterialsAndVenue,
            },
          },
        ],
      },
    },
  })

describe('SummaryDocument', () => {
  it('apply foreign script fonts for each trainer individually', async () => {
    const props = {
      course: buildCourseForSummaryDocument({
        overrides: {
          trainers: [
            {
              id: chance.guid(),
              course_id: 0,
              profile: buildProfile({
                overrides: {
                  familyName: 'Գրիգորյան',
                  fullName: 'Արամ Գրիգորյան',
                  givenName: 'Արամ',
                },
              }),
              status: Course_Invite_Status_Enum.Accepted,
              type: Course_Trainer_Type_Enum.Leader,
            },
            {
              id: chance.guid(),
              course_id: 0,
              profile: buildProfile({
                overrides: {
                  familyName: 'კიკნაძე',
                  fullName: 'Արամ Գրիգորյան',
                  givenName: 'გიორგი',
                },
              }),
              status: Course_Invite_Status_Enum.Accepted,
              type: Course_Trainer_Type_Enum.Assistant,
            },
            {
              id: chance.guid(),
              course_id: 0,
              profile: buildProfile({
                overrides: {
                  fullName: 'محمد أحمد',
                  familyName: 'أحمد',
                  givenName: 'محمد',
                },
              }),
              status: Course_Invite_Status_Enum.Accepted,
              type: Course_Trainer_Type_Enum.Moderator,
            },
          ],
        },
      }),

      grouped: buildGroupedPropForSummaryDocument(),
      injuryQuestion: { no: 0, yes: 0 },
      isRestricted: false,
      participants: [],
      trainerAnswers: [],
      ungrouped: {},
    }

    _render(<SummaryDocument {...props} />)

    await waitFor(() => {
      expect(screen.getByText('Արամ Գրիգորյան')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.ARMENIAN,
      })
    })

    await waitFor(() => {
      expect(screen.getByText('გიორგი კიკნაძე')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.GEORGIAN,
      })
    })

    await waitFor(() => {
      expect(screen.getByText('محمد أحمد')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.ARABIC,
      })
    })
  })

  it('apply default font for trainers', async () => {
    const props = {
      course: buildCourseForSummaryDocument({
        overrides: {
          trainers: [
            {
              id: chance.guid(),
              course_id: 0,
              profile: buildProfile({
                overrides: {
                  familyName: 'Smith',
                  fullName: 'John Smith',
                  givenName: 'John',
                },
              }),
              status: Course_Invite_Status_Enum.Accepted,
              type: Course_Trainer_Type_Enum.Leader,
            },
            {
              id: chance.guid(),
              course_id: 0,
              profile: buildProfile({
                overrides: {
                  familyName: 'Жуков',
                  fullName: 'Владимир Жуков',
                  givenName: 'Владимир',
                },
              }),
              status: Course_Invite_Status_Enum.Accepted,
              type: Course_Trainer_Type_Enum.Assistant,
            },
            {
              id: chance.guid(),
              course_id: 0,
              profile: buildProfile({
                overrides: {
                  familyName: 'Popescu',
                  fullName: 'Ștefan Popescu',
                  givenName: 'Ștefan',
                },
              }),
              status: Course_Invite_Status_Enum.Accepted,
              type: Course_Trainer_Type_Enum.Moderator,
            },
          ],
        },
      }),

      grouped: buildGroupedPropForSummaryDocument(),
      injuryQuestion: { no: 0, yes: 0 },
      isRestricted: false,
      participants: [],
      trainerAnswers: [],
      ungrouped: {},
    }

    _render(<SummaryDocument {...props} />)

    await waitFor(() => {
      const style = window.getComputedStyle(screen.getByText('John Smith'))
      expect(style.getPropertyValue('font-family')).toBe('')
    })

    await waitFor(() => {
      const style = window.getComputedStyle(screen.getByText('Владимир Жуков'))
      expect(style.getPropertyValue('font-family')).toBe('')
    })

    await waitFor(() => {
      const style = window.getComputedStyle(screen.getByText('Ștefan Popescu'))
      expect(style.getPropertyValue('font-family')).toBe('')
    })
  })

  it('apply foreign script fonts for each participant individually', async () => {
    const props = {
      course: buildCourseForSummaryDocument({
        overrides: {
          trainers: [],
        },
      }),

      grouped: buildGroupedPropForSummaryDocument(),
      injuryQuestion: { no: 0, yes: 0 },
      isRestricted: false,
      participants: [
        {
          id: chance.guid(),
          profile: {
            id: chance.guid(),
            fullName: 'محمد أحمد',
            archived: false,
          },
          attended: true,
        },
        {
          id: chance.guid(),
          profile: {
            id: chance.guid(),
            fullName: 'Արամ Գրիգորյան',
            archived: false,
          },
          attended: true,
        },
        {
          id: chance.guid(),
          profile: {
            id: chance.guid(),
            fullName: 'გიორგი კიკნაძე',
            archived: false,
          },
          attended: true,
        },
        {
          id: chance.guid(),
          profile: {
            id: chance.guid(),
            fullName: '太郎 鈴木',
            archived: false,
          },
          attended: true,
        },
        {
          id: chance.guid(),
          profile: {
            id: chance.guid(),
            fullName: 'דוד כהן',
            archived: false,
          },
          attended: true,
        },
        {
          id: chance.guid(),
          profile: {
            id: chance.guid(),
            fullName: 'アレックス',
            archived: false,
          },
          attended: true,
        },
        {
          id: chance.guid(),
          profile: { id: chance.guid(), fullName: '민준 김', archived: false },
          attended: true,
        },
        {
          id: chance.guid(),
          profile: {
            id: chance.guid(),
            fullName: 'ສຸກສົມ ບຸນເຮັມ',
            archived: false,
          },
          attended: true,
        },
        {
          id: chance.guid(),
          profile: {
            id: chance.guid(),
            fullName: 'မောင် တင်',
            archived: false,
          },
          attended: true,
        },
        {
          id: chance.guid(),
          profile: {
            id: chance.guid(),
            fullName: 'สมชาย ศรีสุข',
            archived: false,
          },
          attended: true,
        },
      ],
      trainerAnswers: [],
      ungrouped: {},
    }

    _render(<SummaryDocument {...props} />)

    await waitFor(() => {
      expect(screen.getByText('محمد أحمد')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.ARABIC,
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Արամ Գրիգորյան')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.ARMENIAN,
      })
    })

    await waitFor(() => {
      expect(screen.getByText('გიორგი კიკნაძე')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.GEORGIAN,
      })
    })

    await waitFor(() => {
      expect(screen.getByText('太郎 鈴木')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.CHINESE,
      })
    })

    await waitFor(() => {
      expect(screen.getByText('דוד כהן')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.HEBREW,
      })
    })

    await waitFor(() => {
      expect(screen.getByText('アレックス')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.JAPANESE,
      })
    })

    await waitFor(() => {
      expect(screen.getByText('민준 김')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.KOREAN,
      })
    })

    await waitFor(() => {
      expect(screen.getByText('ສຸກສົມ ບຸນເຮັມ')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.LAO,
      })
    })

    await waitFor(() => {
      expect(screen.getByText('မောင် တင်')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.MYANMAR,
      })
    })

    await waitFor(() => {
      expect(screen.getByText('สมชาย ศรีสุข')).toHaveStyle({
        fontWeight: 500,
        fontFamily: ForeignScript.THAI,
      })
    })
  })

  it('renders curriculum in document', async () => {
    const props = {
      course: buildCourseForSummaryDocument({
        overrides: {
          trainers: [],
          curriculum: [
            {
              id: chance.string(),
              name: 'Theory Level One ANZ',
              displayName: 'Theory Module',
              mandatory: true,
              lessons: {
                items: [
                  {
                    name: 'Theory Lesson 1',
                    covered: true,
                  },
                  {
                    name: 'Theory Lesson 2',
                    covered: true,
                  },
                  {
                    name: 'Theory Lesson 3',
                    covered: true,
                  },
                ],
              },
            },
            {
              id: chance.guid(),
              name: 'Communication Level One ANZ',
              displayName: 'Communication Module',
              mandatory: false,
              lessons: {
                items: [
                  {
                    name: 'Communication Lesson 1',
                    covered: true,
                  },
                  {
                    name: 'Communication Lesson 2',
                    covered: false,
                  },
                ],
              },
            },
          ],
        },
      }),

      grouped: buildGroupedPropForSummaryDocument(),
      injuryQuestion: { no: 0, yes: 0 },
      isRestricted: false,
      participants: [],
      trainerAnswers: [],
      ungrouped: {},
    }

    _render(<SummaryDocument {...props} />)

    // Theory should be in the document
    await waitFor(() => {
      expect(screen.getByText('Theory Module')).toBeInTheDocument()
    })

    // All theory lessons should be in the document because the module is mandatory and all lessons are covered
    await waitFor(() => {
      props.course.curriculum[0].lessons.items.forEach(
        (item: { name: Matcher }) => {
          expect(screen.getByText(item.name)).toBeInTheDocument()
        },
      )
    })

    // Communitcation should be in the document
    await waitFor(() => {
      expect(screen.getByText('Communication Module')).toBeInTheDocument()
    })

    // Comunication lesson 1 should be in the document because it is covered
    await waitFor(() => {
      expect(screen.getByText('Communication Lesson 1')).toBeInTheDocument()
    })

    // Comunication lesson 2 should not be in the document because it is not covered
    await waitFor(() => {
      expect(
        screen.queryByText('Communication Lesson 2'),
      ).not.toBeInTheDocument()
    })
  })
})
