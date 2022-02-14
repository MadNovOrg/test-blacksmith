import React, { useMemo, useState } from 'react'
import {
  format,
  isAfter,
  isBefore,
  isSameDay,
  isValid as isDateValid,
} from 'date-fns'
import { useForm, FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { Calendar } from '@app/components/Calendar'

type ManageAvailabilityProps = unknown

type AvailabilityEvent = {
  id?: string
  start: Date
  end?: Date
  description?: string
}

export const ManageAvailability: React.FC<ManageAvailabilityProps> = () => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
  })
  const [availabilityEvents, setAvailabilityEvents] = useState<
    AvailabilityEvent[]
  >([])
  const onDateSelected = (selectedDate: Date) => {
    const start = getValues('start')
    const stringValue = format(selectedDate, 'yyyy-MM-dd')
    let field = 'start'
    if (
      isDateValid(start) &&
      (isSameDay(selectedDate, start) || isAfter(selectedDate, start))
    ) {
      field = 'end'
    }
    setValue(field, stringValue, {
      shouldValidate: true,
    })
  }

  const onEventSubmit = (data: FieldValues) => {
    setAvailabilityEvents(prev => [
      ...prev,
      {
        start: data.start,
        end: data.end,
      },
    ])
    reset()
  }

  const startDate = watch('start')
  const endDate = watch('end')
  const calendarHighlights = useMemo(() => {
    const highlights = availabilityEvents.map(event => ({
      colorClass: 'text-white bg-lime-500',
      start: new Date(event.start),
      end:
        event.end && isDateValid(event.end)
          ? new Date(event.end)
          : new Date(event.start),
    }))
    if (startDate && isDateValid(startDate)) {
      highlights.push({
        colorClass: 'text-white bg-yellow-500',
        start: new Date(startDate),
        end:
          endDate && isDateValid(endDate)
            ? new Date(endDate)
            : new Date(startDate),
      })
    }
    return highlights
  }, [availabilityEvents, startDate, endDate])

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
          <form>
            <div className="grid grid-rows-4 grid-flow-row gap-4 justify-center items-center font-bold">
              <label>{t('pages.manage-availability.event-form.from')}:</label>
              <input
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
                className={clsx({
                  'border-red/80': errors.end,
                })}
                {...register('end', {
                  valueAsDate: true,
                  validate: {
                    filled: isDateValid,
                    beforeStartDate: value =>
                      !isBefore(value, startDate) ||
                      (t(
                        'pages.manage-availability.event-form.validation.end-before-start-date'
                      ) as string),
                  },
                })}
              />

              <label>{t('pages.manage-availability.event-form.for')}:</label>
              <input
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
                disabled={!isValid}
              >
                {t('pages.manage-availability.event-form.submit-event')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
