import type { LatLng, Restaurant, SchoolId } from '../types'
import type { FilterState } from '../components/Filters/FilterPanel'

export type SortMode = 'composite' | 'distance'

export function distanceInMeters(a: LatLng, b: LatLng): number {
  const rad = (v: number) => (v * Math.PI) / 180
  const R = 6371000
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const lat1 = rad(a.lat)
  const lat2 = rad(b.lat)

  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

export function filterRestaurants(list: Restaurant[], filter: FilterState): Restaurant[] {
  return list.filter((r) => {
    if (filter.minScore && r.scores.overall < filter.minScore) {
      return false
    }

    if (filter.priceRange === '0-20' && r.avgPricePerPerson > 20) return false
    if (
      filter.priceRange === '20-40' &&
      (r.avgPricePerPerson < 20 || r.avgPricePerPerson > 40)
    ) {
      return false
    }
    if (filter.priceRange === '40+' && r.avgPricePerPerson < 40) return false

    if (filter.activeTagIds && filter.activeTagIds.length > 0) {
      const restaurantTagIds = r.tagsSummary.map((t) => t.tagId)
      const hasAllTags = filter.activeTagIds.every((tagId) => restaurantTagIds.includes(tagId))
      if (!hasAllTags) return false
    }

    return true
  })
}

export function sortRestaurants(
  list: Restaurant[],
  mode: SortMode,
  schoolId: SchoolId,
): Restaurant[] {
  const withDistance = list.map((r) => {
    const ref = r.nearbySchools.find((s) => s.schoolId === schoolId)
    return { r, distance: ref?.distanceMeters ?? Number.POSITIVE_INFINITY }
  })

  if (mode === 'distance') {
    return withDistance.sort((a, b) => a.distance - b.distance).map((x) => x.r)
  }

  return withDistance
    .sort((a, b) => {
      const scoreWeightA = a.r.scores.overall * 2 + Math.log10(a.r.reviewCount + 1)
      const scoreWeightB = b.r.scores.overall * 2 + Math.log10(b.r.reviewCount + 1)
      const distancePenaltyA = a.distance / 1000
      const distancePenaltyB = b.distance / 1000
      const compositeA = scoreWeightA - distancePenaltyA
      const compositeB = scoreWeightB - distancePenaltyB
      return compositeB - compositeA
    })
    .map((x) => x.r)
}

