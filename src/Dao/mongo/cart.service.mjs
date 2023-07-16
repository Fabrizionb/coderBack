/* eslint-disable */
import cartModel from "../models/cart.model.js";
import nodemailer from 'nodemailer'
import config from "../../../data.js";
import Logger from '../../log/winston-logger.mjs'
import mongoose from 'mongoose';
class CartService {
  #model;
  constructor() {
    this.#model = cartModel;
  }
  async get() {
    return this.#model.find();
  }
  async getById(_id) {
    return this.#model.findById(_id).populate('products.product');
  }
  async create(data) {
    return this.#model.create(data);
  }
   async findOneAndUpdate(query, update) {
    return this.#model.updateOne(query, update);
  }

  // async findByCartId(cartId) {
  //   const user = await this.#model.findOne({ cartId });
  //   return user 
  // }
  
  async findUserByCartId(cartId) {
    const user = await this.#model.findOne({ cartId });
    return user
  }
  
    async sendPurchaseMail(email) {

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: config.GOOGLE_MAILER_USER,
        pass: config.GOOGLE_MAILER
      }
    })
    
    try {
      await transporter.sendMail({
        from: "'CoderBack' <proyecto@coderhouse.com>",
        to: email,
        subject: 'Your purchase was successful',
        html: `
          <h1>Thank You, order placed</h1>
          <p class="lead">Your order is currently being prepared.</p>
          <p class="lead">You can find a summary of your purchase in your profile.</p>
          <p class="text-muted">Please log in to view your profile.</p>
          <a href="http://localhost:8080/login" class="btn btn-secondary">Log In</a>
          <p class="text-muted">If you have any questions, our customer service center is available 24/7. Feel free to <a href="http://localhost:8080/chat">contact us</a>.</p>
        `
      });
  
      Logger.info('Mail sent successfully');
      // Puedes retornar un objeto con la información necesaria
      // para generar el alerta en el lado del cliente
      return { status: 200, message: 'Purchase successful' };
    } catch (error) {
      Logger.error(error);
      // Igualmente aquí, retornamos un objeto con la información de error
      return { status: 500, message: 'There was a problem sending the email' };
    }
    
  }
  async updateCart(cart) {
    return cart.save();
}
}

export default CartService;
