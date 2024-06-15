import { z } from 'zod'
import { EmailSchema, PasswordSchema } from './auth-schemas'
import { DescriptionSchema, ImageSchema, PublicIdSchema } from './listing-schema'

export const UpdateUserInfoSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(50, { message: 'Name must be less than 50 characters' })
    .trim(),
  email: EmailSchema,
})

export const UpdatePasswordSchema = z
  .object({
    currentPassword: PasswordSchema,
    newPassword: PasswordSchema,
    confirmNewPassword: PasswordSchema,
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })

export const BackendUpdatePasswordSchema = z.object({
  currentPassword: PasswordSchema,
  newPassword: PasswordSchema,
})

export const UserProfileInfoSchema = z.object({
  image: ImageSchema.optional(),
  description: DescriptionSchema.optional(),
  imagePublicId: PublicIdSchema.optional(),
})
