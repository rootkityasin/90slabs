import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import {
    validateAdminKey,
    checkRateLimit,
    getClientIP,
    unauthorizedResponse,
    rateLimitResponse,
    sanitizeString,
    validateInput
} from '@/lib/auth'
import { ObjectId } from 'mongodb'

// POST - Create new project
export async function POST(request: NextRequest) {
    // Rate limiting
    const ip = getClientIP(request)
    const rateCheck = checkRateLimit(ip)
    if (!rateCheck.allowed) {
        return rateLimitResponse()
    }

    // Auth check
    if (!validateAdminKey(request)) {
        return unauthorizedResponse()
    }

    try {
        const body = await request.json()

        // Validate required fields
        const titleCheck = validateInput(body.title, 'string', 200)
        const categoryCheck = validateInput(body.category, 'string', 100)
        const descriptionCheck = validateInput(body.description, 'string', 1000)
        const yearCheck = validateInput(body.year, 'string', 10)
        const imageCheck = validateInput(body.image, 'string', 2000)
        const linkCheck = validateInput(body.link, 'string', 500) // Optional deployed link

        if (!titleCheck.valid || !categoryCheck.valid || !descriptionCheck.valid) {
            return NextResponse.json(
                { error: 'Invalid input. Required: title, category, description' },
                { status: 400 }
            )
        }

        const db = await getDatabase()

        // Get max ID for new project
        const lastProject = await db.collection('projects').find().sort({ id: -1 }).limit(1).toArray()
        const newId = lastProject.length > 0 ? (lastProject[0].id || 0) + 1 : 1

        const newProject = {
            id: newId,
            title: titleCheck.value,
            category: categoryCheck.value,
            description: descriptionCheck.value,
            year: yearCheck.valid ? yearCheck.value : new Date().getFullYear().toString(),
            image: imageCheck.valid ? imageCheck.value : '',
            link: linkCheck.valid ? linkCheck.value : '',
            tech: Array.isArray(body.tech) ? body.tech.map((t: unknown) => sanitizeString(t)) : []
        }

        await db.collection('projects').insertOne(newProject)

        return NextResponse.json({ success: true, project: newProject }, { status: 201 })
    } catch (error) {
        console.error('Error creating project:', error)
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }
}

// PUT - Update existing project
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
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
        }

        const db = await getDatabase()

        const updateData: Record<string, unknown> = {}

        if (body.title) {
            const check = validateInput(body.title, 'string', 200)
            if (check.valid) updateData.title = check.value
        }
        if (body.category) {
            const check = validateInput(body.category, 'string', 100)
            if (check.valid) updateData.category = check.value
        }
        if (body.description) {
            const check = validateInput(body.description, 'string', 1000)
            if (check.valid) updateData.description = check.value
        }
        if (body.year) {
            const check = validateInput(body.year, 'string', 10)
            if (check.valid) updateData.year = check.value
        }
        if (body.image) {
            const check = validateInput(body.image, 'string', 2000)
            if (check.valid) updateData.image = check.value
        }
        if (body.link !== undefined) {
            const check = validateInput(body.link, 'string', 500)
            if (check.valid) updateData.link = check.value
        }
        if (body.tech && Array.isArray(body.tech)) {
            updateData.tech = body.tech.map((t: unknown) => sanitizeString(t))
        }

        const result = await db.collection('projects').updateOne(
            { id: body.id },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, updated: updateData })
    } catch (error) {
        console.error('Error updating project:', error)
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
    }
}

// DELETE - Remove project
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
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
        }

        const db = await getDatabase()
        const result = await db.collection('projects').deleteOne({ id: parseInt(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, deleted: id })
    } catch (error) {
        console.error('Error deleting project:', error)
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
    }
}
