'use client'

import React, { memo, useCallback, useState } from 'react'

import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import axios from 'axios'
import { toast } from 'react-toastify'
import type { UseFormSetValue } from 'react-hook-form'

import type { AddStoreFormData } from '@/app/[subdomain]/[lang]/(stable)/addstore/page'
import type { EditStoreFormData } from '@/app/[subdomain]/[lang]/(stable)/store/[storeId]/page'

interface LatLng {
  lat: number
  lng: number
}

interface InteractiveMapProps {
  containerStyle?: React.CSSProperties
  setMapSelectedOnce: (value: boolean) => void
  setValue: UseFormSetValue<AddStoreFormData | EditStoreFormData>
  disabled?: boolean
}

const center: LatLng = {
  lat: 28.6193,
  lng: 77.2088
}

const libraries: any[] = ['places']

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  containerStyle = {
    width: '400px',
    height: '400px'
  },
  setMapSelectedOnce,
  setValue,
  disabled = false
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || '',
    libraries: libraries
  })

  const [map, setMap] = useState<google.maps.Map>()
  const [latLng, setLatLng] = useState<LatLng>(center)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>()

  // Called when the map is loaded
  const onLoad = useCallback(function callback(map: google.maps.Map) {
    // const bounds = new window.google.maps.LatLngBounds(center)
    // map.fitBounds(bounds)
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords

            setLatLng({ lat: latitude, lng: longitude })

            //   dispatch(setLatLng({ lat: latitude, lng: longitude }))
            map.panTo({ lat: latitude, lng: longitude })
          })
        } else if (permissionStatus.state === 'prompt') {
          // Ask for permission
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords

              setLatLng({ lat: latitude, lng: longitude })

              // dispatch(setLatLng({ lat: latitude, lng: longitude }))
              map.panTo({ lat: latitude, lng: longitude })
            },
            () => {
              console.error('User denied geolocation')
            }
          )
        }
      })
    } else {
      // Geolocation not supported
      console.error('Geolocation not supported')
    }

    setMap(map)
  }, [])

  // Cleanup when the component unmounts
  const onUnmount = useCallback(function callback() {
    setMap(undefined)
  }, [])

  // Called when the autocomplete is loaded
  const onAutocompleteLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance)
  }

  const handleReverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await axios.get(
        `https://apis.mappls.com/advancedmaps/v1/${process.env.NEXT_PUBLIC_MMI_REVERSE_GEOCODE_KEY}/rev_geocode?lat=${lat}&lng=${lng}`
      )

      const data = res.data.results[0]
      const formatAddr = `${data?.houseNumber.length > 0 ? data?.houseNumber + ', ' : ''} ${data?.houseName.length > 0 ? data?.houseName + ', ' : ''} ${data?.street.length > 0 ? data?.street + ', ' : ''} ${data?.street_dist > 0 ? data?.street_dist + ', ' : ''} ${data?.subSubLocality.length > 0 ? data?.subSubLocality + ', ' : ''} ${data?.subLocality.length > 0 ? data?.subLocality + ', ' : ''} ${data?.subDistrict}`

      setValue('address.street', data?.street)
      setValue('address.city', data?.city)
      setValue('address.state', data?.state)
      setValue('address.pincode', data?.pincode)
      setValue('address.locality', formatAddr)
      setValue('address.gps', `${lat}, ${lng}`)

      return { ...data, locality: formatAddr }
    } catch (e) {
      throw new Error(`${e}`)
    }
  }

  // Called when the location is changed by clicking on the map
  const onMapClick = async (event: google.maps.MapMouseEvent) => {
    if (disabled) return
    setMapSelectedOnce(true)
    const lat = event.latLng?.lat()
    const lng = event.latLng?.lng()

    if (!lat || !lng) {
      toast.error('Error getting address details please try again!')

      return
    }

    setLatLng({ lat, lng })

    setValue('address.gps', `${lat}, ${lng}`)

    if (map) {
      map.panTo({ lat, lng })
    }

    try {
      await handleReverseGeocode(lat, lng)
    } catch (e) {
      console.error('cant reverse geocode', e)
      toast.error('Error getting address details please try again!')
    }
  }

  // Called when the location is changed by selecting a place from the autocomplete
  const onPlaceChanged = async () => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      const lat = place?.geometry?.location?.lat()
      const lng = place?.geometry?.location?.lng()

      if (!lat || !lng) {
        toast.error('Error getting address details please try again!')

        return
      }

      setMapSelectedOnce(true)

      try {
        await handleReverseGeocode(lat, lng)
      } catch (error) {
        console.error('cant reverse geocode', error)
        toast.error('Error getting address details please try again!')
      }

      setLatLng({ lat, lng })

      //   dispatch(setLatLng({ lat, lng }))
      map?.panTo({ lat, lng })
    } else {
      console.error('Autocomplete is not loaded yet!')
    }
  }

  return isLoaded ? (
    <div className='relative'>
      {disabled ? null : (
        <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged} className='absolute z-50'>
          <input
            type='text'
            placeholder='Search for a location'
            className='box-border border border-transparent w-60 h-8 px-3 rounded shadow-md text-sm outline-none absolute top-2 left-2'
          />
        </Autocomplete>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={latLng}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          disableDefaultUI: disabled,
          gestureHandling: disabled ? 'none' : 'auto'
        }}
      >
        <>
          <Marker key={`${latLng.lat}-${latLng.lng}`} position={latLng} />
        </>
      </GoogleMap>
    </div>
  ) : null
}

export default memo(InteractiveMap)
