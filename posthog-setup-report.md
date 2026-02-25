<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into your Next.js App Router project (Dev Events Hub). This run installed the `posthog-js` and `posthog-node` packages, created the server-side PostHog client, updated the instrumentation file with important usage notes, and cleaned up debug code.

## What was done

- **`package.json`** — Added `posthog-js` and `posthog-node` as dependencies (previously missing from package.json).
- **`instrumentation-client.ts`** — Already correctly configured: initializes `posthog-js` with the `/ingest` reverse proxy, `capture_exceptions: true` for error tracking, and `defaults: '2026-01-30'`. Added important comment about not combining with PostHogProvider.
- **`next.config.ts`** — Already configured with `/ingest` rewrites and `skipTrailingSlashRedirect: true`. No changes needed.
- **`.env.local`** — Verified and updated `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` with the correct values.
- **`lib/posthog-server.ts`** *(new file)* — Created server-side PostHog client using `posthog-node` for server-side event tracking in API routes and Server Actions.
- **`components/ExploreBtn.tsx`** — Removed debug `console.log` statement; kept `explore_events_clicked` capture.
- **`components/EventCard.tsx`** — Already has `event_card_clicked` tracking with rich properties. No changes needed.
- **`components/NavBar.tsx`** — Already has `nav_link_clicked` tracking. No changes needed.
- **`components/FeaturedEventsTracker.tsx`** — Already has `featured_events_viewed` tracking. No changes needed.

## Events

| Event Name | Description | File |
|---|---|---|
| `featured_events_viewed` | User viewed the featured events section on the homepage (top of conversion funnel) | `components/FeaturedEventsTracker.tsx` |
| `explore_events_clicked` | User clicked the "Explore Events" CTA button on the homepage | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on a featured event card to view event details (with title, slug, location, date properties) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicked a navigation link in the top navbar (with label and href properties) | `components/NavBar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard — Analytics basics: https://us.posthog.com/project/320658/dashboard/1299401
- Event Discovery Funnel (conversion: viewed to explore to clicked): https://us.posthog.com/project/320658/insights/gfNAW71Y
- User Engagement Trends (daily totals for all key events): https://us.posthog.com/project/320658/insights/0ZKbgMC5
- Most Clicked Events (by title — which events attract the most interest): https://us.posthog.com/project/320658/insights/8R1VM7ZK
- Navigation Link Clicks (pie chart of nav destinations): https://us.posthog.com/project/320658/insights/kWRBqg4G
- Daily Active Users (unique users per day): https://us.posthog.com/project/320658/insights/kl8HnEGU

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
