import { UserError } from "../utils/errors.js";

// if there is a parsing error (for example, number 42 in GET-request body)
export async function errorHandler(err, req, res, next) {
  if (err.name === "SyntaxError") {
    return res.status(400).json({
      message: "JSON parsing error",
      details: err.message,
    });
  }

  // handling user errors
  if (err instanceof UserError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // all not handled, probably are server errors
  res.status(500).json({
    message: "Internal Server Error",
  });
}
