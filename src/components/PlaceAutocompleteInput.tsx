import { useEffect, useRef } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

export type SelectedPlace = { address: string; lat: number; lng: number }

type PlacePredictionLike = {
  toPlace: () => { fetchFields: (opts: { fields: string[] }) => Promise<void> } & Record<
    string,
    unknown
  >
}

export default function PlaceAutocompleteInput({
  placeholder,
  className,
  biasCenter,
  onPlaceSelected,
}: {
  placeholder: string
  className?: string
  biasCenter?: { lat: number; lng: number } | null
  onPlaceSelected: (place: SelectedPlace) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const placesLibrary = useMapsLibrary('places')

  useEffect(() => {
    if (!placesLibrary || !containerRef.current) return

    const container = containerRef.current
    const PlaceAutocompleteElement = (
      placesLibrary as unknown as {
        PlaceAutocompleteElement: new (options: {
          locationBias?: { radius: number; center: { lat: number; lng: number } }
        }) => HTMLElement
      }
    ).PlaceAutocompleteElement

    const autocompleteEl = new PlaceAutocompleteElement(
      biasCenter ? { locationBias: { radius: 50000, center: biasCenter } } : {},
    )

    autocompleteEl.setAttribute('class', className ?? 'w-full min-w-0')
    autocompleteEl.setAttribute('placeholder', placeholder)
    autocompleteEl.style.setProperty('color-scheme', 'light')
    autocompleteEl.style.setProperty('font-family', "'Instrument Sans', sans-serif")
    autocompleteEl.style.setProperty('--gmp-mat-color-surface', '#ffffff')
    autocompleteEl.style.setProperty('--gmp-mat-color-on-surface', '#000000')
    autocompleteEl.style.setProperty('--gmp-mat-color-on-surface-variant', '#6b7280')
    autocompleteEl.style.setProperty('--gmp-mat-color-primary', '#235ee0')
    autocompleteEl.style.setProperty('--gmp-mat-color-outline', 'transparent')
    container.style.setProperty('color-scheme', 'light')
    container.appendChild(autocompleteEl)

    async function handleSelect(event: Event) {
      const placePrediction = (event as unknown as { placePrediction?: PlacePredictionLike })
        .placePrediction
      if (!placePrediction) return

      const place = placePrediction.toPlace()
      await place.fetchFields({ fields: ['formattedAddress', 'displayName', 'location'] })

      const location = place.location as { lat: () => number; lng: () => number } | undefined
      onPlaceSelected({
        address: (place.formattedAddress as string) ?? (place.displayName as string) ?? '',
        lat: location ? location.lat() : 0,
        lng: location ? location.lng() : 0,
      })
    }

    autocompleteEl.addEventListener('gmp-select', handleSelect)

    return () => {
      autocompleteEl.removeEventListener('gmp-select', handleSelect)
      container.removeChild(autocompleteEl)
    }
  }, [placesLibrary, placeholder, className, biasCenter?.lat, biasCenter?.lng])

  return <div ref={containerRef} className="w-full min-w-0" />
}
