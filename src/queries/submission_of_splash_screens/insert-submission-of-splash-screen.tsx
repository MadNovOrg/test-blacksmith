import { gql } from 'urql'

export const INSERT_SUBMISSION_OF_SPLASH_SCREEN = gql`
  mutation InsertSubmissionOfSplashScreen(
    $profileId: uuid!
    $splashScreen: splash_screens_enum!
  ) {
    insert_submission_of_splash_screens_one(
      object: { profile_id: $profileId, splash_screen: $splashScreen }
      on_conflict: {
        constraint: submission_of_splash_screens_splash_screen_profile_id_key
        update_columns: []
      }
    ) {
      id
    }
  }
`
