import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Container, Link } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

type ManagementProps = unknown

const menu = [
  {
    to: 'calendar',
    title: 'My Calendar',
  },
  {
    to: 'availability',
    title: 'Manage Availability',
  },
  {
    to: 'expenses',
    title: 'Manage Expenses',
  },
]

export const Management: React.FC<ManagementProps> = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Box display="flex" flexDirection="column">
        <Box display="flex">
          <Button
            variant="text"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        </Box>

        <Box display="flex">
          <Box width={250} display="flex" flexDirection="column" pt={8} pr={4}>
            {menu.map(m => (
              <Link key={m.to} href={m.to} gutterBottom variant="body2">
                {m.title}
              </Link>
            ))}
          </Box>

          <Box flex={1}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
