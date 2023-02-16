import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import { Box, Drawer, IconButton } from '@mui/material'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useToggle } from 'react-use'

import { useAuth } from '@app/context/auth'

import { NavLinks } from '../NavLinks'

import { ProfileMenu } from './ProfileMenu'

export const DrawerMenu: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { verified, profile } = useAuth()
  const [open, toggle] = useToggle(false)
  const location = useLocation()

  useEffect(() => {
    toggle(false)
  }, [location, toggle])

  return (
    <>
      <IconButton onClick={toggle} aria-label="Open menu">
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggle}
        data-testid="drawer-menu"
      >
        <Box my={2} mx={1} width="80vw">
          <IconButton onClick={toggle} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>

        {profile && <ProfileMenu profile={profile} />}
        {verified && (
          <Box px={5} py={3} display="flex" flexDirection="column">
            <NavLinks />
          </Box>
        )}
      </Drawer>
    </>
  )
}
