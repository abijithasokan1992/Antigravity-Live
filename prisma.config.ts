// prisma.config.ts
// Prisma 7 datasource configuration – URL supplied via environment variable at runtime.
import { defineConfig } from '@prisma/client/runtime';

export default defineConfig({
  datasource: {
    db: {
      url: process.env.SUPABASE_DATABASE_URL,
    },
  },
});
