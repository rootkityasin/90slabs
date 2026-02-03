import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

let cachedAbout: any = null
let cachedAt = 0
const CACHE_TTL = 1000 * 30 // 30s

export async function GET() {
    try {
        // Return cached response when fresh
        if (cachedAbout && Date.now() - cachedAt < CACHE_TTL) {
            return NextResponse.json(cachedAbout)
        }

        const db = await getDatabase()
        const aboutData = await db.collection('about').findOne({})

        if (!aboutData) {
            return NextResponse.json(
                { error: 'About content not found' },
                { status: 404 }
            )
        }

        cachedAbout = aboutData
        cachedAt = Date.now()

        return NextResponse.json(aboutData)
    } catch (error) {
        console.error('Error fetching about:', error)
        return NextResponse.json(
            { error: 'Failed to fetch about content' },
            { status: 500 }
        )
    }
}
