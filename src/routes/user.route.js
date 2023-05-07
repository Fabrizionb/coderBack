/* eslint-disable */

import { Router } from "express";
import userManager from "../Dao/controller/user.controller.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import userModel from "../Dao/models/user.model.js";
import passport from "passport";
import config from "../../data.js";
import jwt from "passport-jwt";
import { passportCall, authorization } from "../utils/auth.js";
import utils from "../utils/view.util.js";
import controller from "../Dao/controller/user.controller.js";

const route = Router();

route.get("/failurelogin", controller.failureLogin);
route.get("/failureregister", controller.failureRegister);
route.post("/logout", controller.logout);
route.get("/unauthorized", controller.unauthorized);
route.post("/restore-password", controller.restorePassword);
route.get(
  "/google-callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  controller.googleCallback
);
route.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  controller.google
);
route.get(
  "/github-callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  controller.githubCallback
);
route.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  controller.github
);

route.get(
  "/current",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/unauthorized",
  }),
  controller.current
);
route.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/user/failureregister",
  }),
  controller.register
);
route.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/user/failurerelogin",
  }),
  controller.login
);

// route.post("/login",
//   passport.authenticate("login", {
//     failureRedirect: "/api/user/failurerelogin",
//   }),
//   (req, res) => {
//     res.status(200).send({ message: "User Logged" });
//   }
// );

// route.post("/restore-password", async (req, res, next) => {
//   try {
//     const { email, newPassword } = req.body;
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       res.status(203).json({ status: "404", message: "User not found" });
//       return;
//     }
//     const hashedPassword = createHash(newPassword);
//     await userModel.updateOne(
//       { email },
//       { $set: { password: hashedPassword } }
//     );
//     res.status(200).send({ status: "200", message: "Password changed" });
//   } catch (error) {
//     next(error);
//   }
// });

// route.post("/register",
//   passport.authenticate("register", {
//     failureRedirect: "/api/user/failureregister",
//   }),
//   async (req, res) => res.status(201).send({ message: "User Logged" })
// );

// route.get(
//   "/current",
//   passport.authenticate("current", {
//     session: false,
//     failureRedirect: "/unauthorized",
//   }),
//   (req, res) => {
//     const { _id, email, name, lastname, cartId, role } = req.user;
//     res.json({ user: { _id, email, name, lastname, cartId, role } });
//   }
// );
// // Nueva ruta para manejar el acceso no autorizado
// route.get("/unauthorized", (req, res) => {
//   res.render("unauthorized", {
//     title: "Unauthorized",
//     msg: "You are Unauthorized, please log in.",
//   });
// });
// function generateToken(user) {
//   const token = jwt.sign({ user }, config.JWT_SECRET, { expiresIn: "24h" });
//   return token;
// }
// route.post("/logout", (req, res, next) => {
//   try {
//     req.session.destroy();
//     res.clearCookie("connect.sid");
//     res.clearCookie("AUTH"); // clear cookie "AUTH"
//     res.status(200).json({ response: "success" });
//   } catch (error) {
//     next(error);
//   }
// });
// route.get("/failureregister", async (req, res, next) => {
//   console.log("failureregister");
//   res.send({ error: "Error on register" });
// });
// route.get("/failurelogin", async (req, res, next) => {
//   console.log("failurelogin");
//   res.send({ error: "User or password incorrect" });
// });
// route.get(
//   "/github",
//   passport.authenticate("github", { scope: ["user:email"] }),
//   (req, res) => {}
// );
// route.get(
//   "/github-callback",
//   passport.authenticate("github", { failureRedirect: "/login" }),
//   (req, res) => {
//     req.session.passport.user = {
//       userId: req.user._id,
//       cartId: req.user.cartId,
//     };
//     utils.setAuthCookie(req, user);
//     res.redirect("/");
//   }
// );
// route.get(
//   "/google",
//   passport.authenticate("google", { scope: ["email", "profile"] }),
//   (req, res) => {}
// );
// route.get(
//   "/google-callback",
//   passport.authenticate("google", {
//     failureRedirect: "/failed",
//   }),
//   function (req, res) {
//     // Use req.user instead of user
//     utils.setAuthCookie(req.user, res);
//     res.redirect("/");
//   }
// );

export default route;
