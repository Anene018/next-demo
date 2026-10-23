import ExploreBtn from '@/components/ExploreBtn'
import EventCard from '@/components/EventCard'
import FeaturedEventsTracker from '@/components/FeaturedEventsTracker'
import { IEvent } from '@/database'
import { Suspense } from 'react'
import { cacheLife } from 'next/cache'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventsList = async () => {
  'use cache'
  cacheLife('hours')
  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      cache: 'no-store' // or next: { revalidate: 60 }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`)
    }

    const data = await response.json()
    const events: IEvent[] = data?.events ?? []

    return (
      <>
        <FeaturedEventsTracker eventCount={events.length} />
        <ul className='events list-none'>
          {events.map((event: IEvent) => (
            <li key={event.slug} className='contents'>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </>
    )
  } catch (error) {
    console.error('Error in EventsList:', error)
    return (
      <>
        <FeaturedEventsTracker eventCount={0} />
        <p className='text-gray-500 py-4'>No events available at this time.</p>
      </>
    )
  }
}

const Page = async () => {
  return (
    <section>
      <h1 className='text-center'>
        The Hub for Every Dev <br /> Event You Cant Miss
      </h1>
      <p className='text-center mt-5'>
        Hackathons, conferences, and meetups all in one place.
      </p>

      <ExploreBtn />

      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>
        <Suspense fallback={<p> Loading...</p>}>
          <EventsList />
        </Suspense>
      </div>
    </section>
  )
}

export default Page
