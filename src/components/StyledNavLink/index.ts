import { styled } from '@mui/material'
import { NavLink } from 'react-router-dom'

export const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: 'inherit',
  padding: theme.spacing(0.5, 3),

  [theme.breakpoints.down('lg')]: {
    padding: 0,
    '&.MuiLink-root': {
      marginBottom: theme.spacing(3),
    },
  },

  '&.active': {
    fontWeight: '600',
  },
}))
