import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
    try {
        const db = await getDatabase()
        const heroData = await db.collection('hero').findOne({})

        if (!heroData) {
            return NextResponse.json(
                { error: 'Hero content not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(heroData)
    } catch (error) {
        console.error('Error fetching hero:', error)
        return NextResponse.json(
            { error: 'Failed to fetch hero content' },
            { status: 500 }
        )
    }
}
