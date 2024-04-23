const coverError = require("../utils/coverError")

class ApiError extends Error {
  constructor(status, name, message) {
    super()
    this.status = status
    this.name = name
    this.message = message
  }

  static badRequest(message) {
    const error = new ApiError(400, "Bad request", message)
    return coverError(error)
  }

  static unauthorized(message) {
    const error = new ApiError(401, "Unauthorized", message)
    return coverError(error)
  }

  static forbidden(message) {
    const error = new ApiError(403, "Forbidden", message)
    return coverError(error)
  }

  static notFound(message) {
    const error = new ApiError(404, "Not found", message)
    return coverError(error)
  }

  static internal(message) {
    const error = new ApiError(500, "Internal server error", message)
    return coverError(error)
  }
}

module.exports = ApiError
