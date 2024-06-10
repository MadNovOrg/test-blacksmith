import { gql } from 'graphql-request'

export const EXPORT_BLENDED_LEARNING_ATTENDEES = gql`
  fragment BlendedLearningExportDataDetails on BlendedLearningExportDataOutput {
    courseName
    courseCode
    courseStartDate
    courseEndDate
    commissioningOrganisationName
    leadTrainerName

    attendees {
      userName
      email
      blendedLearningStatus
      blendedLearningPass
      blendedLearningStartDate
      blendedLearningEndDate
    }
  }

  query ExportBlendedLearningCourseData(
    $input: BlendedLearningExportDataInput!
  ) {
    attendees: exportBlendedLearningCourseData(input: $input) {
      ...BlendedLearningExportDataDetails
    }
  }
`
