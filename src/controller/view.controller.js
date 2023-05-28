/* eslint-disable */
import util from "../utils/view.util.js";
import jwtLib from "jsonwebtoken";
import config from "../../data.js";
import mongoose from "mongoose";
import DaoFactory from "../Dao/DaoFactory.mjs";
import moment from "moment";
import CustomError from "../errors/custom.error.mjs";
class ViewController {
  #CartService;
  #ProductService;
  #UserService;
  #TicketService;

  constructor() {
    this.initializeServices();
  }

  async initializeServices() {
    this.#CartService = await DaoFactory.getDao("cart");
    this.#UserService = await DaoFactory.getDao("user");
    this.#ProductService = await DaoFactory.getDao("product");
    this.#TicketService = await DaoFactory.getDao("ticket");
  }
  async viewStore(req, res, next) {
    const { query } = req;
    const cookie = util.cookieExtractor(req);
    if (!cookie) {
      res.redirect("/login");
      return;
    }
    let decoded;
    try {
      decoded = jwtLib.verify(cookie, config.JWT_SECRET);
    } catch (err) {
      console.error(err);
      res.redirect("/login");
      return;
    }
    const userCart = decoded.cartId;
    const user = await this.#UserService.findById(decoded.userId);
    if (!user) {
      throw CustomError.createError({
        name: 'Not Found',
        cause: new Error('User not found'),
        message: 'User not found',
        code: 104,
      })
    }
    const userObj = user.toObject(); // Convertimos el objeto user a un objeto plano
    const sort = util.createSortObject(query);
    const conditions = { ...util.createConditionsObject(query), status: true };
    try {
      const products = await this.#ProductService.find(conditions, {
        page: query.page ?? 1,
        limit: query.limit ?? 9,
        lean: true,
        sort,
      });
      if (!util.isValidPage(query.page, products.totalPages)) {
        res.status(404).render("404", {
          title: "Invalid page number",
          msg: `Page number '${query.page}' is invalid for this query`,
        });
        return;
      }
      if (!products) {
        res.status(404).render("404", {
          title: "Products not found",
          msg: "Products not Found",
        });
      } else {
        res.status(200).render("index", {
          title: "List of Products",
          products: products.docs,
          pages: products.totalPages,
          page: products.page,
          prev: products.prevPage,
          next: products.nextPage,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          sort: query.sort ?? "",
          order: query.order ?? "asc",
          cartId: userCart,
          user: userObj,
        });
      }
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Error while trying to get products`,
          code: 500,
        }))
      }
    }
  }

  async viewProduct(req, res, next) {
    const { pid } = req.params;
    if (!mongoose.isValidObjectId(pid)) {
      return res.status(400).render("404", {
        msg: "Invalid Product Id",
        title: "Product not Found",
      });
    }
    const cookie = util.cookieExtractor(req);
    if (!cookie) {
      res.redirect("/login");
      return;
    }
    let decoded;
    try {
      decoded = jwtLib.verify(cookie, config.JWT_SECRET);
      const userCart = decoded.cartId;
      const data = await this.#ProductService.findById({ _id: pid });
      if (!data) {
        return res.status(404).render("404", {
          msg: `The product with id: ${pid} you’re looking for doesn’t exist`,
          title: "Product not Found",
        });
      }
      const product = {
        ...data._doc,
        _id: data._doc._id.toString(),
      };
      return res
        .status(200)
        .render("product", { titulo: "View Product", data: product, userCart });
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Error while trying to get product with id: ${pid}`,
          code: 500,
        }))
      }
    }
  }

  async viewCart(req, res, next) {
    try {
      const { cid } = req.params;
      const cookie = util.cookieExtractor(req);

      // console.log(cookie);
      if (!cookie) {
        res.redirect("/login");
        return;
      }
      let decoded;
      try {
        decoded = jwtLib.verify(cookie, config.JWT_SECRET);
        // console.log(decoded);
      } catch (err) {
        console.error(err);
        res.redirect("/login");
        return;
      }
      const userCartId = decoded.cartId;
      const userId = decoded.userId;
      if (!userId || !userCartId) {

        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`User or cart not found`),
          message: `User or cart not found`,
          code: 104,
        })

      }
      if (cid !== userCartId) {
        res.status(403).render("unauthorized", {
          msg: "You are not authorized to view this cart",
          title: "Unauthorized",
        });
        return;
      }
      const result = await this.#CartService.getById(cid);
      if (!result) {
        res.status(404).render("404", {
          msg: `The cart with id: ${cid} you’re looking for doesn’t exist`,
          title: "Cart not Found",
        });
        return;
      }
      const cartData = result.toObject();
      res
        .status(200)
        .render("cart", { titulo: "Shopping Cart", cart: cartData });
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Error while trying to get cart with id: ${cid}`,
          code: 500,
        }))
      }
    }
  }

  async viewRealTime(req, res, next) {
    const data = await this.#ProductService.getAll();

    try {
      if (!data) {
        res.status(404).render("404", {
          title: "Products not found",
          msg: "Products not Found",
        });
      } else {
        const plainData = data.map((doc) => doc.toObject());
        res.status(200).render("realTimeProducts", {
          titulo: "List of Products",
          data: plainData,
        });
      }
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Error while trying to get realtime products`,
          code: 500,
        }))
      };
    }
  }

  async viewChat(req, res, next) {
    try {
      const cookie = util.cookieExtractor(req);
      let decoded;
      try {
        decoded = jwtLib.verify(cookie, config.JWT_SECRET);
      } catch (err) {
        console.error(err);
        res.redirect("/login");
        return;
      }
      const user = await this.#UserService.findById(decoded.userId);
      const userObj = user.toObject();

      res
        .status(200)
        .render("chat", { title: "Live Chat", role: userObj.role });
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Error while trying to get chat page`,
          code: 500,
        }))
      };
    }
  }

  async viewRegister(req, res, next) {
    try {
      const cookie = util.cookieExtractor(req);
      if (cookie) {
        try {
          jwtLib.verify(cookie, config.JWT_SECRET);
          return res.redirect("/profile");
        } catch (err) {
          console.error(err);
        }
      }
      res.render("register");
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Error while trying to get register page`,
          code: 500,
        }))
      };
    }
  }

  async viewLogin(req, res, next) {
    try {
      const cookie = util.cookieExtractor(req);
      if (cookie) {
        try {
          jwtLib.verify(cookie, config.JWT_SECRET);
          return res.redirect("/profile");
        } catch (err) {
          console.error(err);
        }
      }
      res.render("login");
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Error while trying to get login page`,
          code: 500,
        }))
      };
    }
  }

  async viewForgot(req, res, next) {
    try {
      res.render("forgot-password");
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Error while trying to get forgot password page`,
          code: 500,
        }))
      };
    }
  }

  async viewProfile(req, res, next) {
    const userId = req.user._id;
    const cartId = req.user.cartId;
    try {
      const user = await this.#UserService.findById({ _id: userId });
      if (!user) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`User with id ${userId} not found`),
          message: `User with id ${userId} not found`,
          code: 104,
        })
      }
      const cart = await this.#CartService.getById({ _id: cartId });
      if (!cart) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`cart with id ${cartId} not found`),
          message: `cart with id ${cartId} not found`,
          code: 104,
        })
      }
      const userObject = user.toObject(); // Convertimos el objeto user a un objeto plano
      let tickets = await this.#TicketService.findByEmail(userObject.email);
      if (!tickets) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`tickets with email ${userObject.email} not found`),
          message: `tickets with email ${userObject.email} not found`,
          code: 104,
        })
      }
      if (!user) {
        res.redirect("/login");
      }
      const productsInCart = cart.products;
      const cartLength = countProductsQuantity(productsInCart);
      function countProductsQuantity(productsInCart) {
        let totalQuantity = 0;
        for (let i = 0; i < productsInCart.length; i++) {
          totalQuantity += productsInCart[i].quantity;
        }
        return totalQuantity;
      }

      // agregar el campo order y convertir fecha
      tickets = tickets.map((ticket, i) => {
        let mutableTicket = ticket.toObject();
        mutableTicket.order = i + 1;
        mutableTicket.purchase_datetime = moment(
          mutableTicket.purchase_datetime
        ).format("DD/MM/YYYY");
        return mutableTicket;
      });
      // Ordenar los tickets por fecha de compra
      tickets.sort((a, b) => a.purchase_datetime - b.purchase_datetime);

      res.render("profile", { user: userObject, cartLength, cartId, tickets });
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Error while trying to get profile page`,
          code: 500,
        }))
      };
    }
  }

  async viewPurchase(req, res, next) {
    try {
      const userId = req.user._id;
      const cartId = req.user.cartId.toString();
      const ticket = await this.#TicketService.findByCartId(cartId);
      if (!ticket) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`Ticket not found for cart id ${cartId}`),
          message: `Ticket not found for cart id ${cartId}`,
          code: 104,
        })
      }
      const cart = await this.#CartService.getById(cartId);
      if (!cart) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`cart with id ${cartId} not found`),
          message: `cart with id ${cartId} not found`,
          code: 104,
        })
      }
      const user = await this.#UserService.findById({ _id: userId });
      if (!user) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`User with id ${userId} not found`),
          message: `User with id ${userId} not found`,
          code: 104,
        })
      }
      const userObject = user.toObject(); // objeto user a un objeto plano
      if (!cart) {
        res.redirect("/login");
      }

      res.render("purchase", { cart, ticket, userObject });
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Error while trying to get purchase page`,
          code: 500,
        }))
      };
    }
  }

  async viewOrder(req, res, next) {
    const { tid } = req.params;
    try {
      const userId = req.user._id;
      const ticket = await this.#TicketService.findByCode(tid);
      if (!ticket) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`Ticket with code ${tid} not found`),
          message: `Ticket with code ${tid} not found`,
          code: 104,
        })
      }
      const user = await this.#UserService.findById({ _id: userId });
      if (!user) {
        throw CustomError.createError({
          name: 'Not Found',
          cause: new Error(`User with id ${userId} not found`),
          message: `User with id ${userId} not found`,
          code: 104,
        })
      }
      const userObject = user.toObject();
      // Crear un nuevo array de productos comprados
      let purchasedProducts = [];
      // Iterar sobre cada producto en ticket.purchased_products
      for (let item of ticket.purchased_products) {
        // Buscar el producto por su ID
        let product = await this.#ProductService.findById(item.product);

        // Combinar la información del producto y la cantidad en un objeto
        let productObject = {
          ...product.toObject(), // Agregamos las propiedades del producto
          quantity: item.quantity, // Agregamos la cantidad comprada
        };
        // Agregar el objeto al array de productos comprados
        purchasedProducts.push(productObject);
      }
      // Convertir la fecha del ticket a un formato deseado
      let date = moment(ticket.purchase_datetime).format("DD/MM/YYYY");
      // Crear un nuevo objeto con la fecha formateada y los productos comprados
      const ticketObject = { ...ticket.toObject(), date, purchasedProducts };
      if (!ticket) {
        res.redirect("/profile");
      }
      res.render("order", { ticket: ticketObject, userObject });
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(CustomError.createError({
          name: 'Server Error',
          cause: error,
          message: `Error while trying to get order page`,
          code: 500,
        }))
      };
    }
  }
}

const controller = new ViewController();
export default controller;
