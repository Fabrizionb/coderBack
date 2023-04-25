/* eslint-disable*/
import passport from "passport";
import local from "passport-local";
import userModel from "../Dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import github from "passport-github2";
import config from "../data.js";
import google from "passport-google-oauth20";
import jwtLib  from "jsonwebtoken"
import jwt from "passport-jwt"
 
const LocalStrategy = local.Strategy;
const GithubStrategy = github.Strategy;
const GoogleStrategy = google.Strategy;
const JWTStrategy = jwt.Strategy

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
          //console.log("estrategia passport register")
          const userExist = await userModel.findOne({ email: username });
          if (userExist) {
            //console.log("estrategia passport register, userExist")
            return done(null, false, { message: "User already exists" });
          }
          // new cart
          const createdCart = await fetch("http://localhost:8080/api/cart", {
            method: "POST",
          });
          //console.log("se creo el carrito", createdCart )
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
          //console.log("se creo el newUser", newUser )
          // Genera el token JWT y setea la cookie en la respuesta
          const userObj = {
            userId: newUser._id.toString(),
            cartId: newUser.cartId.toString(),
            role: newUser.role,
          };
          //console.log("se creo el userObj", userObj )
          const token = jwtLib.sign(userObj, config.JWT_SECRET, { expiresIn: '24h' });
          req.res.cookie('AUTH', token, {
            maxAge: 60 * 60 * 1000 * 24,
            httpOnly: true,
          });
  
          return done(null, newUser);
        } catch (error) {
          done(error, false, {message:"Could not create user"});
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
          const token = jwtLib.sign(userObj, config.JWT_SECRET, { expiresIn: '24h' });
          req.res.cookie('AUTH', token, {
            maxAge: 60 * 60 * 1000 * 24,
            httpOnly: true,
          });
  
          return done(null, user);
        } catch (error) {
          done(error, false, {message:"Could not login user"});
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([
          cookieExtractor,
          jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: config.JWT_SECRET,
      },
      (payload, done) => {
        try {
          done(null, payload);
        } catch (err) {
          done(err, false);
        }
      }
    )
  );

  function cookieExtractor(req) {
    return req?.cookies?.['AUTH'] || null;
  }

  passport.use("github",
    new GithubStrategy(
      {
        clientID: config.github_client_id,
        clientSecret: config.github_client_secret,
        callbackURL: config.github_callback_url,
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          //console.log({ login: "github", profile });
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
            //console.log("new user created", newUser);
            return done(null, newUser);
          }
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
        callbackURL: config.google_callback_url,
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          //console.log({ login: "google", profile });
          let email = profile._json.email;
          if (!email) {
            email = `${profile._json.id}@google.com`;
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
            //console.log("new user created", newUser);
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
