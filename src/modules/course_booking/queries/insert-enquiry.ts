import { gql } from 'graphql-request'

export default gql`
  mutation InsertCourseEnquiry($enquiry: course_enquiry_insert_input!) {
    insert_course_enquiry(objects: [$enquiry]) {
      affected_rows
    }
  }
`
