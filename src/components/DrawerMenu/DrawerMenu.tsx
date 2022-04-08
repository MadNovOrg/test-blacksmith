import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import { Link, Box, Button, Drawer, IconButton } from '@mui/material'
import { styled } from '@mui/system'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useToggle } from 'react-use'

import { useAuth } from '@app/context/auth'

import { Avatar } from '../Avatar'

const StyledLink = styled(Link)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}))

export const DrawerMenu: React.FC = () => {
  const { t } = useTranslation()
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
          <Avatar src={profile?.avatar} name={profile?.fullName} />
          <Button
            onClick={() => console.log('open')}
            sx={{ ml: 1 }}
            endIcon={<ArrowDropDownIcon />}
            color="info"
          >
            {profile?.fullName}
          </Button>
        </Box>

        <Box px={5} py={3} display="flex" flexDirection="column">
          <StyledLink href="/courses" variant="body2" onClick={toggle}>
            {t('courses')}
          </StyledLink>
        </Box>
      </Drawer>
    </>
  )
}
