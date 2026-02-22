import Image from 'next/image'
import Link from 'next/link'

interface Props {
  image: string
  title: string
  slug: string
  location: string
  date: string
  time: string
}

const EventCard = ({ image, title, slug, location, date, time }: Props) => {
  return (
    <Link href={`/events/${slug}`} id='event-card'>
      <Image
        className='poster'
        src={image}
        alt={title}
        width={410}
        height={300}
      />
      <div className='flex flex-row gap-2'>
        <Image
          src='/icons/pin.svg'
          alt='location'
          width={14}
          height={14}
        ></Image>
        <p className='location'>{location}</p>
      </div>
      <p className='title'>{title}</p>
      <div className='datetime'>
        <div className=''>
          <Image
            src='/icons/calendar.svg'
            alt='date'
            width={14}
            height={14}
          ></Image>
          <p className='date'>{date}</p>
        </div>
        <div className=''>
          <Image
            src='/icons/clock.svg'
            alt='time'
            width={14}
            height={14}
          ></Image>
          <p className='time'>{time}</p>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
