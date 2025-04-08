import React, { useState, useEffect, useRef } from 'react'
import { Button, Form } from 'react-bootstrap'
import { InputGroup } from 'react-bootstrap'

export interface LocationData {
  lat: number
  lng: number
  address: string
}

interface GoogleMapsProps {
  onLocationSelect: (location: LocationData) => void
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({ onLocationSelect }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const mapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)

  useEffect(() => {
    const COMPANY_COORDINATES = { lat: 3.5847190045462995, lng: -76.48996261864785 }

    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }&libraries=places`
        script.async = true
        script.defer = true
        script.onload = initializeMap
        document.body.appendChild(script)
      } else {
        initializeMap()
      }
    }

    const initializeMap = () => {
      if (mapRef.current) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: COMPANY_COORDINATES,
          zoom: 20
        })
        setMap(mapInstance)
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
        mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            placeMarkerAndSave(e.latLng, mapInstance)
          }
        })
      }
    }

    loadGoogleMapsScript()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const placeMarkerAndSave = (latLng: google.maps.LatLng, mapInstance: google.maps.Map) => {
    if (marker) marker.setMap(null)
    const newMarker = new window.google.maps.Marker({
      position: latLng,
      map: mapInstance
    })
    setMarker(newMarker)

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const address = results[0].formatted_address
        const locationData: LocationData = {
          lat: latLng.lat(),
          lng: latLng.lng(),
          address
        }
        if (inputRef.current) inputRef.current.value = address
        onLocationSelect(locationData)
      } else {
        const locationData: LocationData = {
          lat: latLng.lat(),
          lng: latLng.lng(),
          address: 'Dirección no encontrada'
        }
        onLocationSelect(locationData)
      }
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    if (query.length > 3 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions({ input: query }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions)
        } else {
          setSuggestions([])
        }
      })
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    if (inputRef.current) {
      inputRef.current.value = suggestion.description
    }
    setSuggestions([])
    searchAddress()
  }

  const searchAddress = () => {
    const address = inputRef.current?.value
    if (!address) return

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location
        map?.setCenter(location)

        if (marker) marker.setMap(null)
        const newMarker = new window.google.maps.Marker({
          map: map!,
          position: location
        })
        setMarker(newMarker)
        const locationData: LocationData = {
          lat: location.lat(),
          lng: location.lng(),
          address: results[0].formatted_address
        }
        onLocationSelect(locationData)
      } else {
        console.error('No se encontró la dirección: ' + status)
      }
    })
  }

  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar dirección"
          ref={inputRef}
          onChange={handleInputChange}
          className="form-control"
        />
        <Button variant="primary" onClick={searchAddress}>
          Buscar
        </Button>
      </InputGroup>
      {suggestions.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: '0',
            margin: '5px 0',
            border: '1px solid #ccc',
            maxHeight: '150px',
            overflowY: 'auto'
          }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              style={{ padding: '5px', cursor: 'pointer' }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '500px', marginTop: '10px' }}></div>
    </div>
  )
}

export default GoogleMaps
