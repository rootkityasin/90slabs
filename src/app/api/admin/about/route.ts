import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import {
    validateAdminKey,
    checkRateLimit,
    getClientIP,
    unauthorizedResponse,
    rateLimitResponse,
    validateInput
} from '@/lib/auth'

// PUT - Update about content
export async function PUT(request: NextRequest) {
    const ip = getClientIP(request)
    const rateCheck = checkRateLimit(ip)
    if (!rateCheck.allowed) {
        return rateLimitResponse()
    }

    if (!validateAdminKey(request)) {
        return unauthorizedResponse()
    }

    try {
        const body = await request.json()
        const db = await getDatabase()

        const aboutDoc = await db.collection('about').findOne({})

        if (!aboutDoc) {
            return NextResponse.json({ error: 'About data not found' }, { status: 404 })
        }

        const updateData: Record<string, unknown> = {}

        if (body.label) {
            const check = validateInput(body.label, 'string', 50)
            if (check.valid) updateData.label = check.value
        }
        if (body.title) {
            const check = validateInput(body.title, 'string', 100)
            if (check.valid) updateData.title = check.value
        }
        if (body.titleHighlight) {
            const check = validateInput(body.titleHighlight, 'string', 100)
            if (check.valid) updateData.titleHighlight = check.value
        }
        if (body.paragraphs && Array.isArray(body.paragraphs)) {
            // Validate each paragraph - allow HTML for styling
            updateData.paragraphs = body.paragraphs.map((p: unknown) => {
                if (typeof p === 'string' && p.length <= 1000) {
                    return p // Allow HTML in paragraphs for styling
                }
                return ''
            }).filter(Boolean)
        }
        if (body.graphicText) {
            const check = validateInput(body.graphicText, 'string', 50)
            if (check.valid) updateData.graphicText = check.value
        }
        if (body.graphicSubtext) {
            const check = validateInput(body.graphicSubtext, 'string', 50)
            if (check.valid) updateData.graphicSubtext = check.value
        }

        await db.collection('about').updateOne(
            { _id: aboutDoc._id },
            { $set: updateData }
        )

        return NextResponse.json({ success: true, updated: updateData })
    } catch (error) {
        console.error('Error updating about:', error)
        return NextResponse.json({ error: 'Failed to update about' }, { status: 500 })
    }
}
