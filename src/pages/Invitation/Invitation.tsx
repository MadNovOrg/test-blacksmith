import React, { useEffect, useState } from 'react'
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  FormHelperText,
  Chip,
} from '@mui/material'
import CalendarIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LoadingButton from '@mui/lab/LoadingButton'
import { gql } from 'graphql-request'

import { Logo } from '@app/components/Logo'

import { gqlRequest } from '@app/lib/gql-request'

import { getServiceAuth } from './auth'

const MUTATION = gql`
  mutation DeclineInvite($inviteId: uuid!) {
    update_course_invites_by_pk(
      pk_columns: { id: $inviteId }
      _set: { status: DECLINED }
    ) {
      id
    }
  }
`

export const InvitationPage = () => {
  const [response, setResponse] = useState('yes')
  const [idToken, setIdToken] = useState<string>()

  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const inviteId = '02f6bc03-4d23-4f0d-8ffc-71886890d599'

  useEffect(() => {
    async function fn() {
      const user = getServiceAuth()
      await user.refreshSessionIfPossible()
      const idToken = user.getSignInUserSession()?.getIdToken().getJwtToken()
      setIdToken(idToken)
    }

    fn()
  }, [])

  const handleSubmit = async () => {
    setIsLoading(true)
    setSubmitError(null)

    try {
      const response = await gqlRequest(MUTATION, { inviteId }, idToken)
      console.log(response)
    } catch (e) {
      const err = e as Error
      console.log(err)
      setSubmitError('Something wrong')
    }

    setIsLoading(false)
  }

  return (
    <Box
      bgcolor="grey.200"
      width="100%"
      height="100%"
      p={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Logo size={80} />

      <Box
        mt={5}
        bgcolor="common.white"
        py={3}
        px={3}
        borderRadius={2}
        width={500}
      >
        <Typography variant="h3" fontWeight="600" color="grey.800" mb={3}>
          Course Registration
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Positive Behaviour Training: Level 1
        </Typography>

        <Typography variant="body2" color="grey.600">
          Short description of course? Ipsum a pellentesque etiam fermentum
          nulla consequat risus pulvinar. Etiam quis at commodo nam lectus purus
          morbi eu amet. Sed accumsan sociis nunc condimentum eu vitae, orci
          urna.
        </Typography>

        <Box mt={3} mb={4}>
          <Chip
            label="6 days until course begins"
            size="small"
            sx={{ borderRadius: 2, mb: 1 }}
          />

          <Box display="flex" mb={2}>
            <Box mr={1} display="flex">
              <CalendarIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>
                Begins 28 February 2022, 1:30 PM
              </Typography>
              <Typography variant="body2" gutterBottom>
                Ends 1 March 2022, 5:00 PM
              </Typography>
              <Typography variant="body2" color="grey.600" gutterBottom>
                Duration 2 days
              </Typography>
            </Box>
          </Box>

          <Box display="flex" mb={2} alignItems="center">
            <Box mr={1} display="flex">
              <PersonIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="body2">Hosted by Elizabeth Bark</Typography>
            </Box>
          </Box>

          <Box display="flex">
            <Box mr={1}>
              <LocationOnIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2">South Yorkshire (S64)</Typography>
              <Typography variant="body2">South Yorkshire S64</Typography>
              <Typography variant="body2">8QG United Kingdom</Typography>
            </Box>
          </Box>
        </Box>

        <Box mt={3} mb={2}>
          <Typography variant="subtitle2"></Typography>

          <FormControl fullWidth>
            <FormLabel id="response-q">Are you able to attend?</FormLabel>
            <RadioGroup
              aria-labelledby="response-q"
              defaultValue="yes"
              name="response"
              sx={{ mt: 1 }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setResponse(e.target.value)
              }
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label="I will attend"
                sx={{
                  border: 1,
                  borderColor: 'grey.700',
                  ml: 0,
                  height: 50,
                  borderBottom: 0,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="I will not attend"
                sx={{
                  border: 1,
                  borderColor: 'grey.700',
                  ml: 0,
                  height: 50,
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                }}
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <LoadingButton
          loading={isLoading}
          type="button"
          variant="contained"
          color="primary"
          data-testid="login-submit"
          size="large"
          onClick={handleSubmit}
        >
          {response === 'yes' ? 'Continue to registration' : 'Send response'}
        </LoadingButton>

        {submitError && (
          <FormHelperText sx={{ mt: 2 }} error>
            {submitError}
          </FormHelperText>
        )}
      </Box>
    </Box>
  )
}
