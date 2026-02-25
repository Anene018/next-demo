import ExploreBtn from '@/components/ExploreBtn'
import EventCard from '@/components/EventCard'
import FeaturedEventsTracker from '@/components/FeaturedEventsTracker'
import { events } from '@/lib/constants'

const Page = () => {
  return (
    <section>
      <h1 className='text-center'>
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className='text-center mt-5'>
        Hackathons, conferences, and meetups all in one place.
      </p>

      <ExploreBtn />

      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>
        <FeaturedEventsTracker eventCount={events.length} />
        <ul className='events list-none'>
          {events.map(event => (
            <li key={event.slug}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page
