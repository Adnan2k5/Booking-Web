import { useState, useEffect, useCallback, useMemo } from 'react'

export const useCountrySlider = (events) => {
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0)

  // Group events by country
  const countriesFromEvents = useMemo(() => {
    if (!events || events.length === 0) return []

    const countryMap = {}
    events.forEach(event => {
      if (!countryMap[event.country]) {
        countryMap[event.country] = {
          name: event.country,
          events: []
        }
      }
      countryMap[event.country].events.push(event)
    })

    return Object.values(countryMap)
  }, [events])

  const currentCountry = useMemo(() =>
    countriesFromEvents[currentCountryIndex] || null,
    [countriesFromEvents, currentCountryIndex]
  )

  // Auto-slide effect
  useEffect(() => {
    if (countriesFromEvents.length <= 1) return

    const interval = setInterval(() => {
      setCurrentCountryIndex((prev) => (prev + 1) % countriesFromEvents.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [countriesFromEvents.length])

  // Reset currentCountryIndex when countries change
  useEffect(() => {
    if (currentCountryIndex >= countriesFromEvents.length) {
      setCurrentCountryIndex(0)
    }
  }, [countriesFromEvents.length, currentCountryIndex])

  const nextCountry = useCallback(() => {
    setCurrentCountryIndex((prev) => (prev + 1) % countriesFromEvents.length)
  }, [countriesFromEvents.length])

  const prevCountry = useCallback(() => {
    setCurrentCountryIndex((prev) => (prev - 1 + countriesFromEvents.length) % countriesFromEvents.length)
  }, [countriesFromEvents.length])

  const goToCountry = useCallback((index) => {
    setCurrentCountryIndex(index)
  }, [])

  return {
    currentCountryIndex,
    countriesFromEvents,
    currentCountry,
    nextCountry,
    prevCountry,
    goToCountry
  }
}