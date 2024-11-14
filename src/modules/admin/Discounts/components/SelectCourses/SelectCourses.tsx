import { Delete } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import { Course_Level_Enum } from '@app/generated/graphql'

import useSearchCourses from '../../hooks/useSearchCourses'
import { getAvailableCourseLevels } from '../../utils'
import { SelectLevels } from '../SelectLevels'

type Props = {
  value: number[]
  onChange: (ev: { target: { value: number[] } }) => void
  titleHint: string
  where: object
  disabled?: boolean
}

export const SelectCourses: React.FC<React.PropsWithChildren<Props>> = ({
  value,
  onChange,
  titleHint,
  where,
  disabled,
}) => {
  const { acl } = useAuth()
  const isAustralia = acl.isAustralia()
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [levels, setLevels] = useState<Course_Level_Enum[]>([])
  const [modalSelectedIds, setModalSelectedIds] = useState<Set<number>>(
    new Set(),
  )

  const levelFilter = useMemo(() => {
    if (levels.length === 0)
      return { _in: getAvailableCourseLevels(isAustralia) }
    return { _in: levels }
  }, [levels, isAustralia])

  const { data: searchResult } = useSearchCourses(
    { ...where, level: levelFilter },
    value,
  )

  const selectedIds = useMemo(() => new Set(value), [value])

  const searched = useMemo(
    () => [
      ...(searchResult?.courses ?? []),
      ...(searchResult?.selectedCourses ?? []),
    ],
    [searchResult],
  )

  const selected = useMemo(
    () => searchResult?.selectedCourses ?? [],
    [searchResult],
  )

  const courses = useMemo(() => {
    // Exclude already selected courses
    return searched.filter(c => !selectedIds.has(c.id))
  }, [searched, selectedIds])

  const openModal = () => {
    setModalSelectedIds(new Set(selectedIds))
    setShowModal(true)
  }

  const closeModal = () => {
    setLevels([])
    setModalSelectedIds(new Set())
    setShowModal(false)
  }

  const onCancel = () => closeModal()
  const onAdd = () => {
    onChange({ target: { value: Array.from(modalSelectedIds) } })
    closeModal()
  }

  const onCourseClick = (ev: React.SyntheticEvent, checked: boolean) => {
    const id = Number((ev.target as HTMLInputElement).value)
    setModalSelectedIds(prev => {
      const updated = new Set(prev)
      checked ? updated.add(id) : updated.delete(id)
      return updated
    })
  }

  const unselectCourse = (courseId: number) => {
    const updated = new Set(selectedIds)
    updated.delete(courseId)
    onChange({ target: { value: [...updated] } })
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
        {selected.map(({ id, level, schedule, deliveryType }) => {
          return (
            <Box key={id} sx={{ display: 'flex', p: 1 }}>
              <Box flex={1}>
                <Typography variant="body1" fontWeight="bold">
                  {t(`course-levels.${level}`) || level}
                </Typography>
                <Typography variant="body2">
                  {t('dates.long', { date: schedule[0].start })}
                  <Box component="span" ml={3}>
                    {schedule[0].venue?.city ??
                      t(`course-delivery-type.${deliveryType}`)}
                  </Box>
                </Typography>
              </Box>
              {disabled ? null : (
                <IconButton onClick={() => unselectCourse(id)}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          )
        })}
      </Box>
      {disabled ? null : (
        <Button variant="outlined" onClick={openModal}>
          {t('components.selectCourses.btn-browse')}
        </Button>
      )}

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
          {courses.map(c => {
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
                checked={modalSelectedIds.has(c.id)}
                onChange={onCourseClick}
                sx={{
                  display: 'flex',
                  ml: -1,
                  mr: 0,
                  py: 1,
                  pl: 1,
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
