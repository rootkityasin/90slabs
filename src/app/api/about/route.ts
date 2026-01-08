import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
    try {
        const db = await getDatabase()
        const aboutData = await db.collection('about').findOne({})

        if (!aboutData) {
            return NextResponse.json(
                { error: 'About content not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(aboutData)
    } catch (error) {
        console.error('Error fetching about:', error)
        return NextResponse.json(
            { error: 'Failed to fetch about content' },
            { status: 500 }
        )
    }
}
