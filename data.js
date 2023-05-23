import dotenv from 'dotenv'
dotenv.config()
const env = process.env

export default {
  // Port
  PORT: env.PORT,
  // Mongo config
  MONGO_URI: env.MONGO_URI,
  // Cookie config
  COOKIE_SECRET: env.COOKIE_SECRET,
  // Jwt config
  JWT_SECRET: env.JWT_SECRET,
  // Passport Github
  GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: env.GITHUB_CALLBACK_URL,
  // Passport Google
  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: env.GOOGLE_CALLBACK_URL,
  // DaoFactory config
  PERSISTENCE: env.PERSISTENCE,
  // Mailer config
  GOOGLE_MAILER: env.GOOGLE_MAILER
}
