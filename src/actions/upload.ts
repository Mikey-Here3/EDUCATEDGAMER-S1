'use server'

import cloudinary from '@/lib/cloudinary'

export async function uploadImageToCloudinary(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File | null
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`

    const uploadResponse = await cloudinary.uploader.upload(base64Data, {
      folder: 'educated-gamer-tournaments',
      resource_type: 'image',
    })

    return {
      success: true,
      url: uploadResponse.secure_url,
    }
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return { success: false, error: error.message || 'Failed to upload image' }
  }
}
