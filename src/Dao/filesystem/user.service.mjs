/* eslint-disable */
import fs from 'fs';
import path from 'path';

class UserService {
  #filePath;
  constructor() {
    this.#filePath = path.resolve(__dirname, './data/users.json');
  }
  async get() {
    const data = await fs.promises.readFile(this.#filePath, 'utf-8');
    return JSON.parse(data);
  }
  async findOne({ email }) {
    const users = await this.get();
    return users.find(user => user.email === email);
  }
  async findById(id) {
    const users = await this.get();
    return users.find(user => user._id === id);
  }
  async create(data) {
    const users = await this.get();
    const newUser = { _id: Date.now(), ...data };
    users.push(newUser);
    await fs.promises.writeFile(this.#filePath, JSON.stringify(users, null, 2));
    return newUser;
  }
  async update(id, data) {
    const users = await this.get();
    const index = users.findIndex(user => user._id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...data };
    await fs.promises.writeFile(this.#filePath, JSON.stringify(users, null, 2));
    return users[index];
  }
  async delete(id) {
    const users = await this.get();
    const filteredUsers = users.filter(user => user._id !== id);
    await fs.promises.writeFile(this.#filePath, JSON.stringify(filteredUsers, null, 2));
    return { _id: id };
  }
  async findByCartId(cartId) {
    const users = await this.get();
    return users.find(user => user.cartId === cartId);
  }
}

export default UserService;
