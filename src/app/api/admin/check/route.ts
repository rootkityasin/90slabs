import { NextResponse } from 'next/server'

export async function GET() {
    const isConfigured = !!process.env.ADMIN_SECRET_KEY
    return NextResponse.json({ configured: isConfigured })
}
