import { styled } from '@mui/system'
import { NavLink } from 'react-router-dom'

export const StyledSubNavLink = styled(NavLink)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),

  '&.active': {
    fontWeight: '600',
    backgroundColor: theme.palette.grey[100],
    borderRadius: 4,
  },
}))
