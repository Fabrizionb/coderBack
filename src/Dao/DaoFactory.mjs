/*eslint-disable*/
import mongoose from "mongoose";
import config from "../../data.js";
//mongo
// import CartService from './services/cart.service.mjs';
// import UserService from './services/user.service.mjs';
// import ProductService from './services/product.service.mjs';
// import TicketService from './services/ticket.service.mjs';
// // filesystem
// import CartServiceFS from './filesystem/cart.service.mjs';
// import UserServiceFS from './filesystem/user.service.mjs';
// import ProductServiceFS from './filesystem/product.service.mjs';
// import TicketServiceFS from './filesystem/ticket.service.mjs';

class DaoFactory {
  static async getDao(type) { 
    switch (config.PERSISTENCE) {
      case "mongo":
        mongoose.connect(config.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        switch (type) {
          case 'cart':
            const {default: CartService} = await import('./services/cart.service.mjs');

            return new CartService();
          case 'user':
            const {default: UserService} = await import('./services/user.service.mjs');

            return new UserService();
          case 'product':
            const {default: ProductService} = await import('./services/product.service.mjs');

            return new ProductService();
          case 'ticket':
            const {default: TicketService} = await import('./services/ticket.service.mjs');

            return new TicketService();
        }
      case "file":
        switch (type) {
          case 'cart':
            const {default: CartServiceFS} = await import('./filesystem/cart.service.mjs');
            return new CartServiceFS();
          case 'user':
            const {default: UserServiceFS} = await import('./filesystem/user.service.mjs');
            return new UserServiceFS();
          case 'product':
            const {default: ProductServiceFS} = await import('./filesystem/product.service.mjs');
            return new ProductServiceFS();
          case 'ticket':
            const {default: TicketServiceFS} = await import('./filesystem/ticket.service.mjs');
            return new TicketServiceFS();
        }
      default:
        throw new Error("Wrong config");
    }
  }
}

export default DaoFactory;