import { Delete } from '@mui/icons-material'
import {
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Stack,
  IconButton,
} from '@mui/material'
import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import { CourseLevel } from '@app/types'

import { Dialog } from '../Dialog'
import { SelectLevels } from '../SelectLevels'

import {
  GET_SELECTED,
  SearchCourse,
  SEARCH_COURSES,
  QueryResult,
} from './queries'

type Props = {
  value: number[]
  onChange: (ev: { target: { value: number[] } }) => void
  titleHint: string
  where: object
}

export const SelectCourses: React.FC<React.PropsWithChildren<Props>> = ({
  value,
  onChange,
  titleHint,
  where,
}) => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [levels, setLevels] = useState<CourseLevel[]>([])

  const selectedIds = useMemo(() => new Set(value), [value])

  const levelFilter = useMemo(() => {
    if (levels.length === 0) return {}
    return { _in: levels }
  }, [levels])

  const [searchResult] = useQuery<QueryResult>({
    query: SEARCH_COURSES,
    variables: { where: { ...where, level: levelFilter } },
    pause: !showModal,
  })

  const searched = useMemo(
    () => searchResult.data?.courses ?? [],
    [searchResult.data]
  )

  const [selectedResult] = useQuery<QueryResult>({
    query: GET_SELECTED,
    variables: { ids: [...selectedIds] },
    pause: value.length === 0,
  })

  const selected = useMemo(
    () => selectedResult.data?.courses ?? [],
    [selectedResult.data]
  )

  const courses = useMemo(() => {
    if (levels.length) return searched

    // When no filters set, ensure selected courses are shown
    const searchedIds = new Set(searched.map(c => c.id))
    const notInSearched = selected.filter(c => !searchedIds.has(c.id))
    return [...notInSearched, ...searched]
  }, [searched, selected, levels])

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setLevels([])
    setShowModal(false)
  }

  const onCancel = () => closeModal()
  const onAdd = () => closeModal()

  const onCourseClick = (ev: React.SyntheticEvent, checked: boolean) => {
    const id = Number((ev.target as HTMLInputElement).value)
    const updated = new Set(selectedIds)
    checked ? updated.add(id) : updated.delete(id)
    onChange({ target: { value: [...updated] } })
  }

  const unselectCourse = (courseId: number) => {
    onCourseClick(
      { target: { value: `${courseId}` } } as unknown as React.SyntheticEvent,
      false
    )
  }

  const modalTitle = useMemo(() => {
    return (
      <>
        {t('components.selectCourses.modal-title')}
        {titleHint ? (
          <Typography variant="body2">{titleHint}</Typography>
        ) : null}
      </>
    )
  }, [t, titleHint])

  return (
    <>
      <Box mb={2} data-testid="SelectCourses">
        {selected.map(c => {
          return (
            <Box key={c.id} sx={{ display: 'flex', p: 1 }}>
              <Box flex={1}>
                <Typography variant="body1" fontWeight="bold">
                  {c.level}
                </Typography>
                <Typography variant="body2">
                  {t('dates.long', { date: c.schedule[0].start })}
                  <Box component="span" ml={3}>
                    {c.schedule[0].venue?.city ??
                      t(`course-delivery-type.${c.deliveryType}`)}
                  </Box>
                </Typography>
              </Box>
              <IconButton onClick={() => unselectCourse(c.id)}>
                <Delete />
              </IconButton>
            </Box>
          )
        })}
      </Box>
      <Button variant="outlined" onClick={openModal}>
        {t('components.selectCourses.btn-browse')}
      </Button>

      <Dialog
        open={showModal}
        onClose={closeModal}
        title={modalTitle}
        maxWidth={600}
      >
        {/* Level filter */}
        <Box>
          <SelectLevels
            value={levels}
            onChange={ev => setLevels(ev.target.value)}
          />
        </Box>

        {/* Courses list */}
        <Stack sx={{ height: '40vh', overflow: 'auto' }}>
          {!courses.length ? (
            <Typography variant="body2" sx={{ margin: '2em 1em' }}>
              {t('components.selectCourses.no-results')}
            </Typography>
          ) : null}
          {courses.map((c: SearchCourse) => {
            const label = (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 1,
                }}
              >
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {t('dates.long', { date: c.schedule[0].start })}
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {t(`course-levels.${c.level}`)}
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {c.schedule[0].venue?.city ??
                    t(`course-delivery-type.${c.deliveryType}`)}
                </Typography>
              </Box>
            )

            return (
              <FormControlLabel
                key={c.id}
                disableTypography={true}
                label={label}
                control={<Checkbox />}
                value={c.id}
                checked={selectedIds.has(c.id)}
                onChange={onCourseClick}
                sx={{
                  display: 'flex',
                  ml: -1,
                  mr: 0,
                  py: 1,
                  borderBottom: 1,
                  borderColor: 'grey.100',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              />
            )
          })}
        </Stack>

        {/* Buttons */}
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, mt: 2 }}
        >
          <Button onClick={onCancel}>{t('cancel')}</Button>
          <Button variant="contained" onClick={onAdd}>
            {t('add')}
          </Button>
        </Box>
      </Dialog>
    </>
  )
}
