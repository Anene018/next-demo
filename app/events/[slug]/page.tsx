import BookEvent from '@/components/BookEvent'
import EventCard from '@/components/EventCard'
import { IEvent } from '@/database'
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailItem = ({
  icon,
  alt,
  label
}: {
  icon: string
  alt: string
  label: string
}) => {
  return (
    <div className='flex-row-gap-2 items-center'>
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  )
}

const bookings = 10

const getEventData = async (slug: string) => {
  const response = await fetch(`${BASE_URL}/api/events/${slug}`)
  const { event } = await response.json()
  if (!event) {
    return notFound()
  }

  const {
    description,
    image,
    title,
    date,
    time,
    location,
    overview,
    venue,
    mode,
    agenda,
    organizer,
    tags,
    audience
  } = event

  return {
    description,
    image,
    title,
    date,
    time,
    location,
    overview,
    venue,
    mode,
    agenda,
    organizer,
    tags,
    audience
  }
}

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
  return (
    <div className='agenda'>
      <h2>Agenda</h2>
      <ul className='flex-col-gap-2'>
        {agendaItems.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className='flex flex-row gap-1.5 flex-wrap'>
      {tags.map((tag: string, index: number) => (
        <div className='pill' key={index}>
          {tag}
        </div>
      ))}
    </div>
  )
}
const EventContent = async ({
  params
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)

  const {
    description,
    image,
    title,
    date,
    time,
    location,
    overview,
    venue,
    mode,
    agenda,
    organizer,
    tags,
    audience
  } = await getEventData(slug)
  return (
    <section id='event'>
      <div className='header'>
        <h1>Event Decsription</h1>
        <p>{description}</p>
      </div>

      <div className='details'>
        {/* left side - event content  */}
        <div className='content'>
          <Image
            src={image}
            alt={title}
            width={800}
            height={800}
            className='banner'
          />

          <section className='flex-col-gap-2'>
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className='flex-col-gap-2'>
            <h2>Event Details</h2>
            <EventDetailItem
              icon='/icons/calendar.svg'
              alt='calender'
              label={date}
            />
            <EventDetailItem icon='/icons/clock.svg' alt='clock' label={time} />
            <EventDetailItem
              icon='/icons/pin.svg'
              alt='location'
              label={location}
            />
            <EventDetailItem icon='/icons/mode.svg' alt='mode' label={mode} />
            <EventDetailItem
              icon='/icons/audience.svg'
              alt='audience'
              label={audience}
            />
          </section>
          <EventAgenda agendaItems={agenda[0].split(',')} />

          <section className='flex-col-gap-2'>
            <h2>About the Organiser</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags[0].split(',')} />
        </div>

        {/* right side - booking form  */}
        <aside className='booking'>
          <div className='signup-card'>
            <h2>Book your spot</h2>
            {bookings > 0 ? (
              <p className='text-sm'>
                Join {bookings} people who have already booked their spot
              </p>
            ) : (
              <p className='text-sm'>Be the first to book your spot</p>
            )}

            <BookEvent />
          </div>
        </aside>
      </div>
      <div className='flex w-full flex-col gap-4 pt-20 '>
        <h2>Similar Events</h2>

        <div className='events'>
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.slug} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  )
}

const EventDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <EventContent params={params} />
      </Suspense>
    </>
  )
}

export default EventDetailPage
