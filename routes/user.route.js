/* eslint-disable */

import { Router } from "express";
import userManager from "../Dao/controller/userManager.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import userModel from "../Dao/models/user.model.js";
import passport from "passport";

const route = Router();

route.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/user/failurelogin",
  }),
  async (req, res, next) => {
    try {
      const user = req.session.passport.user;
      const userId = user.userId.toString();
      const cartId = user.cartId.toString();
      req.session.passport.user.userId = userId;
      req.session.passport.user.cartId = cartId;
      res.status(200).send({ message: "User logged" });
    } catch (error) {
      next(error);
    }
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

route.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/user/failureregister",
  }),
  async (req, res) => res.status(201).send({ message: "User Created" })
);

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

route.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
);

route.get(
  "/github-callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.passport.user = {
      userId: req.user._id,
      cartId: req.user.cartId,
    };
    res.redirect("/");
  }
);

route.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req, res) => {}
);

route.get(
  "/google-callback",
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
