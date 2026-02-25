"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

interface Props {
  eventCount: number;
}

const FeaturedEventsTracker = ({ eventCount }: Props) => {
  useEffect(() => {
    posthog.capture("featured_events_viewed", {
      event_count: eventCount,
    });
  }, [eventCount]);

  return null;
};

export default FeaturedEventsTracker;
