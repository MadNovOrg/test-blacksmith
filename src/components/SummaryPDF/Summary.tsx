import pdf from '@react-pdf/renderer'
import { groupBy } from 'lodash-es'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Course,
  CourseModule,
  CourseParticipant,
  CourseEvaluationQuestionType,
  CourseEvaluationQuestionGroup,
  CourseEvaluationTrainerAnswers,
  CourseEvaluationInjuryQuestion,
  CourseEvaluationGroupedQuestion,
  CourseEvaluationUngroupedQuestion,
} from '@app/types'

const { Document, Font, Page, StyleSheet, Text, View } = pdf

type SummaryDocumentProps = {
  course: Course
  participants: CourseParticipant[]
  courseModules: CourseModule[]
  grouped: CourseEvaluationGroupedQuestion
  ungrouped: CourseEvaluationUngroupedQuestion
  injuryQuestion: CourseEvaluationInjuryQuestion
  trainerAnswers: CourseEvaluationTrainerAnswers
}

type Answer = {
  id: string
  answer: string
  question: {
    questionKey: string
    type: CourseEvaluationQuestionType
    group: CourseEvaluationQuestionGroup
  }
}

type PDFRatingSummaryProps = {
  key: string
  questionKey: string
  answers: Answer[]
}

type PDFRatingAnswerProps = {
  label: string
  value: number
  backgroundColor: string
}

type FlexGroupProps = {
  data: React.ReactElement[]
  type?: 'column' | 'row'
  groupSize?: number
}

const MAX_FLEX_ELEMENTS = 3

const groups = [
  CourseEvaluationQuestionGroup.TRAINING_RATING,
  CourseEvaluationQuestionGroup.TRAINING_RELEVANCE,
  CourseEvaluationQuestionGroup.TRAINER_STANDARDS,
  CourseEvaluationQuestionGroup.MATERIALS_AND_VENUE,
]

const booleanQuestionTypes = [
  CourseEvaluationQuestionType.BOOLEAN,
  CourseEvaluationQuestionType.BOOLEAN_REASON_Y,
  CourseEvaluationQuestionType.BOOLEAN_REASON_N,
]

const answerLabels = ['excellent', 'good', 'average', 'fair', 'poor']
const answerColors: { [key: string]: string } = {
  excellent: '#59C13D',
  good: '#9EB934',
  average: '#F2A61F',
  fair: 'rgba(255, 0, 0, 0.6)',
  poor: 'rgba(255, 0, 0, 0.8)',
}

Font.register({
  family: 'Inter',
  fonts: [
    {
      fontWeight: 'normal',
      src: 'https://fonts.gstatic.com/s/inter/v11/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff',
    },
    {
      fontWeight: 'bold',
      src: 'https://fonts.gstatic.com/s/inter/v11/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff',
    },
  ],
})

const styles = StyleSheet.create({
  strikeThrough: {
    textDecoration: 'line-through',
    textDecorationColor: 'red',
  },
  page: {
    textAlign: 'justify',
    fontFamily: 'Inter',
    backgroundColor: 'rgb(245, 245, 245)',
    color: 'rgba(0, 0, 0, 0.87)',
    padding: '10mm',
    fontSize: '8px',
  },
  mainView: {
    padding: '20px',
  },
  section: {
    marginBottom: '15px',
  },
  centeredSection: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  text: {
    fontSize: '8px',
    marginBottom: '5px',
  },
  largerText: {
    fontSize: '10px',
    marginBottom: '5px',
  },
  largestText: {
    fontSize: '12px',
    marginBottom: '15px',
  },
  smallerText: {
    fontSize: '6px',
  },
  bold: {
    fontWeight: 900,
  },
  title: {
    marginBottom: '20',
    fontSize: '24px',
  },
  courseNameText: {
    fontSize: '18px',
  },
  flexRow: {
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'space-between',
  },
  flexColumn: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    paddingRight: '5px',
  },
  questionsSection: {
    width: '60%',
    marginLeft: '20%',
  },
  question: {
    padding: '3%',
    width: '100%',
    backgroundColor: 'white',
  },
  ratingAnswer: {
    width: '100%',
    paddingTop: '2px',
    paddingBottom: '2px',
    alignItems: 'center',
  },
  progressBar: {
    width: '70%',
    backgroundColor: '#f5f5f5',
    height: '8px',
  },
  participantAnswer: {
    backgroundColor: '#ebf0fb',
    padding: '4px',
    marginTop: '2px',
    marginBottom: '2px',
  },
  booleanAnswer: {
    width: '47%',
    height: '30px',
    backgroundColor: 'white',
    textAlign: 'center',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  markedAnswer: {
    backgroundColor: '#59C13D',
  },
})

