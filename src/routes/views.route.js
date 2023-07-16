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
// Ruta para ver el formulario de reseteo de password
route.get("/reset-password/:token",controller.viewReset.bind(controller))
// Ruta para los productos
route.get("/", authorization(['user', 'admin', 'premium']), passportCall("current"), controller.viewStore.bind(controller))
// Ruta para ver el dashboard de admin
route.get("/userDasboard", authorization(['admin']), controller.userDashboard.bind(controller))
// ruta para ver cada uno de los productos
route.get("/view/product/:pid", authorization(['user', 'admin', 'premium']), passportCall("current"), controller.viewProduct.bind(controller))
// ruta para ver el carrito
route.get("/view/cart/:cid", authorization(['user', 'admin', 'premium']), passportCall("current"), controller.viewCart.bind(controller))
// Ruta para ver los productos en tiempo real
route.get("/realtimeproducts", authorization( ['admin', 'premium']), passportCall("current"), controller.viewRealTime.bind(controller))
// Ruta para ver el chat en tiempo real
route.get("/chat", authorization(['user']), passportCall("current"),controller.viewChat.bind(controller))
// Ruta para ver el perfil
route.get("/profile", authorization(['user', 'admin', 'premium']), passportCall("current"),controller.viewProfile.bind(controller))
// Ruta para ver la compra
route.get("/purchase", authorization(['user']), passportCall("current"),controller.viewPurchase.bind(controller))
// Ruta para ver una compra
route.get("/view/purchase/:tid", authorization(['user']), passportCall("current"),controller.viewOrder.bind(controller))
// Ruta para subir documentos
route.get("/view/uploadDocument/:uid",controller.viewUploadDocument.bind(controller))

export default route;
