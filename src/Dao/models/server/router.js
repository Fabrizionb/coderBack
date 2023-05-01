/* eslint-disable */
import express from "express";
import config from "../../../../data.js";
import  jwt  from "jsonwebtoken";

export class Router {
  #router;
  #path;

  constructor(path, options = { middlewares: [] }) {
    this.#router = express.Router();
    this.#path = path;
    const { middlewares } = options;

    this.#router.use(generateCustomResponse);
    this.init();
  }

  init() {}
  get path() {
    return this.#path;
  }

  get router() {
    return this.#router;
  }

  get(path, policies,  ...callbacks) {
    return this.#router.get(path, handlePolicies(policies), ...callbacks);
  }

  post(path, policies,  ...callbacks) {
    return this.#router.post(path, handlePolicies(policies), ...callbacks);
  }

  put(path, policies,  ...callbacks) {
    return this.#router.put(path, handlePolicies(policies), ...callbacks);
  }

  delete(path, policies,  ...callbacks) {
    return this.#router.delete(path, handlePolicies(policies), ...callbacks);
  }

  put(path, policies,  ...callbacks) {
    return this.#router.put(path, handlePolicies(policies), ...callbacks);
  }
}

function generateCustomResponse(req, res, next) {
  res.okResponse = (payload) =>
    res.status(200).send({
      status: 200,
      payload,
    });
  res.serverError = (error) => {
    res.status(500).send({
      status: "error",
      error,
    });
  };
  res.userError = (error) => {
    res.status(400).send({
      status: "error",
      error,
    });
  };
  next();
}
function handlePolicies(policies) {
  return (req, res, next) => {
    if (policies.includes("PUBLIC")) {
      return next();
    }

    // Busca el token en la cookie en lugar del bearer
    const token = req.cookies.AUTH;
    
    if (!token) {
      return res.status(401).send({ status: "error", error: "Unauthorized" });
    }
    
    try {
      const user = jwt.verify(token, config.JWT_SECRET);
      if (!policies.includes(user.role?.toUpperCase())) {
        return res.status(403).send({ status: "error", error: "Forbidden" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).send({ status: "error", error: "Unauthorized" });
    }
  };
}

