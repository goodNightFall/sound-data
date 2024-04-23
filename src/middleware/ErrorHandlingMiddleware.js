const ApiError = require("../error/ApiError")
const coverError = require("../utils/coverError")

module.exports = function (err, req, res) {
  if (err instanceof ApiError) {
    const error = coverError(err)
    return res.status(error.status).json(error)
  }

  return res.status(500).json({
    errors: {
      code: 500,
      message: "Internal server error",
      meta: {
        additional_info: "Something went wrong"
      }
    }
  })
}