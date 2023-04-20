/* eslint-disable*/
import passport from "passport";
import local from "passport-local";
import userModel from "../Dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import github from "passport-github2";
import config from "../data.js";

const LocalStrategy = local.Strategy;
const GithubStrategy = github.Strategy;

const { github_client_id, github_client_secret, github_callback_url } = config;
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

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: config.github_client_id,
        clientSecret: config.github_client_secret,
        callbackURL: config.github_callback_url,
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          console.log({ login: "github", profile });
          let email = profile._json.email;
          if (!email) {
            email = `${profile._json.id}@github.com`;
          }
          const user = await userModel.findOne({ email });
          if (!user || user === undefined) {
            // new cart
            const createdCart = await fetch("http://localhost:8080/api/cart", {
              method: "POST",
            });
            const cartData = await createdCart.json();
            const cartId = cartData.carts[0]._id;
            const password = profile._json.id;
            const newUser = await userModel.create({
              email,
              name: profile._json.name,
              lastname: "-",
              password: "-",
              cartId,
            });
            console.log("new user created", newUser);
            return done(null, newUser);
          }
          return done(null, user);
        } catch (error) {
          done(error, false);
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
