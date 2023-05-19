import { authorization, passportCall } from '../utils/auth.js'
/* eslint-disable */
import { Router } from "express";
import controller from '../controller/view.controller.js';

const route = Router();

// Ruta para ver el formulario de registro
route.get("/register",controller.viewRegister.bind(controller))
// Ruta para ver el formulario de login
route.get("/login",controller.viewLogin.bind(controller))
// Ruta para recuperar la password
route.get("/forgot-password",controller.viewForgot.bind(controller))
// Ruta para los productos
route.get("/",  
  authorization(['user', 'admin']),
  passportCall("current"),
  controller.viewStore.bind(controller))
// ruta para ver cada uno de los productos
  route.get("/view/product/:pid",
  authorization(['user', 'admin']),
  passportCall("current"),
  controller.viewProduct.bind(controller))
// ruta para ver el carrito
  route.get("/view/cart/:cid",
  authorization(['user', 'admin']),
  passportCall("current"),
  controller.viewCart.bind(controller))
// Ruta para ver los productos en tiempo real
route.get("/realtimeproducts",
authorization( 'admin'),
  passportCall("current"),
  controller.viewRealTime.bind(controller))
// Ruta para ver el chat en tiempo real
route.get("/chat",
  authorization(['user']),
  passportCall("current"),controller.viewChat.bind(controller))
// Ruta para ver el perfil
route.get("/profile",
  authorization(['user', 'admin']),
  passportCall("current"),controller.viewProfile.bind(controller))
  route.get("/purchase",
  authorization(['user']),
  passportCall("current"),controller.viewPurchase.bind(controller))
  route.get("/view/purchase/:tid",
  authorization(['user']),
  passportCall("current"),controller.viewOrder.bind(controller))
export default route;
