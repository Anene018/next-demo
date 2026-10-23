import { NextResponse, NextRequest } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { connectToDatabase } from '@/lib/mongodb'
import Event from '@/database/event.model'

export async function POST (req: NextRequest) {
  try {
    await connectToDatabase()

    const formData = await req.formData()

    let event

    try {
      event = Object.fromEntries(formData.entries())
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { message: ' Invalid JSON format' },
        { status: 400 }
      )
    }

    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { message: 'Image is required' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'image', folder: 'DevEvents' },
          (error, result) => {
            if (error) return reject(error)

            resolve(result)
          }
        )
        .end(buffer)
    })

    event.image = (uploadResult as { secure_url: string }).secure_url

    console.log(event.image)

    const createdEvent = await Event.create(event)

    return NextResponse.json(
      { message: 'Created', createdEvent },
      { status: 201 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        message: 'Event creation failed',
        error: error instanceof Error ? error.message : 'Unkown'
      },
      { status: 500 }
    )
  }
}

export async function GET () {
  try {
    await connectToDatabase()

    const events = await Event.find().sort({ createdAt: -1 })

    return NextResponse.json({ events }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        message: 'Event retrieval failed',
        error: error instanceof Error ? error.message : 'Unkown'
      },
      { status: 500 }
    )
  }
}
