import { Wrapper } from '@googlemaps/react-wrapper'
import { Grid, Box, useMediaQuery } from '@mui/material'
import React, { useCallback, useMemo } from 'react'

import theme from '@app/theme'
import { CourseSchedule } from '@app/types'

export const MapComponent: React.FC<{
  geoCoordinates: string | null | undefined
  schedule: CourseSchedule
}> = ({ geoCoordinates }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const courseLocationCoordinates = useMemo(() => {
    const coordinates = geoCoordinates?.replace(/[()]/g, '').split(',')
    const zeroCoordinate = parseFloat('0')
    if (
      coordinates !== null &&
      coordinates !== undefined &&
      Array.isArray(coordinates) &&
      coordinates.every(element => typeof element === 'string')
    ) {
      const latitude = parseFloat(coordinates[0])
      const longitude = parseFloat(coordinates[1])
      return {
        lat: isNaN(latitude) ? zeroCoordinate : latitude,
        lng: isNaN(longitude) ? zeroCoordinate : longitude,
      }
    } else {
      return {
        lat: zeroCoordinate,
        lng: zeroCoordinate,
      }
    }
  }, [geoCoordinates])

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (node !== null) {
        return new window.google.maps.Map(node, {
          center: {
            lat: courseLocationCoordinates.lat,
            lng: courseLocationCoordinates.lng,
          },
          zoom: 16,
        })
      }
    },
    [courseLocationCoordinates],
  )
  if (!isMobile || !geoCoordinates) {
    return null
  }
  return (
    <Grid>
      <Wrapper
        apiKey={`${import.meta.env.VITE_GMAPS_KEY}`}
        libraries={['places', 'visualization']}
      >
        <Box ref={ref} id="map" sx={{ height: '20vh', width: '100%', mt: 2 }} />
      </Wrapper>
    </Grid>
  )
}
