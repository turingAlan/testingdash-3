export const convertIsoToDuration = (str: string) => {
  // Return empty object if input string is invalid or empty
  if (!str) return { value: '', unit: '' }

  // Match pattern for days, hours, and minutes in ISO format
  const match = str.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/)

  let unit = ''
  let value = ''

  // Check each time unit and assign the first one that has a value
  if (match?.[1]) {
    unit = 'days'
    value = match[1]
  } else if (match?.[2]) {
    unit = 'hours'
    value = match[2]
  } else if (match?.[3]) {
    unit = 'minutes'
    value = match[3]
  }

  return { value, unit }
}

export const convertDurationToIso = (value: string, unit: 'days' | 'hours' | 'minutes' | string): string => {
  let durationString = 'P'

  if (unit === 'days') {
    durationString += `${value}D`
  } else if (unit === 'hours') {
    durationString += `T${value}H`
  } else if (unit === 'minutes') {
    durationString += `T${value}M`
  }

  return durationString
}
