import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { TabList } from '@mui/lab'
import {
  Tab,
  useTheme,
  useMediaQuery,
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Container,
} from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'

type TabMenuProps = {
  courseParticipantsTotal: number | undefined
  pendingTotal: number
  declinedTotal: number
  waitListTotal: number
  selectedTab: string
  isOpenCourse: boolean
  setSelectedTab: (selectedTab: string) => void
}

export const TabMenu: React.FC<TabMenuProps> = ({
  courseParticipantsTotal,
  pendingTotal,
  declinedTotal,
  waitListTotal,
  selectedTab,
  isOpenCourse,
  setSelectedTab,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const { t } = useTranslation()
  const { acl } = useAuth()
  const selectedInt = parseInt(selectedTab) ?? 0

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const onActionsClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    },
    []
  )

  const onClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const pendingDeclined = useMemo(() => {
    return !isOpenCourse
      ? [
          {
            label: t('pages.course-participants.tabs.pending', {
              number: pendingTotal,
            }),
            value: '1',
            dataTestId: 'tabPending',
          },
          {
            label: t('pages.course-participants.tabs.declined', {
              number: declinedTotal,
            }),
            value: '2',
            dataTestId: 'tabDeclined',
          },
        ]
      : []
  }, [declinedTotal, isOpenCourse, pendingTotal, t])

  const waitList = useMemo(() => {
    return isOpenCourse && acl.canSeeWaitingLists()
      ? [
          {
            label: t('pages.course-participants.tabs.waitlist', {
              number: waitListTotal,
            }),
            value: '3',
            dataTestId: 'tabWaitlist',
          },
        ]
      : []
  }, [acl, isOpenCourse, t, waitListTotal])

  const actions = useMemo(() => {
    return [
      {
        label: t('pages.course-participants.tabs.attending', {
          number: courseParticipantsTotal,
        }),
        value: '0',
        dataTestId: 'tabParticipants',
      },
      ...pendingDeclined,
      ...waitList,
    ]
  }, [courseParticipantsTotal, pendingDeclined, t, waitList])

  const dimensions = window.innerWidth * 0.8

  return isMobile ? (
    <Container>
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
          {actions.find(el => el.value === selectedInt.toString())?.label}
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
  ) : (
    <TabList onChange={(_, newValue: string) => setSelectedTab(newValue)}>
      {actions.map(action => (
        <Tab
          label={action.label}
          value={action.value}
          data-testid={action.dataTestId}
          key={action.value}
        />
      ))}
    </TabList>
  )
}
