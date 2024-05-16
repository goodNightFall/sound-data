const ApiError = require("../error/ApiError")

function errorDetection(error) {
  if (error.name === "TypeError")
    return { code: 404, message: ApiError.notFound(error.message) }

  if (error.name === "SequelizeValidationError")
    return { code: 400, message: ApiError.badRequest(error.errors[0].message) }

  if (error.name === "SequelizeUniqueConstraintError")
    return { code: 400, message: ApiError.badRequest(error.errors[0].message) }

  if (error.name === "SequelizeDatabaseError")
    return { code: 400, message: ApiError.badRequest(error.message) }
}

module.exports = errorDetection