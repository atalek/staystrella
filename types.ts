export type CountrySelectValue = {
  flag: string
  label: string
  latlng: number[]
  region: string
  value: string
}

export type CategoryValue = {
  label: string
  icon: string
  description: string
}

export type ListingData = {
  category: string
  locationValue: CountrySelectValue
  guestCount: number
  roomCount: number
  bathroomCount: number
  imageSrc: string
  price: number
  title: string
  description: string
}

export type AuthUser = {
  id: string
  name: string | null
  image: string
  description?: string
}

export type Listing = {
  id: string
  category?: string
  locationValue: string
  guestCount?: number
  roomCount?: number
  bathroomCount?: number
  imageSrc: string
  price?: number
  title: string
  imagePublicId?: string
  description?: string
  reservations?: Reservation[]
  auth_user?: AuthUser
  cratedAt?: string | null
}

export type Reservation = {
  id: string
  totalPrice: number
  startDate: string
  endDate: string
  listingId: string
  user?: AuthUser
}

export type ReservationWithListing = Reservation & {
  listing: Listing
}

export type QueryParams = {
  page?: string
  category?: string
  locationValue?: string
  roomCount?: number
  guestCount?: number
  bathroomCount?: number
  startDate?: string
  endDate?: string
}

export type UpdateProfileData = {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
  image?: string
  description?: string
  imagePublicId?: string
}

export type MyTripsType = {
  reservation: Reservation
  listing: Listing
  user: AuthUser
}

export type UserProfileData = {
  listings: Listing[]
  user: AuthUser
}
