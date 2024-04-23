function incorrectFields(object, allowedFields) {
  const valid = Object.keys(object).filter((key) =>
    !allowedFields.includes(key))
  return valid
}

module.exports = incorrectFields

