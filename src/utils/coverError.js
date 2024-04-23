function coverError(error) {
  return {
    errors: [
      {
        code: error.status,
        message: error.name,
        meta: {
          additional_info: error.message
        }
      }
    ]
  }
}

module.exports = coverError