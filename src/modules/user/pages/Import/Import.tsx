import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Container, Typography, Button, styled } from '@mui/material'
import { ChangeEvent } from 'react'
import { gql, useSubscription } from 'urql'
import { read, utils } from 'xlsx'

import {
  ImportUsersJobSubscription,
  ImportUsersJobSubscriptionVariables,
} from '@app/generated/graphql'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const IMPORT_USERS_JOB = gql`
  subscription ImportUsersJob($id: uuid!) {
    import_users_job_by_pk(id: $id) {
      id
      result
      status
    }
  }
`

export const Import: React.FC = () => {
  const handleUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return
    }

    const file = e.target.files[0]

    const data = await file.arrayBuffer()

    const workbook = read(data)

    const userSheet = workbook.Sheets[workbook.SheetNames[0]]

    console.log(utils.sheet_to_json(userSheet))
  }

  const [{ data }] = useSubscription<
    ImportUsersJobSubscription,
    ImportUsersJobSubscriptionVariables
  >({
    query: IMPORT_USERS_JOB,
    variables: { id: '698bc907-af7a-4141-92dc-e8c66b4ba5f0' },
  })

  console.log(data)

  return (
    <Container>
      <Typography variant="h2">Import users</Typography>

      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <VisuallyHiddenInput
          type="file"
          onChange={handleUploadChange}
          accept=".xlsx"
        />
      </Button>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Container>
  )
}
