import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
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
productSchema.pre('findOneAndUpdate', function (next) {
  if (this._update.$inc && this._update.$inc.stock !== undefined) {
    const updatedStock = this._update.$inc.stock

    // Si el stock actualizado es menor o igual a 0, establecer el estado en false
    if (updatedStock <= 0) {
      this._update.status = false
    } else {
      this._update.status = true
    }
  }
  next()
})

productSchema.plugin(mongoosePaginate)
const productModel = mongoose.model(productsCollection, productSchema)
export default productModel
