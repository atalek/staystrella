import { z } from 'zod'

export const ImageSchema = z
  .string()
  .min(6, { message: 'Image must be at least 6 characters long' })
  .max(50, { message: 'Image must be less than 50 characters' })
  .trim()

export const DescriptionSchema = z
  .string()
  .min(10, { message: 'Description must be at least 10 characters' })
  .max(400, { message: 'Description must be less than 400 characters' })

export const PublicIdSchema = z
  .string()
  .min(6, { message: 'Image public id is required' })

export const CountrySelectValueSchema = z.object({
  flag: z.string(),
  label: z.string(),
  latlng: z.array(z.number()),
  region: z.string(),
  value: z.string(),
})

export const ListingValuesSchema = z.object({
  category: z.string().min(3, { message: 'Category is required' }),
  locationValue: CountrySelectValueSchema.optional().refine(val => val != null, {
    message: 'Location is required',
  }),
  guestCount: z.number().min(1, { message: 'Guest count must be at least 1' }),
  roomCount: z.number().min(1, { message: 'Room count must be at least 1' }),
  bathroomCount: z.number().min(1, { message: 'Bathroom count must be at least 1' }),
  imageSrc: ImageSchema,
  price: z.number().min(1, { message: 'Price must be a number greater than 0' }),
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: DescriptionSchema,
  imagePublicId: PublicIdSchema,
})

export const ReservationSchema = z.object({
  listingId: z.string().min(16, { message: 'Invalid listing ID' }),
  startDate: z
    .string()
    .min(10, { message: 'Invalid start date' })
    .regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z
    .string()
    .min(10, { message: 'Invalid end date' })
    .regex(/^\d{4}-\d{2}-\d{2}$/),
})
