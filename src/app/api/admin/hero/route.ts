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

// PUT - Update hero content
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

        const heroDoc = await db.collection('hero').findOne({})

        if (!heroDoc) {
            return NextResponse.json({ error: 'Hero data not found' }, { status: 404 })
        }

        const updateData: Record<string, unknown> = {}

        if (body.headline1) {
            const check = validateInput(body.headline1, 'string', 100)
            if (check.valid) updateData.headline1 = check.value
        }
        if (body.headline2) {
            const check = validateInput(body.headline2, 'string', 100)
            if (check.valid) updateData.headline2 = check.value
        }
        if (body.description) {
            const check = validateInput(body.description, 'string', 500)
            if (check.valid) updateData.description = check.value
        }
        if (body.primaryCta) {
            updateData.primaryCta = {
                text: body.primaryCta.text ? validateInput(body.primaryCta.text, 'string', 50).value : heroDoc.primaryCta?.text,
                href: body.primaryCta.href ? validateInput(body.primaryCta.href, 'string', 100).value : heroDoc.primaryCta?.href
            }
        }
        if (body.secondaryCta) {
            updateData.secondaryCta = {
                text: body.secondaryCta.text ? validateInput(body.secondaryCta.text, 'string', 50).value : heroDoc.secondaryCta?.text,
                href: body.secondaryCta.href ? validateInput(body.secondaryCta.href, 'string', 100).value : heroDoc.secondaryCta?.href
            }
        }

        await db.collection('hero').updateOne(
            { _id: heroDoc._id },
            { $set: updateData }
        )

        return NextResponse.json({ success: true, updated: updateData })
    } catch (error) {
        console.error('Error updating hero:', error)
        return NextResponse.json({ error: 'Failed to update hero' }, { status: 500 })
    }
}
