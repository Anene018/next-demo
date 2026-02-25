'use client'

import Link from 'next/link'
import posthog from 'posthog-js'

const ExploreBtn = () => {
  const handleClick = () => {
    posthog.capture('explore_events_clicked')
  }

  return (
    <button
      type='button'
      id='explore-btn'
      className='mt-7 mx-auto'
      onClick={handleClick}
    >
      <Link href='#events'>
        Explore Events
        <img
          src='/icons/arrow-down.svg'
          alt='down arrow'
          width={24}
          height={24}
        />
      </Link>
    </button>
  )
}

export default ExploreBtn
