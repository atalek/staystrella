import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function deleteCloudinaryImage(publicId: string) {
  if (!publicId) {
    throw new Error('No public ID provided for image deletion.')
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: 'image',
    })
    return result
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}
