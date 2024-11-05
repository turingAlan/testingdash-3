import { useEffect, useRef, useState } from 'react'

import isEqual from 'fast-deep-equal'

const useComparePrevObj = <T extends object>(freshValue: T) => {
  const [prevValue, setPrevValue] = useState({} as T)
  const hasChanged = useRef(false)

  useEffect(() => {
    // Compare freshValue with prevValue using fast-deep-equal
    if (!isEqual(freshValue, prevValue)) {
      setPrevValue(freshValue) // Update prevValue if they are different
      hasChanged.current = true
    } else {
      hasChanged.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freshValue])

  return { prevValue, hasChanged: hasChanged.current }
}

export default useComparePrevObj
