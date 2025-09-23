import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Container,
} from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export enum Tables {
  ACTIONABLE = 0,
  COURSES,
}

type TabMenuProps = {
  selectedTab: Tables
  setSelectedTab: (selectedTab: Tables) => void
}

export const TableMenu: React.FC<TabMenuProps> = ({
  selectedTab,
  setSelectedTab,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { t } = useTranslation()

  const onActionsClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    },
    [],
  )

  const onClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const actions = useMemo(() => {
    return [
      {
        label: t('pages.my-courses.actionable-courses-title'),
        value: Tables.ACTIONABLE,
      },
      {
        label: t('pages.my-courses.courses-title'),
        value: Tables.COURSES,
      },
    ]
  }, [t])

  const dimensions = window.innerWidth * 0.8

  return (
    <Container disableGutters sx={{ mt: 3 }}>
      <Button
        onClick={onActionsClick}
        variant="outlined"
        fullWidth
        sx={{
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
        }}
        endIcon={<ArrowDropDownIcon />}
      >
        <Typography
          variant="body1"
          color="primary"
          fontWeight={500}
          textAlign="left"
        >
          {actions.find(el => el.value === selectedTab)?.label}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        sx={{ width: dimensions }}
      >
        {actions.map(action => (
          <MenuItem
            key={action.label}
            onClick={() => {
              setSelectedTab(action.value)
              onClose()
            }}
          >
            <ListItemText sx={{ width: dimensions }}>
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
