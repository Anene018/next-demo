/**
 * Barrel file for all Mongoose models.
 *
 * Usage:
 *   import { Event, Booking } from "@/database";
 */

export { default as Event } from './event.model'
export { default as Booking } from './booking.model'

// Re-export interfaces so callers can type their variables without reaching
// into the individual model files.
export type { IEvent, IEventDocument } from './event.model'
export type { IBooking, IBookingDocument } from './booking.model'
