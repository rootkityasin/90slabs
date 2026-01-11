import { MongoClient, ObjectId } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env and .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Configure Cloudinary
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET
const MONGODB_URI = process.env.MONGODB_URI

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.error('❌ Cloudinary environment variables are missing')
    process.exit(1)
}

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing')
    process.exit(1)
}

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
})

async function uploadToCloudinary(imageStr: string, folder: string) {
    try {
        const result = await cloudinary.uploader.upload(imageStr, {
            folder,
            resource_type: 'image',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        })
        return result.secure_url
    } catch (error) {
        console.error('  ❌ Upload failed:', error)
        return null
    }
}

async function migrate() {
    const client = new MongoClient(MONGODB_URI!)

    try {
        console.log('🔗 Connecting to MongoDB...')
        await client.connect()
        const db = client.db('90sX-portfolio')
        console.log('✅ Connected to database')

        // 1. Migrate Projects
        console.log('\n📦 Migrating Projects...')
        const projects = await db.collection('projects').find({}).toArray()
        let projectsUpdated = 0

        for (const project of projects) {
            if (project.image && project.image.startsWith('data:image')) {
                console.log(`  ↑ Uploading image for project: "${project.title}"...`)
                const newUrl = await uploadToCloudinary(project.image, '90sx/projects')

                if (newUrl) {
                    await db.collection('projects').updateOne(
                        { _id: project._id },
                        { $set: { image: newUrl } }
                    )
                    console.log(`  ✓ Updated project "${project.title}" with Cloudinary URL`)
                    projectsUpdated++
                }
            } else {
                console.log(`  • Project "${project.title}" already has a URL (skipping)`)
            }
        }
        console.log(`✨ Projects migration complete. Updated: ${projectsUpdated}/${projects.length}`)


        // 2. Migrate Members
        console.log('\n👥 Migrating Members...')
        const members = await db.collection('members').find({}).toArray()
        let membersUpdated = 0

        for (const member of members) {
            if (member.image && member.image.startsWith('data:image')) {
                console.log(`  ↑ Uploading image for member: "${member.name}"...`)
                const newUrl = await uploadToCloudinary(member.image, '90sx/members')

                if (newUrl) {
                    await db.collection('members').updateOne(
                        { _id: member._id },
                        { $set: { image: newUrl } }
                    )
                    console.log(`  ✓ Updated member "${member.name}" with Cloudinary URL`)
                    membersUpdated++
                }
            } else {
                console.log(`  • Member "${member.name}" already has a URL (skipping)`)
            }
        }
        console.log(`✨ Members migration complete. Updated: ${membersUpdated}/${members.length}`)

    } catch (error) {
        console.error('❌ Migration error:', error)
    } finally {
        await client.close()
        console.log('\n🔌 Connection closed')
    }
}

migrate()
