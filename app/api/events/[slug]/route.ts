import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Event from '@/database/event.model'
import type { IEventDocument } from '@/database/event.model'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape of the params object supplied by Next.js for this dynamic segment. */
interface RouteParams {
  params: Promise<{ slug: string }>
}

// ─── Route Handler ────────────────────────────────────────────────────────────

/**
 * GET /api/events/[slug]
 *
 * Retrieves a single event that matches the given `slug`.
 *
 * Responses:
 *  200 – Event found; returns `{ event }`.
 *  400 – `slug` is missing or blank after trimming.
 *  404 – No event exists with the given slug.
 *  500 – Unexpected server / database error.
 */
export async function GET (
  _req: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // ── 1. Resolve and validate the dynamic route parameter ──────────────────
    const { slug } = await params
    const trimmedSlug = slug?.trim().toLowerCase()

    if (!trimmedSlug) {
      return NextResponse.json(
        { message: 'slug is required and must not be empty' },
        { status: 400 }
      )
    }

    // ── 2. Open (or reuse) the database connection ───────────────────────────
    await connectToDatabase()

    // ── 3. Query the Event collection ────────────────────────────────────────
    const event: IEventDocument | null = await Event.findOne({
      slug: trimmedSlug
    })

    // ── 4. Handle not-found ──────────────────────────────────────────────────
    if (!event) {
      return NextResponse.json(
        { message: `No event found with slug: "${trimmedSlug}"` },
        { status: 404 }
      )
    }

    // ── 5. Return the matched event ──────────────────────────────────────────
    return NextResponse.json({ event }, { status: 200 })
  } catch (error: unknown) {
    // ── 6. Catch-all for unexpected errors ───────────────────────────────────
    console.error('[GET /api/events/[slug]]', error)

    return NextResponse.json(
      {
        message: 'Failed to retrieve event',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
