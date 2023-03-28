import mongoose from 'mongoose'

export const productsCollection = 'products'

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value >= 0
      },
      message: 'El precio debe ser un número positivo'
    }
  },
  code: { type: String, required: true, unique: true, index: true },
  category: { type: String, required: true, index: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, required: true, index: true },
  thumbnails: { type: Array, required: true }
})

const productModel = mongoose.model(productsCollection, productSchema)
export default productModel
