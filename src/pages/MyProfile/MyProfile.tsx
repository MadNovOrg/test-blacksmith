import { Box, Button, Typography } from '@mui/material'
import React from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION as LinkGo1Profile,
  ResponseType as LinkGo1ProfileResponseType,
} from '@app/queries/user/link-go1-profile'

type MyProfilePageProps = unknown

export const MyProfilePage: React.FC<MyProfilePageProps> = () => {
  const fetcher = useFetcher()

  const linkGo1 = async () => {
    const data = await fetcher<LinkGo1ProfileResponseType>(LinkGo1Profile)
    console.log(data.linkGo1)
  }

  return (
    <Box>
      <Typography variant="h4">My Profile</Typography>

      <Box mt={3} display="flex">
        <Button variant="contained" onClick={linkGo1}>
          Link Go1 Profile
        </Button>
      </Box>
    </Box>
  )
}
