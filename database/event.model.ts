import mongoose, { Document, Model, Schema } from 'mongoose'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape of a raw Event document (fields stored in MongoDB). */
export interface IEvent {
  title: string
  /** URL-friendly identifier derived from the title. */
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  /** ISO-8601 date string, normalised in the pre-save hook. */
  date: string
  /** Time stored in HH:MM (24-hour) format, normalised in the pre-save hook. */
  time: string
  mode: 'online' | 'offline' | 'hybrid'
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

/** Mongoose Document interface combining IEvent with Document methods. */
export type IEventDocument = IEvent & Document

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a title string to a URL-friendly slug.
 * Example: "My Awesome Event!" → "my-awesome-event"
 */
function toSlug (title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // strip special characters
    .replace(/[\s_]+/g, '-') // replace spaces/underscores with hyphens
    .replace(/--+/g, '-') // collapse consecutive hyphens
}

/**
 * Normalises a date string to ISO-8601 (YYYY-MM-DD).
 * Throws if the value is not a recognisable date.
 */
function normaliseDateToISO (raw: string): string {
  const parsed = new Date(raw)
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date value: "${raw}"`)
  }
  // Return only the date portion (YYYY-MM-DD)
  return parsed.toISOString().split('T')[0]
}

/**
 * Normalises a time string to HH:MM (24-hour clock).
 * Accepts "9:05 AM", "14:30", "2:30 PM", etc.
 * Throws if the format cannot be parsed.
 */
function normaliseTime (raw: string): string {
  const trimmed = raw.trim()

  // Already 24-hour format: "14:30" or "09:05"
  const h24 = trimmed.match(/^(\d{1,2}):(\d{2})$/)
  if (h24) {
    const h = parseInt(h24[1], 10)
    const m = parseInt(h24[2], 10)
    if (h < 24 && m < 60) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    }
  }

  // 12-hour format: "9:05 AM", "2:30 PM"
  const h12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (h12) {
    let h = parseInt(h12[1], 10)
    const m = parseInt(h12[2], 10)
    const meridiem = h12[3].toUpperCase()
    if (meridiem === 'PM' && h !== 12) h += 12
    if (meridiem === 'AM' && h === 12) h = 0
    if (h < 24 && m < 60) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    }
  }

  throw new Error(`Invalid time value: "${raw}". Expected HH:MM or H:MM AM/PM`)
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const EventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
      minlength: [3, 'title must be at least 3 characters']
    },

    // Slug is managed exclusively by the pre-save hook; callers should not set it.
    slug: {
      type: String,
      unique: true,
      index: true
    },

    description: {
      type: String,
      required: [true, 'description is required'],
      trim: true
    },

    overview: {
      type: String,
      required: [true, 'overview is required'],
      trim: true
    },

    image: {
      type: String,
      required: [true, 'image is required'],
      trim: true
    },

    venue: {
      type: String,
      required: [true, 'venue is required'],
      trim: true
    },

    location: {
      type: String,
      required: [true, 'location is required'],
      trim: true
    },

    date: {
      type: String,
      required: [true, 'date is required']
    },

    time: {
      type: String,
      required: [true, 'time is required']
    },

    mode: {
      type: String,
      required: [true, 'mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'mode must be "online", "offline", or "hybrid"'
      }
    },

    audience: {
      type: String,
      required: [true, 'audience is required'],
      trim: true
    },

    agenda: {
      type: [String],
      required: [true, 'agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'agenda must contain at least one item'
      }
    },

    organizer: {
      type: String,
      required: [true, 'organizer is required'],
      trim: true
    },

    tags: {
      type: [String],
      required: [true, 'tags is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'tags must contain at least one item'
      }
    }
  },
  {
    // Automatically adds and maintains `createdAt` and `updatedAt`.
    timestamps: true
  }
)

// ─── Pre-save Hook ────────────────────────────────────────────────────────────

// Async hooks in Mongoose v9 don't receive a `next` callback; throw to signal errors.
EventSchema.pre<IEventDocument>('save', async function () {
  // Regenerate slug only when title is new or has been modified.
  if (this.isNew || this.isModified('title')) {
    this.slug = toSlug(this.title)
  }

  // Normalise date → ISO-8601 (YYYY-MM-DD).
  if (this.isNew || this.isModified('date')) {
    this.date = normaliseDateToISO(this.date)
  }

  // Normalise time → HH:MM (24-hour).
  if (this.isNew || this.isModified('time')) {
    this.time = normaliseTime(this.time)
  }
})

// ─── Model ────────────────────────────────────────────────────────────────────

/**
 * Re-use the compiled model in development (hot-reload safe).
 * In production `mongoose.models.Event` is undefined on first load.
 */
const Event: Model<IEventDocument> =
  (mongoose.models.Event as Model<IEventDocument>) ||
  mongoose.model<IEventDocument>('Event', EventSchema)

export default Event
