import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'didhvfvtu',
  api_key: process.env.CLOUDINARY_API_KEY || '783916382747355',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'nmv86FH9P4rEsCyQ8jwdPQ4YhPA',
  secure: true,
})

export default cloudinary
