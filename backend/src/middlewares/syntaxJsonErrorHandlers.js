// if there is a parsing error (for example, number 42 in GET-request body)
export async function jsonParsingErrorHandler(err, req, res, next) {
  if (err.name === "SyntaxError" /*&& err.status === 400 && "body" in err*/) {
    return res.status(400).json({
      error: "JSON parsing error",
      details: err.message,
    });
  }

  next(err);
}
