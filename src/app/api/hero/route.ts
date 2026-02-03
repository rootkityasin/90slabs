import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

let cachedHero: any = null
let cachedAt = 0
const CACHE_TTL = 1000 * 30 // 30s

export async function GET() {
    try {
        if (cachedHero && Date.now() - cachedAt < CACHE_TTL) {
            return NextResponse.json(cachedHero)
        }

        const db = await getDatabase()
        const heroData = await db.collection('hero').findOne({})

        if (!heroData) {
            return NextResponse.json(
                { error: 'Hero content not found' },
                { status: 404 }
            )
        }

        cachedHero = heroData
        cachedAt = Date.now()
        return NextResponse.json(heroData)
    } catch (error) {
        console.error('Error fetching hero:', error)
        return NextResponse.json(
            { error: 'Failed to fetch hero content' },
            { status: 500 }
        )
    }
}
