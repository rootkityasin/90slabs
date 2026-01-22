import { NextRequest, NextResponse } from 'next/server'
import { validateAdminKey } from '@/lib/auth'

export async function GET(request: NextRequest) {
    const isConfigured = !!process.env.ADMIN_SECRET_KEY
    const isValid = validateAdminKey(request)
    return NextResponse.json({ configured: isConfigured, valid: isValid })
}
