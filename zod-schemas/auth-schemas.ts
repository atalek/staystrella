import { z } from 'zod'

export const PasswordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(50, { message: 'Password must be less than 50 characters' })
  .trim()

export const EmailSchema = z
  .string()
  .min(6, { message: 'Email is required' })
  .max(50, { message: 'Email must be less than 50 characters' })
  .email({ message: 'Not a valid email' })
  .trim()
  .toLowerCase()

export const NameSchema = z
  .string()
  .trim()
  .min(3, { message: 'Name must be at least 3 characters long' })

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
})

export const RegisterSchema = LoginSchema.extend({
  name: NameSchema,
  confirmPassword: PasswordSchema,
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const RegisterUserSchema = LoginSchema.extend({
  name: NameSchema,
})

export const PasswordsSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
