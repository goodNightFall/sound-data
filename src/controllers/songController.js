const { Song, Genre, Author, Album } = require("../models/models")
const ApiError = require("../error/ApiError")
const errorDetection = require("../utils/errorDetection")
const incorrectFields = require("../utils/incorrectFields")
const { nodeLogger } = require("../logger")

class SongController {
  async getAll(req, res) {
    try {
      const songs = await Song.findAll({
        include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }],
        attributes: ["id", "album_id", "name", "audio", "img"]
      },
      )

      const data = {
        data: songs
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't get songs"))
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const song = await Song.findOne({
        where: { id },
        include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }],
        attributes: ["id", "album_id", "name", "audio", "img"]
      })

      if (!song) {
        return res.json(ApiError.notFound("There is no song with this id"))
      }

      const data = {
        data: song
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't get song"))
    }
  }

  async update(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["album_id", "author_id", "genre_id", "name", "audio", "img"])
      if (inValidFields.length) {
        return res.json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const { id } = req.params
      const { album_id, author_id, genre_id, name, audio, img } = req.body

      if (album_id) {
        await Album.findByPk(album_id) || res.json(ApiError.badRequest("There is no album with this id"))
      }

      const genre = await Genre.findByPk(genre_id)
      const author = await Author.findByPk(author_id)
      if (!genre || !author) {
        return res.json(ApiError.badRequest("There is no genre or author with this id"))
      }

      await Song.update({ album_id, author_id, genre_id, name, audio, img }, { where: { id } })
      const song = await Song.findOne({
        where: { id },
        include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }],
        attributes: ["id", "album_id", "name", "audio", "img"]
      })

      const data = {
        data: song
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't update song"))
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const isDeleted = await Song.destroy({ where: { id } })

      if (!isDeleted) {
        return res.json(ApiError.notFound("There is no song with this id"))
      }

      return res.json({ data: {} })
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't delete song"))
    }
  }

  async searchByFilter(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["author_id", "genre_id"])
      if (inValidFields.length) {
        return res.json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const filter = req.body
      const songs = await Song.findAll({
        where: filter,
        include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }],
        attributes: ["id", "album_id", "name", "audio", "img"]
      })

      const data = {
        data: songs
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't find song"))
    }
  }

  async create(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["album_id", "author_id", "genre_id", "name", "audio", "img"])
      if (inValidFields.length) {
        return res.json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const { album_id, author_id, genre_id, name, audio, img } = req.body

      if (album_id) {
        await Album.findByPk(album_id) || res.json(ApiError.badRequest("There is no album with this id"))
      }

      const genre = await Genre.findByPk(genre_id)
      const author = await Author.findByPk(author_id)
      if (!genre || !author) {
        return res.json(ApiError.badRequest("There is no genre or author with this id"))
      }

      const song = await Song.create({ album_id, author_id, genre_id, name, audio, img })

      const data = {
        data: {
          id: song.id,
          album_id: song.album_id,
          author: { author_id: author.id, name: author.name },
          genre: { genre_id: genre.id, name: genre.name },
          name: song.name,
          audio: song.audio,
          img: song.img
        },
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't create song"))
    }
  }
}

module.exports = new SongController()