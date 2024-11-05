import { useEffect, useState } from 'react'

import { Button, Card, CardContent, Grid, Typography } from '@mui/material'
import dayjs from 'dayjs'

import type { UseMutationResult } from '@tanstack/react-query'

import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import type { StoreDetails, StoreTiming } from '@/types/apps/storeTypes'
import { weekDaysValues } from '@/data/constants'

interface StoreTimingProps extends StoreTiming {
  changeStoreTimingMutation: UseMutationResult<StoreDetails, any, StoreTiming, unknown>
}

const StoreTimings = (props: StoreTimingProps) => {
  const { days: activeDays, range, changeStoreTimingMutation } = props

  const { mutate: changeTimeMutate, isPending: isLoading, isSuccess, data: updateStoreData } = changeStoreTimingMutation

  const getHolidayIndexesArray = (daysActive: number[]): number[] => {
    const holidayArray: number[] = []

    weekDaysValues.forEach((_, idx) => {
      if (!daysActive.includes(idx + 1)) {
        holidayArray.push(idx + 1)
      }
    })

    return holidayArray
  }

  const formatTimeStringToDate = (time: string): Date => {
    // Extract hours and minutes
    const hours = parseInt(time.slice(0, 2), 10)
    const minutes = parseInt(time.slice(2), 10)

    const dateTime = dayjs()?.hour(hours)?.minute(minutes)

    // Convert to Date object
    const dateObject = dateTime?.toDate()

    return dateObject
  }

  const initialHoliday = getHolidayIndexesArray(activeDays)

  const [selectedHolidays, setSelectedHolidays] = useState<number[]>(initialHoliday)
  const [endTime, setEndTime] = useState<Date>(formatTimeStringToDate(range.end))
  const [startTime, setStartTime] = useState<Date>(formatTimeStringToDate(range.start))

  const toggleHoliday = (idx: number) => {
    setSelectedHolidays(prev => (prev.includes(idx) ? prev.filter(h => h !== idx) : [...prev, idx]))
  }

  const handleUpdateTimings = () => {
    const startDateString = dayjs(startTime).format('HHmm')
    const endDateString = dayjs(endTime).format('HHmm')

    // TODO fix this type
    const activeDays: any[] = weekDaysValues
      .map((_, idx) => {
        if (!selectedHolidays.includes(idx + 1)) {
          return idx + 1
        }

        return null
      })
      .filter(day => day !== null)

    changeTimeMutate({
      days: activeDays,
      range: {
        start: startDateString,
        end: endDateString
      }
    })
  }

  // To update the values in the form to the updated values in backend
  useEffect(() => {
    if (isSuccess && updateStoreData) {
      setSelectedHolidays(getHolidayIndexesArray(updateStoreData.time.days))
      setEndTime(formatTimeStringToDate(updateStoreData.time.range.end))
      setStartTime(formatTimeStringToDate(updateStoreData.time.range.start))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isSuccess])

  return (
    <>
      <Card id='storeTiming'>
        <CardContent>
          <Typography variant='h5'>Store Holidays</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant='h6'>Weekly Holidays (Click to Select The Holidays)</Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              {weekDaysValues.map((day, idx) => {
                return (
                  <Button
                    color='primary'
                    variant='contained'
                    key={day}
                    onClick={() => toggleHoliday(idx + 1)}
                    className={`px-4 py-2 cursor-pointer border-2 rounded-md m-1 inline-block ${
                      selectedHolidays.includes(idx + 1) ? ' text-neutral-100' : 'bg-transparent text-neutral-800'
                    } border-white `}
                  >
                    {day}
                  </Button>
                )
              })}
            </Grid>
          </Grid>
          <br />
          <Typography variant='h5'>Store Timings</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Typography variant='h6'>
                This timeframe is essentially intended to inform the logistics provider that they can arrive during
                these specified hours to pick up the product.
              </Typography>
            </Grid>
          </Grid>

          <br />
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={12} sm={4}>
              <AppReactDatepicker
                showTimeSelect
                selected={startTime}
                timeIntervals={15}
                showTimeSelectOnly
                dateFormat='h:mm aa'
                id='time-only-picker'
                onChange={(date: Date) => {
                  setStartTime(date)
                }}
                customInput={<CustomTextField label='Opening Time' fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <AppReactDatepicker
                showTimeSelect
                selected={endTime}
                timeIntervals={15}
                showTimeSelectOnly
                dateFormat='h:mm aa'
                id='time-only-picker'
                onChange={(date: Date) => setEndTime(date)}
                customInput={<CustomTextField label='Closing Time' fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={4} style={{ paddingTop: '32px' }}>
              <Button
                color='primary'
                variant='contained'
                startIcon={<i className='tabler-arrow-big-up-filled' />}
                onClick={handleUpdateTimings}
                className='is-full sm:is-auto'
              >
                Update Timings
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default StoreTimings
