export type SchoolId = string
export type RestaurantId = string
export type ReviewId = string

export interface LatLng {
  lat: number
  lng: number
}

export interface School {
  id: SchoolId
  name: string
  alias?: string
  location: LatLng
}

export interface SchoolRef {
  schoolId: SchoolId
  distanceMeters: number
  walkingMinutes?: number
}

export interface Tag {
  id: string
  name: string
  category: 'scene' | 'price_value' | 'taste' | 'other'
}

export interface RestaurantScores {
  overall: number
  taste: number
  environment: number
  value: number
}

export interface RestaurantTagSummary {
  tagId: string
  tagName: string
  count: number
}

export interface Restaurant {
  id: RestaurantId
  name: string
  address: string
  location: LatLng
  avgPricePerPerson: number
  categories: string[]
  nearbySchools: SchoolRef[]
  scores: RestaurantScores
  reviewCount: number
  tagsSummary: RestaurantTagSummary[]
  imageUrl?: string
}

export interface Review {
  id: ReviewId
  restaurantId: RestaurantId
  schoolId: SchoolId
  authorNickname: string
  scores: RestaurantScores
  tags: string[]
  content?: string
  createdAt: string
  upvoteCount: number
  images?: string[]
}

export interface Vendor {
  id: string
  name: string
  location: LatLng
  category: string
  description?: string
  openTime?: string
}


