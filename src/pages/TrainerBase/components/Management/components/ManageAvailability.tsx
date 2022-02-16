import React, { useMemo, useState } from 'react'
import { isAfter, isBefore, isSameDay, isValid as isDateValid } from 'date-fns'
import { useForm, FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import useSWR from 'swr'

import { Calendar } from '@app/components/Calendar'

import { useAuth } from '@app/context/auth'

import { MUTATION as InsertAvailability } from '@app/queries/trainer/manage-availability/insert-availability'
import { MUTATION as UpdateAvailability } from '@app/queries/trainer/manage-availability/update-availability'
import { MUTATION as DeleteAvailability } from '@app/queries/trainer/manage-availability/delete-availability'
import {
  QUERY as GetAvailability,
  ResponseType as GetAvailabilityResponseType,
} from '@app/queries/trainer/manage-availability/get-availability'
import { fetcher } from '@app/App'
import { AvailabilityType } from '@app/types'
import { formatDateForInput } from '@app/util'

type ManageAvailabilityProps = unknown

export const ManageAvailability: React.FC<ManageAvailabilityProps> = () => {
  const { t } = useTranslation()
  const { profile, idToken } = useAuth()
  const { data, mutate } = useSWR<GetAvailabilityResponseType, Error>(
    GetAvailability
  )
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { isValid, isDirty, errors },
  } = useForm({
    mode: 'onChange',
  })
  const [error, setError] = useState<string>()
  const [updatedEventId, setUpdatedEventId] = useState<string>()

  const onDateSelected = async (selectedDate: Date) => {
    const existingEvent = data?.events.find(event => {
      const start = new Date(event.start)
      const end = new Date(event.end)
      return (
        isSameDay(selectedDate, new Date(event.start)) ||
        (isAfter(selectedDate, start) && isBefore(selectedDate, end)) ||
        isSameDay(selectedDate, end)
      )
    })
    if (existingEvent) {
      reset()
      setUpdatedEventId(existingEvent.id)
      setValue('start', formatDateForInput(existingEvent.start))
      setValue('end', formatDateForInput(existingEvent.end))
      setValue('description', existingEvent.description)
      await trigger()
    } else {
      const start = getValues('start')
      let field = 'start'
      if (
        isDateValid(start) &&
        (isSameDay(selectedDate, start) || isAfter(selectedDate, start))
      ) {
        field = 'end'
      }
      setValue(field, formatDateForInput(selectedDate), {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }

  const onEventSubmit = async (formData: FieldValues) => {
    setError(undefined)
    try {
      await fetcher(
        updatedEventId ? UpdateAvailability : InsertAvailability,
        {
          id: updatedEventId,
          event: {
            profileId: profile?.id,
            start: formData.start,
            end: formData.end,
            description: formData.description,
            type: AvailabilityType.UNAVAILABLE,
          },
        },
        idToken
      )
      setUpdatedEventId(undefined)
      await mutate()
      reset()
    } catch (e: unknown) {
      setError((e as Error).message)
    }
  }

  const start = watch('start')
  const end = watch('end')
  const calendarHighlights = useMemo(() => {
    if (!data) return []

    const startDate = new Date(start)
    const endDate = new Date(end && isDateValid(end) ? end : start)
    const highlights = data.events.map(event => {
      const isEditedItem = updatedEventId === event.id
      const colorName = isEditedItem ? 'bg-yellow-500' : 'bg-red'
      return {
        colorClass: `text-white ${colorName}`,
        start: isEditedItem ? startDate : new Date(event.start),
        end: isEditedItem ? endDate : new Date(event.end),
      }
    })
    if (startDate && isDateValid(startDate)) {
      highlights.push({
        colorClass: 'text-white bg-yellow-500',
        start: startDate,
        end: endDate,
      })
    }
    return highlights
  }, [data, start, end, updatedEventId])

  const onDiscardChanges = () => {
    setUpdatedEventId(undefined)
    reset()
  }

  const onDelete = async () => {
    setError(undefined)
    try {
      await fetcher(
        DeleteAvailability,
        {
          id: updatedEventId,
        },
        idToken
      )
      setUpdatedEventId(undefined)
      reset()
      await mutate()
    } catch (e: unknown) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="">
      <p className="font-light text-3xl">
        {t('pages.manage-availability.title')}
      </p>

      <div className="mt-8 grid grid-cols-2">
        <div className="flex grow-[3]">
          <div className="w-full max-w-[500px]">
            <Calendar
              highlight={calendarHighlights}
              onDateSelected={onDateSelected}
            />
          </div>
        </div>
        <div className="p-4">
          {error && (
            <div className="border-red/20 border rounded bg-red/10 text-red/80 font-bold p-2 m-6">
              {t('common.internal-error')}
            </div>
          )}
          <form>
            <div className="grid grid-rows-4 grid-flow-row gap-4 justify-center items-center font-bold">
              <label>{t('pages.manage-availability.event-form.from')}:</label>
              <input
                className="focus:ring-0 border-b-2 border-t-0 border-l-0 border-r-0 focus:outline-0 block w-full pb-1.5 placeholder-gray-400"
                type="date"
                {...register('start', {
                  valueAsDate: true,
                  validate: isDateValid,
                })}
              />

              <label
                className={clsx({
                  'text-red/80': errors.end,
                })}
              >
                {t('pages.manage-availability.event-form.to')}:
              </label>
              <input
                type="date"
                className={clsx(
                  'focus:ring-0 border-b-2 border-t-0 border-l-0 border-r-0 focus:outline-0 block w-full pb-1.5 placeholder-gray-400',
                  {
                    'border-red/80': errors.end,
                  }
                )}
                {...register('end', {
                  valueAsDate: true,
                  validate: {
                    filled: isDateValid,
                    beforeStartDate: value =>
                      !isBefore(value, start) ||
                      (t(
                        'pages.manage-availability.event-form.validation.end-before-start-date'
                      ) as string),
                  },
                })}
              />

              <label>{t('pages.manage-availability.event-form.for')}:</label>
              <input
                className="focus:ring-0 border-b-2 border-t-0 border-l-0 border-r-0 focus:outline-0 block w-full pb-1.5 placeholder-gray-400"
                type="text"
                placeholder={t(
                  'pages.manage-availability.event-form.add-reason-optional'
                )}
                {...register('description')}
              />

              {errors.end?.message && (
                <div className="col-span-2 border-red/20 border rounded bg-red/10 text-red/80 font-bold p-2">
                  {errors.end?.message}
                </div>
              )}
              <button
                className="col-span-2 btn tertiary"
                onClick={handleSubmit(onEventSubmit)}
                disabled={(updatedEventId && !isDirty) || !isValid}
              >
                {t('pages.manage-availability.event-form.submit-event')}
              </button>
              {updatedEventId && (
                <button
                  type="button"
                  className="col-span-2 btn tertiary"
                  onClick={onDiscardChanges}
                >
                  {t('common.discard-changes')}
                </button>
              )}
              {updatedEventId && (
                <button
                  type="button"
                  className="col-span-2 btn warning"
                  onClick={onDelete}
                >
                  {t('pages.manage-availability.event-form.delete-event')}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
