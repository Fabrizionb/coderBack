import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export const userCollection = 'users'

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reference: { type: String, required: true }
}, { _id: false })

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  cartId: { type: Schema.Types.ObjectId, ref: 'carts' },
  role: { type: String, enum: ['user', 'admin', 'premium'], default: 'user' },
  documents: [documentSchema],
  last_connection: { type: Date }
})

userSchema.plugin(mongoosePaginate)

const userModel = mongoose.model(userCollection, userSchema)
export default userModel
