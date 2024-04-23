const ApiError = require("../error/ApiError")

function errorDetection(error) {
  if (error.name === "TypeError")
    return ApiError.notFound(error.message)

  if (error.name === "SequelizeValidationError")
    return ApiError.badRequest(error.errors[0].message)

  if (error.name === "SequelizeUniqueConstraintError")
    return ApiError.badRequest(error.errors[0].message)

  if (error.name === "SequelizeDatabaseError")
    return ApiError.badRequest(error.message)
}

module.exports = errorDetection