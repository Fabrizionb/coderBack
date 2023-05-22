/* eslint-disable*/
import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils/crypto.js";
import github from "passport-github2";
import config from "../../data.js";
import google from "passport-google-oauth20";
import jwtLib from "jsonwebtoken";
import jwt from "passport-jwt";
import util from '../utils/view.util.js'

import userModel from "../Dao/models/user.model.js";
import UserService from '../Dao/mongo/user.service.mjs'

const LocalStrategy = local.Strategy;
const GithubStrategy = github.Strategy;
const GoogleStrategy = google.Strategy;
const JWTStrategy = jwt.Strategy;

export function configurePassport() {
  passport.use("register",
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
        // Genera el token JWT y setea la cookie en la respuesta
        const userObj = {
          userId: newUser._id.toString(),
          cartId: newUser.cartId.toString(),
          role: newUser.role,
        };
        const token = jwtLib.sign(userObj, config.JWT_SECRET, {
          expiresIn: "24h",
        });
        req.res.cookie("AUTH", token, {
          maxAge: 60 * 60 * 1000 * 24,
          httpOnly: true,
        });

        return done(null, newUser);
      } catch (error) {
        done(error, false, { message: "Could not create user" });
      }
    }
  )
);

  passport.use("login",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
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

          // Genera el token JWT y setea la cookie en la respuesta
          const userObj = {
            userId: user._id.toString(),
            cartId: user.cartId.toString(),
            role: user.role,
          };
          const token = jwtLib.sign(userObj, config.JWT_SECRET, {
            expiresIn: "24h",
          });
          req.res.cookie("AUTH", token, {
            maxAge: 60 * 60 * 1000 * 24,
            httpOnly: true,
          });

          return done(null, user);
        } catch (error) {
          done(error, false, { message: "Could not login user" });
        }
      }
    )
  );

  passport.use("current",
    new JWTStrategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([
          util.cookieExtractor,jwt.ExtractJwt.fromAuthHeaderAsBearerToken()
        ]),
        secretOrKey: config.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await userModel.findById(payload.userId);
          if (user) {
            done(null, user);
          } else {
            done(null, false, { message: "Token is not valid" });
          }
        } catch (err) {
          done(err, false);
        }
      }
    )
  );

  passport.use("github",
    new GithubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL,
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          //console.log({ login: "github", profile });
          let email = profile._json.email;
          if (!email) {
            email = `${profile._json.id}@github.com`;
          }
          const user = await userModel.findOne({ email });
          if (!user) {
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
            //console.log("new user created", newUser);
            setAuthCookie(req, newUser);
            return done(null, newUser);
          }
          setAuthCookie(req, user);
          return done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );

  passport.use("google",
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          //console.log({ login: "google", profile });
          let email = profile._json.email;
          if (!email) {
            email = `${profile._json.id}@google.com`;
          }
          const user = await userModel.findOne({ email });
          if (!user) {
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
            //console.log("new user created", newUser);
            return done(null, newUser);
          }
          //console.log("retorno user", user)
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
