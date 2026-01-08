import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
    try {
        const db = await getDatabase()
        const servicesData = await db.collection('services').findOne({})

        if (!servicesData) {
            return NextResponse.json(
                { error: 'Services not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(servicesData)
    } catch (error) {
        console.error('Error fetching services:', error)
        return NextResponse.json(
            { error: 'Failed to fetch services' },
            { status: 500 }
        )
    }
}
