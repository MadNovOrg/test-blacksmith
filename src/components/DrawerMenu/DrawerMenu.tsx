import React from 'react'
import { Link, Avatar, Box, Button, Drawer, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useToggle } from 'react-use'
import { styled } from '@mui/system'

import { useAuth } from '@app/context/auth'

const StyledLink = styled(Link)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}))

export const DrawerMenu: React.FC = () => {
  const { profile } = useAuth()
  const [open, toggle] = useToggle(false)

  return (
    <>
      <IconButton onClick={toggle}>
        <MenuIcon />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={toggle}>
        <Box mb={2} width="90vw">
          <IconButton onClick={toggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          mx={5}
          pb={1}
          display="flex"
          sx={{ borderBottom: 1, borderBottomColor: 'lime.500' }}
        >
          <Avatar
            alt="avatar"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
          />
          <Button
            onClick={() => console.log('open')}
            sx={{ marginLeft: 1 }}
            endIcon={<ArrowDropDownIcon />}
            color="info"
          >
            {profile?.fullName}
          </Button>
        </Box>

        <Box px={5} py={3} display="flex" flexDirection="column">
          <StyledLink href="/trainer-base" variant="body2" onClick={toggle}>
            Trainer Base
          </StyledLink>

          <Box pl={2}>
            <StyledLink
              href="/trainer-base/course"
              variant="body2"
              onClick={toggle}
            >
              My Courses
            </StyledLink>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
