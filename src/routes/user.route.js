/* eslint-disable */

import { Router } from "express";
import passport from "passport";
import controller from "../controller/user.controller.js";
const route = Router();

route.get("/failurelogin", controller.failureLogin.bind(controller));
route.get("/failureregister", controller.failureRegister.bind(controller));
route.post("/logout", controller.logout.bind(controller));
route.get("/unauthorized", controller.unauthorized.bind(controller));
route.post("/restore-password", controller.restorePassword.bind(controller));
route.get(
  "/google-callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  controller.googleCallback.bind(controller)
);
route.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  controller.google.bind(controller)
);
route.get(
  "/github-callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  controller.githubCallback.bind(controller)
);
route.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  controller.github.bind(controller)
);

route.get(
  "/current",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/unauthorized",
  }),
  controller.current.bind(controller)
);
route.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/user/failureregister",
  }),  controller.register.bind(controller));
route.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/user/failurerelogin",
  }),
  controller.login.bind(controller)
);

export default route;
