import { NextRequest, NextResponse } from 'next/server'
import { validateAdminKey, checkRateLimit, getClientIP, unauthorizedResponse, rateLimitResponse } from '@/lib/auth'
import { uploadImage, isCloudinaryConfigured } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
    // Check rate limit
    const ip = getClientIP(request)
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
        return rateLimitResponse()
    }

    // Validate admin key
    if (!validateAdminKey(request)) {
        return unauthorizedResponse()
    }

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
        return NextResponse.json(
            { error: 'Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment.' },
            { status: 500 }
        )
    }

    try {
        const body = await request.json()
        const { image, folder = '90sx' } = body

        if (!image) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 })
        }

        // Check if it's a base64 image
        if (!image.startsWith('data:image/')) {
            return NextResponse.json({ error: 'Invalid image format. Expected base64 image.' }, { status: 400 })
        }

        // Upload to Cloudinary
        const result = await uploadImage(image, folder)

        return NextResponse.json({
            success: true,
            url: result.url,
            publicId: result.publicId,
            width: result.width,
            height: result.height
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to upload image' },
            { status: 500 }
        )
    }
}
