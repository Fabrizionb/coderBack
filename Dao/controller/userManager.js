import userModel from '../models/user.model.js'

class UserManager {
  async getUserById (userId) {
    try {
      const user = await userModel.findById(userId).populate('cartId')
      return user ? user.toObject() : null
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async getUserByEmail (email) {
    try {
      const user = await userModel.findOne({ email }).populate('cartId')
      return user ? user.toObject() : null
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async register (email, password, name, lastname) {
    try {
      // user exists?
      const existingUser = await userModel.findOne({ email })
      if (existingUser) {
        return { message: 'Email already in use' }
      }
      // new cart
      const createdCart = await fetch('http://localhost:8080/api/cart', {
        method: 'POST'
      })

      const cartData = await createdCart.json()
      const cartId = cartData.carts[0]._id

      // new user
      const newUser = await userModel.create({
        email,
        password,
        cartId,
        name,
        lastname
      })

      return { user: newUser.toObject() }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async login (email, password) {
    try {
      // find user by email
      const user = await this.getUserByEmail(email)

      if (!user) {
        throw new Error('Email or password is incorrect')
      }

      // Check password
      if (user.password !== password) {
        throw new Error('Email or password is incorrect')
      }

      return user
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}

const userManager = new UserManager()

export default userManager
