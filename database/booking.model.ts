import mongoose, { Document, Model, Schema, Types } from 'mongoose'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape of a raw Booking document (fields stored in MongoDB). */
export interface IBooking {
  /** Reference to the associated Event document. */
  eventId: Types.ObjectId
  /** Valid email address of the attendee. */
  email: string
  createdAt: Date
  updatedAt: Date
}

/** Mongoose Document interface combining IBooking with Document methods. */
export type IBookingDocument = IBooking & Document

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Basic RFC-5322-inspired email validation regex. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Schema ───────────────────────────────────────────────────────────────────

const BookingSchema = new Schema<IBookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event', // populates correctly with Event.find()
      required: [true, 'eventId is required'],
      // Index improves query performance when filtering bookings by event.
      index: true
    },

    email: {
      type: String,
      required: [true, 'email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => EMAIL_REGEX.test(v),
        message: (props: { value: string }) =>
          `"${props.value}" is not a valid email address`
      },
      index: true,
      unique: true
    }
  },
  {
    // Automatically adds and maintains `createdAt` and `updatedAt`.
    timestamps: true
  }
)

// ─── Pre-save Hook ────────────────────────────────────────────────────────────

/**
 * Validates that the referenced Event actually exists before persisting a Booking.
 * This guards against orphaned bookings when `eventId` changes or on initial creation.
 */
BookingSchema.pre<IBookingDocument>('save', async function () {
  if (this.isNew || this.isModified('eventId')) {
    // Lazy-require to avoid a circular-dependency at module load time.
    const Event = mongoose.model('Event')

    const eventExists = await Event.exists({ _id: this.eventId })

    // Throwing inside an async pre-hook causes Mongoose to abort the save.
    if (!eventExists) {
      throw new Error(
        `Event with id "${this.eventId.toString()}" does not exist`
      )
    }
  }
})

// ─── Model ────────────────────────────────────────────────────────────────────

/**
 * Re-use the compiled model in development (hot-reload safe).
 * In production `mongoose.models.Booking` is undefined on first load.
 */
const Booking: Model<IBookingDocument> =
  (mongoose.models.Booking as Model<IBookingDocument>) ||
  mongoose.model<IBookingDocument>('Booking', BookingSchema)

export default Booking
