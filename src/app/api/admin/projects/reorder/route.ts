import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { validateAdminKey, unauthorizedResponse } from '@/lib/auth'

export async function POST(request: NextRequest) {
    if (!validateAdminKey(request)) {
        return unauthorizedResponse()
    }

    try {
        const { items } = await request.json()

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid items format' }, { status: 400 })
        }

        const db = await getDatabase()
        const collection = db.collection('projects')

        // Bulk write operations
        const operations = items.map((item: { id: number; order: number }) => ({
            updateOne: {
                filter: { id: item.id },
                update: { $set: { order: item.order } }
            }
        }))

        if (operations.length > 0) {
            await collection.bulkWrite(operations)
        }

        return NextResponse.json({ success: true, count: operations.length })
    } catch (error) {
        console.error('Error reordering projects:', error)
        return NextResponse.json({ error: 'Failed to reorder projects' }, { status: 500 })
    }
}
