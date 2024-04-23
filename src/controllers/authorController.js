const { Author } = require("../models/models")
const ApiError = require("../error/ApiError")
const errorDetection = require("../utils/errorDetection")
const incorrectFields = require("../utils/incorrectFields")
const { nodeLogger } = require("../logger")

class AuthorController {
  async getAll(req, res) {
    try {
      const authors = await Author.findAll({ attributes: ["id", "name"] })

      const data = {
        data: authors
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't get authors"))
    }
  }

  async create(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["name"])
      if (inValidFields.length) {
        return res.json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const { name } = req.body
      const author = await Author.create({ name })

      const data = {
        data: {
          id: author.id,
          name: author.name
        },
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't create author"))
    }
  }

  async update(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["name"])
      if (inValidFields.length) {
        return res.json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const { id } = req.params
      const { name } = req.body

      await Author.update({ name }, { where: { id } })
      const author = await Author.findByPk(id, { attributes: ["id", "name"] })

      const data = {
        data: author
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't update author"))
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const isDeleted = await Author.destroy({ where: { id } })

      if (!isDeleted) {
        return res.json(ApiError.notFound("There is no author with this id"))
      }

      return res.json({ data: {} })
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't delete author"))
    }
  }
}

module.exports = new AuthorController()