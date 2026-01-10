import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY

// Rate limiting storage (in-memory for simplicity, consider Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30 // 30 requests per minute

/**
 * Validates the admin API key from request headers
 */
export function validateAdminKey(request: NextRequest): boolean {
    const providedKey = request.headers.get('X-Admin-Key')

    if (!ADMIN_SECRET_KEY) {
        console.error('ADMIN_SECRET_KEY not configured in environment')
        return false
    }

    if (!providedKey) {
        return false
    }

    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(providedKey, ADMIN_SECRET_KEY)
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
        return false
    }

    let result = 0
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return result === 0
}

/**
 * Rate limiting check for admin routes
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now()
    const record = rateLimitMap.get(ip)

    if (!record || now > record.resetTime) {
        // Reset or initialize
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
        return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
    }

    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        return { allowed: false, remaining: 0 }
    }

    record.count++
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count }
}

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }
    return request.headers.get('x-real-ip') || 'unknown'
}

/**
 * Unauthorized response helper
 */
export function unauthorizedResponse(message = 'Unauthorized') {
    return NextResponse.json(
        { error: message },
        { status: 401 }
    )
}

/**
 * Rate limit exceeded response helper
 */
export function rateLimitResponse() {
    return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
    )
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: unknown): string {
    if (typeof input !== 'string') {
        return ''
    }
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim()
}

/**
 * Validate and sanitize input for specific types
 */
export function validateInput(value: unknown, type: 'string' | 'number' | 'boolean' | 'array', maxLength = 10000): { valid: boolean; value: unknown } {
    switch (type) {
        case 'string':
            if (typeof value !== 'string') return { valid: false, value: null }
            if (value.length > maxLength) return { valid: false, value: null }
            return { valid: true, value: sanitizeString(value) }

        case 'number':
            const num = Number(value)
            if (isNaN(num)) return { valid: false, value: null }
            return { valid: true, value: num }

        case 'boolean':
            return { valid: typeof value === 'boolean', value: !!value }

        case 'array':
            if (!Array.isArray(value)) return { valid: false, value: null }
            return { valid: true, value }

        default:
            return { valid: false, value: null }
    }
}
