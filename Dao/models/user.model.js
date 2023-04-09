import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export const userCollection = 'users'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' }
})
userSchema.plugin(mongoosePaginate)

export const userModel = mongoose.model(userCollection, userSchema)
