import { styled } from '@mui/material'
import { NavLink } from 'react-router-dom'

export const StyledNavLink = styled(NavLink)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),

  '&.active': {
    fontWeight: '600',
  },
}))
