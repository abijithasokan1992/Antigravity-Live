// prisma.config.js
// Prisma 7 datasource configuration – URL supplied via environment variable at runtime.
module.exports = {
  datasource: {
    db: {
      url: process.env.SUPABASE_DATABASE_URL,
    },
  },
};