const FlexGroup: React.FC<FlexGroupProps> = ({
  data,
  type = 'row',
  groupSize = MAX_FLEX_ELEMENTS,
}) => {
  const groups = []
  for (let i = 0; i < data.length; i += groupSize) {
    groups.push(data.slice(i, i + groupSize))
  }

  const flexStyle = type === 'row' ? [styles.flexRow] : [styles.flexColumn]
  const result = groups.map((group, idx) => (
    <View key={idx} style={flexStyle}>
      {group.map((g, idx) => (
        <View key={idx} style={{ width: `${100 / groupSize}%` }}>
          {g}
        </View>
      ))}
    </View>
  ))

  return <Fragment>{result}</Fragment>
}

const PDFRatingAnswer: React.FC<PDFRatingAnswerProps> = ({
  label,
  value,
  backgroundColor,
}) => {
  const { t } = useTranslation()

  return (
    <View key={label} style={[styles.flexRow, styles.ratingAnswer]}>
      <View style={styles.progressBar}>
        <View
          style={{ height: '100%', backgroundColor, width: `${value}%` }}
        ></View>
      </View>
      <View style={{ width: '20%', textAlign: 'right' }}>
        <Text>{t(label)}</Text>
      </View>
      <View style={{ width: '10%', paddingLeft: '15px', textAlign: 'left' }}>
        <Text>{value}</Text>
      </View>
    </View>
  )
}

const PDFRatingSummary: React.FC<PDFRatingSummaryProps> = ({
  answers,
  questionKey,
}) => {
  const { t } = useTranslation()

  const groups = groupBy(answers, a => a.answer)
  const num = answers?.length

  const values = [
    ((groups[5]?.length ?? 0) / num) * 100,
    ((groups[4]?.length ?? 0) / num) * 100,
    ((groups[3]?.length ?? 0) / num) * 100,
    ((groups[2]?.length ?? 0) / num) * 100,
    ((groups[1]?.length ?? 0) / num) * 100,
  ]

  return (
    <View
      wrap={false}
      key={questionKey}
      style={[styles.question, styles.centeredSection, styles.section]}
    >
      <View style={styles.flexRow}>
        <Text style={[styles.text, styles.bold]}>
          {t(`course-evaluation.questions.${questionKey}`)}
        </Text>

        <View>
          <Text style={styles.centeredSection}>{values[0]}%</Text>
          <Text style={[styles.smallerText, { color: 'green' }]}>
            {t('common.excellent')}
          </Text>
        </View>
      </View>

      {answerLabels.map((label, index) => (
        <PDFRatingAnswer
          key={label}
          label={label}
          value={values[index]}
          backgroundColor={answerColors[label]}
        />
      ))}
    </View>
  )
}

