const { Genre } = require("../models/models")
const ApiError = require("../error/ApiError")
const errorDetection = require("../utils/errorDetection")
const incorrectFields = require("../utils/incorrectFields")
const { nodeLogger } = require("../logger")

class GenreController {
  async getAll(req, res) {
    try {
      const genres = await Genre.findAll({ attributes: ["id", "name"] })

      const data = {
        data: genres
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't get genres"))
    }
  }

  async create(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["name"])
      if (inValidFields.length) {
        return res.json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const { name } = req.body
      const genre = await Genre.create({ name })

      const data = {
        data: {
          id: genre.id,
          name: genre.name
        }
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't create genre"))
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

      await Genre.update({ name }, { where: { id } })
      const genre = await Genre.findByPk(id, { attributes: ["id", "name"] })

      const data = {
        data: {
          id: genre.id,
          name: genre.name
        },
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't update genre"))
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const isDeleted = await Genre.destroy({ where: { id } })

      if (!isDeleted) {
        return res.json(ApiError.notFound("There is no genre with this id"))
      }

      return res.json({ data: {} })
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't delete genre"))
    }
  }
}

module.exports = new GenreController()