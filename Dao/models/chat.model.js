import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const chatCollection = 'messages'

const chatSchema = new mongoose.Schema({
  user: { type: String, required: true, index: true },
  message: { type: String, required: true }
})
chatSchema.plugin(mongoosePaginate)

export const chatModel = mongoose.model(chatCollection, chatSchema)
