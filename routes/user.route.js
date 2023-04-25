/* eslint-disable */

import { Router } from "express";
import userManager from "../Dao/controller/userManager.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import userModel from "../Dao/models/user.model.js";
import passport from "passport";
import config from "../data.js";
import jwt from "passport-jwt"
import { passportCall, authorization  } from '../utils/auth.js'
const route = Router();

route.post("/login", passport.authenticate("login",
  {
    failureRedirect: "/api/user/failurerelogin",
  }),
  (req, res) => {
    res.status(200).send({ message: "User Logged" })
  }
);

route.post("/restore-password", async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(203).json({ status: "404", message: "User not found" });
      return;
    }
    const hashedPassword = createHash(newPassword);
    await userModel.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );
    res.status(200).send({ status: "200", message: "Password changed" });
  } catch (error) {
    next(error);
  }
});

route.post("/register", passport.authenticate("register",
  {
    failureRedirect: "/api/user/failureregister",
  }),
  async (req, res) => res.status(201).send({ message: "User Logged" })
);

route.get(
  '/data',
   //passport.authenticate('jwt', { session: false }),
   passportCall('jwt'),
   authorization('admin'),
  // authorization('ADMIN'),
  (req, res) => {
    res.send(req.user);
  }
);

function generateToken(user) {
  const token = jwt.sign({ user }, config.JWT_SECRET , { expiresIn: '24h' });
  return token;
}

route.post("/logout", (req, res, next) => {
  try {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).json({ response: "success" });
  } catch (error) {
    next(error);
  }
});
route.get("/failureregister", async (req, res, next) => {
  console.log("failureregister");
  res.send({ error: "Error on register" });
});
route.get("/failurelogin", async (req, res, next) => {
  console.log("failurelogin");
  res.send({ error: "User or password incorrect" });
});
route.get(  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
);
route.get(  "/github-callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.passport.user = {
      userId: req.user._id,
      cartId: req.user.cartId,
    };
    res.redirect("/");
  }
);
route.get(  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req, res) => {}
);
route.get(  "/google-callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  function (req, res) {
    req.session.passport.user = {
      userId: req.user._id,
      cartId: req.user.cartId,
    };
    res.redirect("/");
  }
);

export default route;
