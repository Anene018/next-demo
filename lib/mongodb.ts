import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URI = process.env.MONGO_DB_URL

if (!MONGODB_URI) {
  throw new Error(
    'Please define the "MONGODB_URI" environment variable in your .env.local file'
  )
}

/**
 * Shape of the cached connection object stored on the global object.
 * Using a cache prevents exhausting the database connection limit
 * in Next.js development mode, where the module cache is cleared on
 * every hot-reload but the global object persists.
 */
interface MongooseCache {
  /** Active Mongoose instance, or null if not yet connected. */
  conn: Mongoose | null
  /** In-flight connection promise, or null if no connection is pending. */
  promise: Promise<Mongoose> | null
}

/**
 * Extend the NodeJS global type so TypeScript knows about our cache property.
 * This avoids "Property does not exist on type 'Global'" errors.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined
}

// Initialize the cache from the global object (persists across hot-reloads)
// or create a fresh cache if it doesn't exist yet.
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null }

// Persist the cache on the global object for subsequent module evaluations.
global.mongoose = cached

/**
 * Connects to MongoDB using Mongoose and returns the active connection.
 *
 * - On the first call it opens a new connection and stores the promise in the cache.
 * - On subsequent calls it reuses the cached connection (or waits for the
 *   in-flight promise to resolve), avoiding duplicate connections.
 *
 * @returns A resolved Mongoose instance ready for use.
 */
export async function connectToDatabase (): Promise<Mongoose> {
  // Return the existing connection immediately if one is already established.
  if (cached.conn) {
    return cached.conn
  }

  // If no connection attempt is in progress, start one.
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      // Keeps the connection alive across serverless function invocations.
      bufferCommands: false
    }

    // Store the promise so concurrent callers await the same connection attempt.
    cached.promise = mongoose.connect(MONGODB_URI as string, opts)
  }

  // Await the connection promise (either newly created or already in-flight).
  cached.conn = await cached.promise

  return cached.conn
}
