import { neon } from '@neondatabase/serverless';

// Ensure the environment variable is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is missing');
}

export const sql = neon(process.env.DATABASE_URL);
