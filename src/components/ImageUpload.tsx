'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
    value: string
    onChange: (image: string) => void
    resolution: string
    maxSize?: number // in KB
    aspectRatio?: string
}

export default function ImageUpload({
    value,
    onChange,
    resolution,
    maxSize = 500,
    aspectRatio = '1:1'
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = (file: File) => {
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

        const reader = new FileReader()
        reader.onload = () => {
            onChange(reader.result as string)
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

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm text-gray-400">Photo</label>
                <span className="text-xs text-[#008f7d]">
                    {resolution} ({aspectRatio}) - Max {maxSize}KB
                </span>
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
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        flex flex-col items-center justify-center gap-3 p-6
                        border-2 border-dashed rounded-xl cursor-pointer
                        transition-all duration-200
                        ${isDragging
                            ? 'border-[#008f7d] bg-[#008f7d]/10'
                            : 'border-[#008f7d]/30 hover:border-[#008f7d]/60 bg-[#001210]'
                        }
                    `}
                >
                    <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-[#008f7d]/20' : 'bg-[#008f7d]/10'}`}>
                        {isDragging ? (
                            <Upload className="w-6 h-6 text-[#008f7d]" />
                        ) : (
                            <ImageIcon className="w-6 h-6 text-[#008f7d]" />
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-white">
                            {isDragging ? 'Drop image here' : 'Drag and drop or click to upload'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, WebP up to {maxSize}KB
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
            />

            {/* URL input as alternative */}
            <input
                type="text"
                placeholder="Or paste image URL"
                value={value?.startsWith('data:') ? '' : value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 bg-[#001210] border border-[#008f7d]/30 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d] text-sm"
            />
        </div>
    )
}
