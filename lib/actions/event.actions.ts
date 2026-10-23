'use server'

import { Event } from '@/database'
import { connectToDatabase } from '../mongodb'

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectToDatabase()

    const event = await Event.findOne({ slug })
    // Inside your server action or query function (e.g., getSimilarEventsBySlug):
    const similarEvents = await Event.find({
      _id: { $ne: event?._id },
      tags: { $in: event?.tags }
    })
      .limit(4)
      .lean()

    // Ensure _id and dates are plain primitives:
    return similarEvents.map(item => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt?.toString?.() ?? item.createdAt,
      updatedAt: item.updatedAt?.toString?.() ?? item.updatedAt
    }))
  } catch (error) {
    console.log('Error fetching similar events:', error)
    return []
  }
}
