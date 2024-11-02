import mongoose from "mongoose";
import { UserError } from "../utils/errors.js";

// check if route parameter ':id' is a correct for mongoose
export async function paramsCheck(req, res, next) {
  if (req.baseUrl === "/api/users") {
    if (req.params.id === "me") {
      req.params.id = req.user.id;
    } else if (req.userRole !== "admin")
      return next(new UserError("Access denied.", 403));
  }

  const { id } = req.params;

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

  let endpoint = "";
  // identifying endpoints to validate bodies before they will reach our controllers
  if (req.path.endsWith("/cart")) {
    endpoint = "/cart";
  } else if (req.path.endsWith("/login")) {
    endpoint = "/login";
  } else if (
    req.path.endsWith("/increase-quantity") ||
    req.path.endsWith("/decrease-quantity")
  ) {
    endpoint = "/quantity";
  } else {
    endpoint = req.baseUrl;
  }

  switch (endpoint) {
    case "/api/categories": {
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
        return next(
          new UserError("Body parameter 'description' must be a string.")
        );

      break;
    }

    case "/api/users": {
      // we are expecting not more than 11 parameters
      if (receivedKeys.length > 11)
        return next(
          new UserError("Too many parameters. Not more than 11 are expected.")
        );

      if (req.method !== "PATCH") {
        // we are expecting not less than 10 parameters [fix later for methods]
        if (receivedKeys.length < 10)
          return next(
            new UserError("Not enough parameters. At least 10 are expexted.")
          );
      }

      // parameters are strictly defined
      const allowedParams = [
        "firstName",
        "lastName",
        "username",
        "password",
        "email",
        "phone",
        "country",
        "city",
        "street",
        "house",
        "apartment",
      ];

      // if there is smth else...
      const isBodyValid = receivedKeys.every(function (key) {
        return allowedParams.includes(key);
      });

      // ...BAD REQUEST
      if (!isBodyValid)
        return next(new UserError("Invalid parameters in body."));

      // collecting body parameters
      const {
        firstName,
        lastName,
        username,
        password,
        email,
        phone,
        country,
        city,
        street,
        house,
        apartment,
      } = req.body;

      // if firstName is missing and wrong type
      if (firstName === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'firstName' is missing."));
        }
      } else if (typeof firstName !== "string") {
        return next(
          new UserError("Body parameter 'firstName' must be a string.")
        );
      }

      // if lastName is missing and wrong type
      if (lastName === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'lastName' is missing."));
        }
      } else if (typeof lastName !== "string") {
        return next(
          new UserError("Body parameter 'lastName' must be a string.")
        );
      }

      // if username is missing and wrong type
      if (username === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'username' is missing."));
        }
      } else if (typeof username !== "string") {
        return next(
          new UserError("Body parameter 'username' must be a string.")
        );
      }

      // if password is missing and wrong type
      if (password === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'password' is missing."));
        }
      } else if (typeof password !== "string") {
        return next(
          new UserError("Body parameter 'password' must be a string.")
        );
      }

      // if email is missing and wrong type
      if (email === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'email' is missing."));
        }
      } else if (typeof email !== "string") {
        return next(new UserError("Body parameter 'email' must be a string."));
      }

      // if phone is missing and wrong type
      if (phone === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'phone' is missing."));
        }
      } else if (typeof phone !== "string") {
        return next(new UserError("Body parameter 'phone' must be a string."));
      }

      // if country is missing and wrong type
      if (country === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'country' is missing."));
        }
      } else if (typeof country !== "string") {
        return next(
          new UserError("Body parameter 'country' must be a string.")
        );
      }

      // if city is missing and wrong type
      if (city === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'city' is missing."));
        }
      } else if (typeof city !== "string") {
        return next(new UserError("Body parameter 'city' must be a string."));
      }

      // if street is missing and wrong type
      if (street === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'street' is missing."));
        }
      } else if (typeof street !== "string") {
        return next(new UserError("Body parameter 'street' must be a string."));
      }

      // if house is missing and wrong type
      if (house === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'house' is missing."));
        }
      } else if (!Number.isInteger(house) || house < 1) {
        return next(
          new UserError(
            "Body parameter 'house' must be a positive Integer >=1."
          )
        );
      }

      // optional parameter
      if (
        apartment !== undefined &&
        (!Number.isInteger(apartment) || apartment < 1)
      ) {
        return next(
          new UserError(
            "Body parameter 'apartment' must be a positive Integer >=1."
          )
        );
      }

      break;
    }

    case "/cart": {
      // we are expecting only 2 parameters
      if (receivedKeys.length !== 2)
        return next(new UserError("Only 2 body parameters are allowed."));

      // parameters are strictly defined
      const allowedParams = ["productId", "quantity"];

      // if there is smth else...
      const isBodyValid = receivedKeys.every(function (key) {
        return allowedParams.includes(key);
      });

      // ...BAD REQUEST
      if (!isBodyValid)
        return next(new UserError("Invalid parameters in body."));

      const { productId, quantity } = req.body;

      // if productId is missing
      if (productId === undefined)
        return next(new UserError("Body parameter 'productId' is missing."));

      // if quantity is missing
      if (quantity === undefined)
        return next(new UserError("Body parameter 'quantity' is missing."));

      if (typeof productId !== "string")
        return next(
          new UserError("Body parameter 'productId' must be a string.")
        );

      if (!mongoose.isValidObjectId(productId))
        return next(new UserError("Invalid body parameter 'productId'."));

      if (!Number.isInteger(quantity) || quantity < 1) {
        return next(
          new UserError(
            "Body parameter 'quantity' must be a positive Integer >=1."
          )
        );
      }
      break;
    }
    case "/login": {
      // we are expecting only 2 parameters
      if (receivedKeys.length !== 2)
        return next(new UserError("Only 2 body parameters are allowed."));

      // parameters are strictly defined
      const allowedParams = ["username", "password"];

      // if there is smth else...
      const isBodyValid = receivedKeys.every(function (key) {
        return allowedParams.includes(key);
      });

      // ...BAD REQUEST
      if (!isBodyValid)
        return next(new UserError("Invalid parameters in body."));

      const { username, password } = req.body;

      // if username is missing
      if (username === undefined)
        return next(new UserError("Body parameter 'username' is missing."));

      // if password is missing
      if (password === undefined)
        return next(new UserError("Body parameter 'password' is missing."));

      if (typeof username !== "string")
        return next(
          new UserError("Body parameter 'username' must be a string.")
        );

      if (typeof password !== "string")
        return next(
          new UserError("Body parameter 'password' must be a string.")
        );

      break;
    }

    case "/api/products": {
      // we are expecting not more than 6 parameters
      if (receivedKeys.length > 6)
        return next(
          new UserError("Too many parameters. Not more than 6 are expected.")
        );

      if (req.method !== "PATCH") {
        // we are expecting not less than 10 parameters [fix later for methods]
        if (receivedKeys.length < 5)
          return next(
            new UserError("Not enough parameters. At least 5 are expexted.")
          );
      }

      // parameters are strictly defined
      const allowedParams = [
        "name",
        "description",
        "price",
        "quantity",
        "categoryId",
        "imagePath",
      ];

      // if there is smth else...
      const isBodyValid = receivedKeys.every(function (key) {
        return allowedParams.includes(key);
      });

      // ...BAD REQUEST
      if (!isBodyValid)
        return next(new UserError("Invalid parameters in body."));

      // collecting body parameters
      const { name, description, price, quantity, categoryId, imagePath } =
        req.body;

      // if name is missing and wrong type
      if (name === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'name' is missing."));
        }
      } else if (typeof name !== "string") {
        return next(new UserError("Body parameter 'name' must be a string."));
      }

      // if description is missing and wrong type
      if (description === undefined) {
        if (req.method !== "PATCH") {
          return next(
            new UserError("Body parameter 'description' is missing.")
          );
        }
      } else if (typeof description !== "string") {
        return next(
          new UserError("Body parameter 'description' must be a string.")
        );
      }

      // if quantity is missing and wrong type
      if (quantity === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'quantity' is missing."));
        }
      } else if (!Number.isInteger(quantity) || quantity < 1) {
        return next(
          new UserError(
            "Body parameter 'quantity' must be a positive Integer >=1."
          )
        );
      }

      // if price is missing and wrong type
      if (price === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'price' is missing."));
        }
      } else if (typeof price !== "number" || price <= 0) {
        return next(
          new UserError(
            "Body parameter 'price' must be a positive non-zero number."
          )
        );
      }

      // if categoryId is missing and wrong type
      if (categoryId === undefined) {
        if (req.method !== "PATCH") {
          return next(new UserError("Body parameter 'categoryId' is missing."));
        }
      } else if (typeof categoryId !== "string") {
        return next(
          new UserError("Body parameter 'categoryId' must be a string.")
        );
      } else if (!mongoose.isValidObjectId(categoryId)) {
        return next(new UserError("Invalid body parameter 'categoryId'."));
      }

      // optional parameter
      if (imagePath !== undefined && typeof imagePath !== "string") {
        return next(
          new UserError("Body parameter 'imagePath' must be a string.")
        );
      }

      break;
    }

    case "/quantity": {
      // we are expecting only 2 parameters
      if (receivedKeys.length > 1)
        return next(
          new UserError("Too many parameters. Only 'amount' is expected.")
        );

      // parameters are strictly defined
      const allowedParams = ["amount"];

      // if there is smth else...
      const isBodyValid = receivedKeys.every(function (key) {
        return allowedParams.includes(key);
      });

      // ...BAD REQUEST
      if (!isBodyValid)
        return next(new UserError("Invalid parameters in body."));

      const { amount } = req.body;

      // if amount is missing
      if (amount === undefined)
        return next(new UserError("Body parameter 'amount' is missing."));

      if (!Number.isInteger(amount) || amount < 1)
        return next(
          new UserError(
            "Body parameter 'amount' must be a positive Integer >=1."
          )
        );

      break;
    }

    case "/api/orders": {
      // we are expecting only 2 parameters
      if (receivedKeys.length > 1)
        return next(
          new UserError("Too many parameters. Only 'status' is expected.")
        );

      // parameters are strictly defined
      const allowedParams = ["status"];

      // if there is smth else...
      const isBodyValid = receivedKeys.every(function (key) {
        return allowedParams.includes(key);
      });

      // ...BAD REQUEST
      if (!isBodyValid)
        return next(new UserError("Invalid parameters in body."));

      const { status } = req.body;

      // if amount is missing
      if (status === undefined)
        return next(new UserError("Body parameter 'status' is missing."));

      if (typeof status !== "string")
        return next(new UserError("Body parameter 'status' must be a string."));

      break;
    }
  }

  next();
}
