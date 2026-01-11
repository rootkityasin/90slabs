import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
    url: string
    publicId: string
    width: number
    height: number
}

/**
 * Upload a base64 image to Cloudinary
 */
export async function uploadImage(
    base64Image: string,
    folder: string = '90sx'
): Promise<UploadResult> {
    try {
        const result = await cloudinary.uploader.upload(base64Image, {
            folder,
            resource_type: 'image',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        })

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        throw new Error('Failed to upload image to Cloudinary')
    }
}

/**
 * Delete an image from Cloudinary by public ID
 */
export async function deleteImage(publicId: string): Promise<boolean> {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return result.result === 'ok'
    } catch (error) {
        console.error('Cloudinary delete error:', error)
        return false
    }
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
    return !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    )
}

export default cloudinary
