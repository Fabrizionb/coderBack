/* eslint-disable*/
import passport from "passport";
import local from "passport-local";
import userModel from "../Dao/models/user.model.js";
import { createHash, isValidPassword } from "../public/js/crypto.js";

const LocalStrategy = local.Strategy;

export function configurePassport() {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },

      async (req, username, password, done) => {
        const { name, lastname } = req.body;
        try {
          const userExist = await userModel.findOne({ email: username });
          if (userExist) {
            return done(null, false, { message: "User already exists" });
          }
          // new cart
          const createdCart = await fetch("http://localhost:8080/api/cart", {
            method: "POST",
          });
          const cartData = await createdCart.json();
          const cartId = cartData.carts[0]._id;
          const hashedPassword = createHash(password);
          // new user
          const newUser = await userModel.create({
            email: username,
            password: hashedPassword,
            cartId,
            name,
            lastname,
          });
          return done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            console.log("User not found");
            return done(null, false, { message: "User not found" });
          }
          if (!isValidPassword(password, user.password)) {
            console.log("Password incorrect");
            return done(null, false, { message: "Password incorrect" });
          }
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) =>
    done(null, { userId: user._id, cartId: user.cartId })
  );
  passport.deserializeUser(async (id, done) => {
    const user = userModel.findOne({ _id: id });
    done(null, user);
  });
}
