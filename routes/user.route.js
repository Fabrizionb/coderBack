/* eslint-disable */
import { Router } from "express";
import userManager from "../Dao/controller/userManager.js";
import { createHash, isValidPassword } from "../public/js/crypto.js";
import userModel from "../Dao/models/user.model.js";

const route = Router();

route.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      const superAdmin = {
        name: "Admin",
        lastname: "Admin",
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        role: "admin",
      };
      req.session.userId = superAdmin._id.toString();
      req.session.user = superAdmin;
      return res.status(200).json(superAdmin);
    }
    //const user = await userManager.login(email, password)
    const user = await userModel.findOne({ email }).populate('cartId')
    if (!user) {
       res.status(203).json({ status: "404", message: "User not found" });
       return
    }
    if (!isValidPassword(password, user.password)) {
      return res
        .status(203)
        .json({ status: "401", message: "Password incorrect" });
    } else {
      const userId = user._id.toString();
      const cartId = user.cartId._id.toString();
 
      req.session.userId = userId;
      req.session.cartId = cartId;
      req.session.user = user;
      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
});

route.post("/restore-password", async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
      res.status(203).json({ status: "404", message: "User not found" });
      return
    }
    const hashedPassword = createHash(newPassword);
    await userModel.updateOne({ email }, {$set: {password: hashedPassword}})
    res.status(200).send({ status: "200", message: "Password changed" });

  } catch (error) {
    next(error);
  }
});

route.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, lastname } = req.body;
    const hashedPassword = createHash(password);
    const data = await userManager.register(
      email,
      hashedPassword,
      name,
      lastname
    );
    const { user } = data;
    const userId = user._id.toString();
    const cartId = user.cartId.toString();
    req.session.userId = userId;
    req.session.cartId = cartId;
    if (data) {
      return res.status(203).json({ status: "203", message: data.message });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

route.post("/logout", (req, res, next) => {
  try {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).json({ response: "success" });
  } catch (error) {
    next(error);
  }
});

export default route;