export const SummaryDocument: React.FC<SummaryDocumentProps> = props => {
  const { t } = useTranslation()
  const {
    course,
    courseModules,
    grouped,
    ungrouped,
    injuryQuestion,
    trainerAnswers,
    participants,
  } = props

  const groupedCourseModules = groupBy(
    courseModules,
    a => a.module.moduleGroup.name
  )
  const moduleGroups = Object.keys(groupedCourseModules)

  participants.sort((p1, p2) =>
    !p1.attended && p2.attended ? 1 : p1.attended && !p2.attended ? -1 : 0
  )
  for (const g of moduleGroups) {
    groupedCourseModules[g].sort((m1, m2) =>
      !m1.covered && m2.covered ? 1 : m1.covered && !m2.covered ? -1 : 0
    )
  }

  const leadTrainer = course?.trainers
    ? course.trainers[0]
    : { profile: { fullName: '' } }
  const trainers = course?.trainers?.slice(1) ?? []

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View id="content" style={styles.mainView}>
          <View id="header">
            <Text style={[styles.title, styles.textAlignCenter, styles.bold]}>
              {t('pages.course-details.tabs.evaluation.title')}
            </Text>

            <Text
              style={[
                styles.text,
                styles.courseNameText,
                styles.textAlignCenter,
                styles.bold,
              ]}
            >
              {course.name}
            </Text>

            <Text style={styles.textAlignCenter}>
              {t(`common.course-types.${course.type}`)} Course
            </Text>

            <View
              style={[styles.section, { marginTop: '30px', width: '100%' }]}
            >
              <Text style={[styles.largestText, styles.bold]}>
                {t('course-evaluation.pdf-export.trainers', {
                  count: trainers.length + 1,
                })}
              </Text>

              <Text style={styles.largerText}>
                {t('course-evaluation.pdf-export.lead-trainer')}:{' '}
                {leadTrainer?.profile.fullName}
              </Text>

              <FlexGroup
                type="column"
                data={trainers.map(t => (
                  <Text key={t.id} style={styles.text}>
                    {t.profile.fullName}
                  </Text>
                ))}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.largestText, styles.bold]}>
                {t('course-evaluation.pdf-export.schedule-and-venue')}
              </Text>

              <Text style={styles.text}>
                {t('course-evaluation.pdf-export.started-at')}:{' '}
                {t('dates.withTime', { date: course.schedule[0].start })}
              </Text>
              <Text style={styles.text}>
                {t('course-evaluation.pdf-export.ended-at')}:{' '}
                {t('dates.withTime', { date: course.schedule[0].end })}
              </Text>

              <Text style={styles.text}>
                {t('course-evaluation.pdf-export.venue')}:{' '}
                {course.schedule[0].venue
                  ? [
                      course.schedule[0].venue?.name,
                      course.schedule[0].venue?.city,
                    ].join(', ')
                  : t('common.course-delivery-type.VIRTUAL')}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.largestText, styles.bold]}>
                {t('course-evaluation.pdf-export.course-modules')}
              </Text>

              {moduleGroups.map(groupName => (
                <View key={groupName} wrap={false}>
                  <Text style={[styles.largerText, styles.bold]}>
                    {groupName}
                  </Text>

                  <FlexGroup
                    type="column"
                    data={groupedCourseModules[groupName].map(
                      ({ covered, module }) => (
                        <Text
                          key={module.id}
                          style={[
                            styles.text,
                            covered ? {} : styles.strikeThrough,
                          ]}
                        >
                          {module.name}
                        </Text>
                      )
                    )}
                  />
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={[styles.largestText, styles.bold]}>
                {t('course-evaluation.pdf-export.course-participants', {
                  count: participants.length,
                })}
              </Text>

              <FlexGroup
                type="column"
                data={participants.map(
                  ({ id, profile: { fullName: name }, attended }) => (
                    <Text
                      key={id}
                      style={[
                        styles.text,
                        attended ? {} : styles.strikeThrough,
                      ]}
                    >
                      {name}
                    </Text>
                  )
                )}
              />
            </View>
          </View>

          <View break style={[styles.section, styles.questionsSection]}>
            <Text
              style={[styles.largestText, styles.textAlignCenter, styles.bold]}
            >
              {t('evaluation')}
            </Text>

            {groups.map(g => (
              <Fragment key={g}>
                <Text style={styles.largerText}>
                  {t(`course-evaluation.groups.${g}`)}
                </Text>
                {Object.keys(grouped[g]).map(questionKey => (
                  <PDFRatingSummary
                    key={questionKey}
                    questionKey={questionKey}
                    answers={grouped[g][questionKey]}
                  />
                ))}
              </Fragment>
            ))}
          </View>

          <View break style={[styles.section, styles.questionsSection]}>
            <Text
              style={[styles.largestText, styles.textAlignCenter, styles.bold]}
            >
              {t('pages.course-details.tabs.evaluation.attendee-feedback')}
            </Text>

            <Text style={styles.largerText}>
              {t(`course-evaluation.questions.ANY_INJURIES`)}
            </Text>

            <View
              style={[styles.question, styles.centeredSection, styles.section]}
            >
              <PDFRatingAnswer
                label={'yes'}
                value={injuryQuestion.yes}
                backgroundColor="#cfd4df"
              />
              <PDFRatingAnswer
                label={'no'}
                value={injuryQuestion.no}
                backgroundColor="#cfd4df"
              />
            </View>

            {Object.keys(ungrouped).map(questionKey => {
              if (questionKey === 'SIGNATURE') return null

              const answers = ungrouped[questionKey]

              return (
                <View wrap={false} key={questionKey}>
                  <Text style={styles.largerText}>
                    {t(`course-evaluation.questions.${questionKey}`)}
                  </Text>

                  <View
                    style={[
                      styles.question,
                      styles.centeredSection,
                      styles.section,
                    ]}
                  >
                    {answers.map(({ id, answer }) => (
                      <Text
                        wrap={false}
                        key={id}
                        style={styles.participantAnswer}
                      >
                        {answer || t('course-evaluation.pdf-export.no-answer')}
                      </Text>
                    ))}
                  </View>
                </View>
              )
            })}
          </View>

          <View break style={[styles.section, styles.questionsSection]}>
            <Text
              style={[styles.largestText, styles.textAlignCenter, styles.bold]}
            >
              {t('pages.course-details.tabs.evaluation.trainer-feedback')}
            </Text>

            {trainerAnswers?.map(a => {
              if (booleanQuestionTypes.includes(a.question.type)) {
                const answer = a.answer.split('-')
                const shouldHaveReason =
                  (a.question.type ===
                    CourseEvaluationQuestionType.BOOLEAN_REASON_Y &&
                    answer[0] === 'YES') ||
                  (a.question.type ===
                    CourseEvaluationQuestionType.BOOLEAN_REASON_N &&
                    answer[0] === 'NO')

                return (
                  <View wrap={false} key={a.id}>
                    <Text style={styles.largerText}>
                      {t(
                        `course-evaluation.questions.${a.question.questionKey}`
                      )}
                    </Text>

                    <View style={[styles.section, styles.flexRow]}>
                      <View
                        wrap={false}
                        style={[
                          styles.booleanAnswer,
                          answer[0] === 'YES' ? styles.markedAnswer : {},
                        ]}
                      >
                        <Text>{t('yes')}</Text>
                      </View>

                      <View
                        wrap={false}
                        style={[
                          styles.booleanAnswer,
                          answer[0] === 'NO' ? styles.markedAnswer : {},
                        ]}
                      >
                        <Text>{t('no')}</Text>
                      </View>
                    </View>

                    {shouldHaveReason ? (
                      <View
                        wrap={false}
                        style={[
                          styles.question,
                          styles.centeredSection,
                          styles.section,
                        ]}
                      >
                        <Text style={styles.participantAnswer}>
                          {answer[1] ||
                            t('course-evaluation.pdf-export.no-answer')}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )
              }

              if (a.question.type === CourseEvaluationQuestionType.TEXT) {
                return (
                  <View wrap={false} key={a.id}>
                    <Text style={styles.largerText}>
                      {t(
                        `course-evaluation.questions.${a.question.questionKey}`
                      )}
                    </Text>

                    <View
                      style={[
                        styles.question,
                        styles.centeredSection,
                        styles.section,
                      ]}
                    >
                      <Text
                        wrap={false}
                        key={a.id}
                        style={styles.participantAnswer}
                      >
                        {a.answer ||
                          t('course-evaluation.pdf-export.no-answer')}
                      </Text>
                    </View>
                  </View>
                )
              }

              return null
            })}
          </View>
        </View>
      </Page>
    </Document>
  )
}
