import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

class UserService {
  constructor (filePath = path.resolve(__dirname, '../data/users.json')) {
    this.filePath = filePath
  }

  async get () {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async findOne ({ email }) {
    const users = await this.get()
    return users.find(user => user.email === email)
  }

  async findById (_id) {
    const users = await this.get()
    return users.find(user => user._id === _id)
  }

  async create (data) {
    const users = await this.get()
    const newUser = { _id: uuidv4(), ...data }
    users.push(newUser)
    await this.writeUsers(users)
    return newUser
  }

  async update (id, data) {
    const users = await this.get()
    const user = users.find(user => user._id === id)
    if (!user) {
      return null
    }
    Object.assign(user, data)
    await this.writeUsers(users)
    return user
  }

  async delete (id) {
    const users = await this.get()
    const index = users.findIndex(user => user._id === id)
    if (index === -1) {
      return null
    }
    users.splice(index, 1)
    await this.writeUsers(users)
    return { message: `User with id ${id} has been deleted.` }
  }

  async findByCartId (cartId) {
    const users = await this.get()
    return users.find(user => user.cartId === cartId)
  }

  async writeUsers (users) {
    return fs.promises.writeFile(this.filePath, JSON.stringify(users, null, 2))
  }
}

export default UserService
