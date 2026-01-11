'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, Cloud } from 'lucide-react'

interface ImageUploadProps {
    value: string
    onChange: (image: string) => void
    resolution: string
    maxSize?: number // in KB
    aspectRatio?: string
    apiKey?: string // Admin API key for Cloudinary upload
    folder?: string // Cloudinary folder
}

export default function ImageUpload({
    value,
    onChange,
    resolution,
    maxSize = 4096,
    aspectRatio = '1:1',
    apiKey,
    folder = '90sx'
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const uploadToCloudinary = async (base64Image: string): Promise<string> => {
        if (!apiKey) {
            // No API key, return base64 as fallback
            return base64Image
        }

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Key': apiKey
                },
                body: JSON.stringify({ image: base64Image, folder })
            })

            const data = await res.json()

            if (!res.ok) {
                // If Cloudinary fails, fall back to base64
                console.warn('Cloudinary upload failed, using base64:', data.error)
                return base64Image
            }

            return data.url
        } catch (err) {
            console.warn('Cloudinary upload error, using base64:', err)
            return base64Image
        }
    }

    const handleFile = async (file: File) => {
        setError(null)

        // Check file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file')
            return
        }

        // Check file size
        if (file.size > maxSize * 1024) {
            setError(`Image too large (max ${maxSize}KB)`)
            return
        }

        setUploading(true)

        const reader = new FileReader()
        reader.onload = async () => {
            const base64 = reader.result as string

            // Try to upload to Cloudinary
            const imageUrl = await uploadToCloudinary(base64)
            onChange(imageUrl)
            setUploading(false)
        }
        reader.onerror = () => {
            setError('Failed to read file')
            setUploading(false)
        }
        reader.readAsDataURL(file)
    }

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const handleClick = () => {
        inputRef.current?.click()
    }

    const handleRemove = () => {
        onChange('')
        if (inputRef.current) inputRef.current.value = ''
    }

    const isCloudinaryUrl = value?.includes('cloudinary.com')

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm text-gray-400">Photo</label>
                <div className="flex items-center gap-2">
                    {isCloudinaryUrl && (
                        <span className="flex items-center gap-1 text-xs text-[#008f7d]">
                            <Cloud className="w-3 h-3" /> CDN
                        </span>
                    )}
                    <span className="text-xs text-gray-500">
                        {resolution} ({aspectRatio})
                    </span>
                </div>
            </div>

            {value ? (
                <div className="relative inline-block">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-xl border border-[#008f7d]/30"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={!uploading ? handleClick : undefined}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        flex flex-col items-center justify-center gap-3 p-6
                        border-2 border-dashed rounded-xl
                        transition-all duration-200
                        ${uploading ? 'cursor-wait' : 'cursor-pointer'}
                        ${isDragging
                            ? 'border-[#008f7d] bg-[#008f7d]/10'
                            : 'border-[#008f7d]/30 hover:border-[#008f7d]/60 bg-[#001210]'
                        }
                    `}
                >
                    <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-[#008f7d]/20' : 'bg-[#008f7d]/10'}`}>
                        {uploading ? (
                            <Loader2 className="w-6 h-6 text-[#008f7d] animate-spin" />
                        ) : isDragging ? (
                            <Upload className="w-6 h-6 text-[#008f7d]" />
                        ) : (
                            <ImageIcon className="w-6 h-6 text-[#008f7d]" />
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-white">
                            {uploading ? 'Uploading to cloud...' : isDragging ? 'Drop image here' : 'Drag and drop or click to upload'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, WebP up to {Math.round(maxSize / 1024)}MB
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                disabled={uploading}
            />

            {/* URL input as alternative */}
            <input
                type="text"
                placeholder="Or paste image URL"
                value={value?.startsWith('data:') ? '' : value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 bg-[#001210] border border-[#008f7d]/30 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d] text-sm"
                disabled={uploading}
            />
        </div>
    )
}
