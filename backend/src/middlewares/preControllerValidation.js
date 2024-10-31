import mongoose from "mongoose";
import { UserError } from "../utils/errors.js";

// check if route parameter ':id' is a correct for mongoose
export async function paramsCheck(req, res, next) {
  const { id } = req.params

  if (!mongoose.isValidObjectId(id))
    return next(new UserError("Invalid route parameter ':id'."));

  next();
}

// in our REST API we are not allowing GET-requests to have body parameters
export async function noBodyCheck(req, res, next) {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // body is restricted
  if (receivedKeys.length > 0)
    return next(new UserError("Body is restricted for this request."));

  next();
}

export async function bodyCheck(req, res, next) {  
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // ignoring empty body
  if (receivedKeys.length === 0)
    return next(new UserError("No parameters in body."));

  // identifying endpoints to validate bodies before they will reach our controllers
  const rootEndpoint = req.baseUrl;

  switch (rootEndpoint) {
    case "/api/categories":
      // we are expecting not more than 2 parameters ("name", "description" (optional))
      if (receivedKeys.length > 2)
        return next(
          new UserError("Too many parameters. Not more than 2 are expected.")
        );

      // parameters are strictly defined
      const allowedParams = ["name", "description"];

      // if there is smth else...
      const isBodyValid = receivedKeys.every(function (key) {
        return allowedParams.includes(key);
      });

      // ...BAD REQUEST
      if (!isBodyValid)
        return next(new UserError("Invalid parameters in body."));

      const { name, description } = req.body;

      // if name is missing
      if (name === undefined && req.method !== "PATCH")
        return next(new UserError("Body parameter 'name' is missing."));

      if (name !== undefined && typeof name !== "string")
        return next(new UserError("Body parameter 'name' must be a string."));

      // optional parameter
      if (description !== undefined && typeof description !== "string")
        return next(new UserError("Body parameter 'description' must be a string."));

      break;
  }

  next();
}
