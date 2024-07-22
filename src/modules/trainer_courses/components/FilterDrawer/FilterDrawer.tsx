import CloseIcon from '@mui/icons-material/Close'
import FilterAlt from '@mui/icons-material/FilterAlt'
import { Box, Button, Drawer, IconButton } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useToggle } from 'react-use'

import { CoursesFilters } from '@app/modules/trainer_courses/hooks/useCourses'

import { Filters } from '../Filters'

type Props = {
  setFilters: (filters: CoursesFilters) => void
}

export function FilterDrawer({ setFilters }: Props) {
  const [open, toggle] = useToggle(false)
  const location = useLocation()
  const { t } = useTranslation()

  const handleClose = useCallback(() => {
    toggle(false)
  }, [toggle])

  useEffect(() => {
    toggle(false)
  }, [location, toggle])

  return (
    <>
      <Button
        onClick={toggle}
        aria-label="Open menu"
        type="button"
        variant="outlined"
        color="secondary"
        size="large"
        fullWidth
        endIcon={<FilterAlt />}
        sx={{ mt: 3 }}
      >
        {t('common.filters.button')}
      </Button>
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

        <Box px={5} py={3} display="flex" flexDirection="column" gap={3}>
          <Filters onChange={setFilters} />
        </Box>

        <Box px={5}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleClose}
          >
            {t('common.close-modal')}
          </Button>
        </Box>
      </Drawer>
    </>
  )
}
