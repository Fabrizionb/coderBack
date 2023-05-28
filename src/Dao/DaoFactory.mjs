/*eslint-disable*/
import mongoose from "mongoose";
import config from "../../data.js";

class DaoFactory {
  static async getDao(type) {
    switch (config.PERSISTENCE) {
      case "mongo":
        mongoose.connect(config.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        switch (type) {
          case "cart":
            const { default: CartService } = await import(
              "./mongo/cart.service.mjs"
            );

            return new CartService();
          case "user":
            const { default: UserService } = await import(
              "./mongo/user.service.mjs"
            );

            return new UserService();
          case "product":
            const { default: ProductService } = await import(
              "./mongo/product.service.mjs"
            );

            return new ProductService();
          case "ticket":
            const { default: TicketService } = await import(
              "./mongo/ticket.service.mjs"
            );

            return new TicketService();
        }
      case "memory":
        switch (type) {
          case "cart":
            const { default: CartServiceMEM } = await import(
              "./memory/cart.service.mjs"
            );
            return new CartServiceMEM();
          case "user":
            const { default: UserServiceMEM } = await import(
              "./memory/user.service.mjs"
            );
            return new UserServiceMEM();
          case "product":
            const { default: ProductServiceMEM } = await import(
              "./memory/product.service.mjs"
            );
            return new ProductServiceMEM();
          case "ticket":
            const { default: TicketServiceMEM } = await import(
              "./memory/ticket.service.mjs"
            );
            return new TicketServiceMEM();
        }
      case "filesystem":
        switch (type) {
          case "cart":
            const { default: CartServiceFS } = await import(
              "./filesystem/cart.service.mjs"
            );
            return new CartServiceFS();
          case "user":
            const { default: UserServiceFS } = await import(
              "./filesystem/user.service.mjs"
            );
            return new UserServiceFS();
          case "product":
            const { default: ProductServiceFS } = await import(
              "./filesystem/product.service.mjs"
            );
            return new ProductServiceFS();
          case "ticket":
            const { default: TicketServiceFS } = await import(
              "./filesystem/ticket.service.mjs"
            );
            return new TicketServiceFS();
        }
      default:
        throw new Error("Wrong config");
    }
  }
}

export default DaoFactory;
