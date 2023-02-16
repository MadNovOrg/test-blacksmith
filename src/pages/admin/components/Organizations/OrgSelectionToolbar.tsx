import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Menu, MenuItem, TextField } from '@mui/material'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import { sortBy } from 'lodash-es'
import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntersection } from 'react-use'

import { StyledSubNavLink } from '@app/components/StyledSubNavLink'
import { useAuth } from '@app/context/auth'
import useOrg, { ALL_ORGS } from '@app/hooks/useOrg'

export type OrgSelectionToolbarProps = {
  prefix: string
}

export const OrgSelectionToolbar: React.FC<
  React.PropsWithChildren<OrgSelectionToolbarProps>
> = ({ prefix }) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()
  const { data } = useOrg(ALL_ORGS, profile?.id, acl.canViewAllOrganizations())

  const [query, setQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const sorted = sortBy(data || [], org => org.name.toLowerCase())

  const intersectionRef = useRef(null)
  const observer = useIntersection(intersectionRef, {
    threshold: 1,
  })
  const showMoreButton = !observer?.isIntersecting

  const filtered = useMemo(
    () =>
      sorted.filter(org =>
        org.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query, sorted]
  )

  return (
    <Toolbar
      sx={{
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'grey.300',
        bgcolor: 'white',
      }}
    >
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box
          height={44}
          lineHeight={2}
          display="flex"
          justifyContent="left"
          px={3}
          color="secondary.dark"
          overflow="hidden"
        >
          <Box ref={intersectionRef} display="flex">
            <Link
              flex={1}
              component={StyledSubNavLink}
              to={`${prefix}/all`}
              whiteSpace="nowrap"
            >
              {t('pages.org-details.all-organizations')}
            </Link>
            {sorted.map(org => (
              <Link
                key={org.id}
                flex={1}
                component={StyledSubNavLink}
                to={`${prefix}/${org.id}`}
                whiteSpace="nowrap"
              >
                {org.name}
              </Link>
            ))}
          </Box>
        </Box>
        <Box>
          {showMoreButton ? (
            <Button
              color="gray"
              sx={{
                boxShadow: 'none',
              }}
              variant="contained"
              endIcon={<ArrowDropDownIcon />}
              onClick={event => {
                setAnchorEl(event.currentTarget)
                setQuery('')
              }}
            >
              {t('common.more')}
            </Button>
          ) : null}
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            autoFocus={false}
            onClose={() => setAnchorEl(null)}
          >
            {/* workaround for default menu item keyboard navigation */}
            {/* https://stackoverflow.com/questions/58378786 */}
            <MenuItem
              onClickCapture={e => {
                e.stopPropagation()
                e.preventDefault()
              }}
              onKeyDown={e => e.stopPropagation()}
              sx={{
                '&.Mui-focusVisible': {
                  backgroundColor: 'inherit',
                },
              }}
            >
              <TextField
                sx={{
                  bgcolor: 'grey.100',
                  pt: 1,
                }}
                type="text"
                placeholder={t('common.search')}
                value={query}
                variant="filled"
                onChange={e => setQuery(e.target.value)}
                fullWidth
                autoFocus
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: 'grey.500', mr: 0.5 }} />
                  ),
                }}
              />
            </MenuItem>
            {filtered.map(org => (
              <MenuItem key={org.id} onClick={() => setAnchorEl(null)}>
                <Link
                  key={org.id}
                  component={StyledSubNavLink}
                  to={`${prefix}/${org.id}`}
                >
                  {org.name}
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </Toolbar>
  )
}
