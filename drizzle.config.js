const { config } = require('dotenv');
const { defineConfig } = require('drizzle-kit');

config({ path: '.env' });

module.exports = defineConfig({
  schema: "./utils/schema.js",  // Updated path to match your project structure
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
  },
});