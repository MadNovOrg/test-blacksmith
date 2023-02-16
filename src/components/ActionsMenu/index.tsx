import {
  Button,
  Container,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import React, { useCallback } from 'react'

type Action<T> = {
  icon: React.ReactNode
  label: string
  onClick: (item: T) => void
}

type ActionsMenuProperties<T> = {
  item: T
  label: string
  actions: Action<T>[]
}

export const ActionsMenu = <T,>({
  label,
  actions,
  item,
}: ActionsMenuProperties<T>) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const onActionsClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    },
    []
  )

  const onClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const onClick = useCallback(
    (action: Action<T>) => {
      setAnchorEl(null)
      action.onClick(item)
    },
    [item]
  )

  return (
    <Container>
      <Button onClick={onActionsClick} variant="text">
        {label}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
        {actions.map(action => (
          <MenuItem key={action.label} onClick={() => onClick(action)}>
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText>
              <Typography variant="body1" color="primary" fontWeight={500}>
                {action.label}
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Container>
  )
}
