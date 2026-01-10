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

// POST - Create new member
export async function POST(request: NextRequest) {
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

        const nameCheck = validateInput(body.name, 'string', 100)
        const roleCheck = validateInput(body.role, 'string', 100)
        const imageCheck = validateInput(body.image, 'string', 50000) // Allow base64 images

        if (!nameCheck.valid || !roleCheck.valid) {
            return NextResponse.json(
                { error: 'Invalid input. Required: name, role' },
                { status: 400 }
            )
        }

        const db = await getDatabase()

        // Get max ID
        const lastMember = await db.collection('members').find().sort({ id: -1 }).limit(1).toArray()
        const newId = lastMember.length > 0 ? (lastMember[0].id || 0) + 1 : 1

        const newMember = {
            id: newId,
            name: nameCheck.value,
            role: roleCheck.value,
            image: imageCheck.valid ? imageCheck.value : ''
        }

        await db.collection('members').insertOne(newMember)

        return NextResponse.json({ success: true, member: newMember }, { status: 201 })
    } catch (error) {
        console.error('Error creating member:', error)
        return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })
    }
}

// PUT - Update existing member
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

        if (!body.id) {
            return NextResponse.json({ error: 'Member ID required' }, { status: 400 })
        }

        const db = await getDatabase()

        const updateData: Record<string, unknown> = {}

        if (body.name) {
            const check = validateInput(body.name, 'string', 100)
            if (check.valid) updateData.name = check.value
        }
        if (body.role) {
            const check = validateInput(body.role, 'string', 100)
            if (check.valid) updateData.role = check.value
        }
        if (body.image) {
            const check = validateInput(body.image, 'string', 50000)
            if (check.valid) updateData.image = check.value
        }

        const result = await db.collection('members').updateOne(
            { id: body.id },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, updated: updateData })
    } catch (error) {
        console.error('Error updating member:', error)
        return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
    }
}

// DELETE - Remove member
export async function DELETE(request: NextRequest) {
    const ip = getClientIP(request)
    const rateCheck = checkRateLimit(ip)
    if (!rateCheck.allowed) {
        return rateLimitResponse()
    }

    if (!validateAdminKey(request)) {
        return unauthorizedResponse()
    }

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Member ID required' }, { status: 400 })
        }

        const db = await getDatabase()
        const result = await db.collection('members').deleteOne({ id: parseInt(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, deleted: id })
    } catch (error) {
        console.error('Error deleting member:', error)
        return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
    }
}
