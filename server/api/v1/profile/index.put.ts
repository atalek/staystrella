import { eq } from 'drizzle-orm'
import { db } from '~/server/db/drizzle'
import { user } from '~/server/db/schema'
import { hash, verify } from '@node-rs/argon2'
import {
  BackendUpdatePasswordSchema,
  UpdateUserInfoSchema,
  UserProfileInfoSchema,
} from '~/zod-schemas/profile-schema'
import type { UpdateProfileData } from '~/types'
import { deleteCloudinaryImage } from '~/server/utils/cloudinary'

export default eventHandler(async event => {
  try {
    const currentUser = event.context.user
    if (!currentUser) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const body = await readBody<UpdateProfileData>(event)

    if (body.name && body.email) {
      const userInfoResult = UpdateUserInfoSchema.safeParse({
        name: body.name,
        email: body.email,
      })
      if (!userInfoResult.success) {
        throw createError({
          statusCode: 400,
          message:
            userInfoResult.error.errors.map(e => e.message).join(', ') ||
            'Invalid name or email',
        })
      }
      const { name, email } = userInfoResult.data

      if (email) {
        const [existingUser] = await db
          .select({ id: user.id })
          .from(user)
          .where(eq(user.email, email))

        if (existingUser && existingUser.id !== currentUser.id) {
          throw createError({
            statusCode: 400,
            message: 'Email is already in use',
          })
        } else {
          await db.update(user).set({ name, email }).where(eq(user.id, currentUser.id))
          return { statusCode: 201, message: 'Profile updated' }
        }
      }
    }

    if (body.description || body.image || body.imagePublicId) {
      const userProfileInfo = UserProfileInfoSchema.safeParse({
        description: body.description,
        image: body.image,
        imagePublicId: body.imagePublicId,
      })

      if (!userProfileInfo.success) {
        throw createError({
          statusCode: 400,
          message:
            userProfileInfo.error.errors.map(e => e.message).join(', ') ||
            'Invalid image or description',
        })
      }
      const updateData = { description: '', image: '', imagePublicId: '' }
      if (userProfileInfo.data.description) {
        updateData.description = userProfileInfo.data.description
      }
      if (userProfileInfo.data.image) {
        updateData.image = userProfileInfo.data.image
      }
      if (userProfileInfo.data.imagePublicId) {
        updateData.imagePublicId = userProfileInfo.data.imagePublicId
      }

      const [oldUser] = await db
        .select({ imagePublicId: user.imagePublicId })
        .from(user)
        .where(eq(user.id, currentUser.id))

      const [updatedUser] = await db
        .update(user)
        .set(updateData)
        .where(eq(user.id, currentUser.id))
        .returning()

      if (
        oldUser.imagePublicId !== updatedUser.imagePublicId &&
        currentUser.image !== 'bdzdebalgjgnbsgevvkd.webp' &&
        oldUser.imagePublicId
      ) {
        await deleteCloudinaryImage(oldUser.imagePublicId)
      }

      return { statusCode: 201, message: 'Profile updated' }
    }

    if (body.currentPassword && body.newPassword && currentUser.provider === 'email') {
      const passwordUpdateResult = BackendUpdatePasswordSchema.safeParse({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      })

      if (!passwordUpdateResult.success) {
        throw createError({
          statusCode: 400,
          message:
            passwordUpdateResult.error.errors.map(e => e.message).join(', ') ||
            'Invalid password format',
        })
      }
      const { currentPassword, newPassword } = passwordUpdateResult.data
      const [userToUpdate] = await db
        .select({ password: user.password })
        .from(user)
        .where(eq(user.id, currentUser.id))

      const hashedNewPassword = await hash(newPassword, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      })

      const validPassword = await verify(
        userToUpdate.password as string,
        currentPassword,
        {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        },
      )

      if (!validPassword) {
        throw createError({
          statusCode: 404,
          message: 'Incorrect password',
        })
      }

      await db
        .update(user)
        .set({ password: hashedNewPassword })
        .where(eq(user?.id, currentUser.id))

      return { statusCode: 201, message: 'Password updated' }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Something went wrong',
    })
  }
})
