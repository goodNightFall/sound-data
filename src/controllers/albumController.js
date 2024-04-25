const { Album, Song, Genre, Author } = require("../models/models")
const ApiError = require("../error/ApiError")
const errorDetection = require("../utils/errorDetection")
const incorrectFields = require("../utils/incorrectFields")
const { nodeLogger } = require("../logger")

class AlbumController {
  async getAll(req, res) {
    try {
      const albums = await Album.findAll({
        attributes: ["id", "name", "img"],
        include: [{
          model: Song, attributes: ["id", "name", "audio", "img"],
          include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }]
        }]
      })

      const data = {
        data: albums
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.status(error.code).json(error.message) : res.status(500).json(ApiError.internal("Couldn't get albums"))
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const album = await Album.findOne({
        where: { id },
        attributes: ["id", "name", "img"],
        include: [{
          model: Song, attributes: ["id", "name", "audio", "img"],
          include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }]
        }]
      })

      if (!album) {
        return res.status(404).json(ApiError.notFound("There is no album with this id"))
      }

      const data = {
        data: album
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.status(error.code).json(error.message) : res.status(500).json(ApiError.internal("Couldn't get album"))
    }
  }

  async create(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["name", "img", "songs"])
      if (inValidFields.length) {
        return res.status(400).json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const { name, img, songs } = req.body
      const album = await Album.create({ name, img })

      if (songs && Array.isArray(songs)) {
        await Promise.all(songs.map(async song_id => await Song.update(
          { album_id: album.id },
          { where: { id: song_id, album_id: null } })))
      }

      album.songs = await Song.findAll({
        where: { album_id: album.id },
        attributes: ["id", "name", "audio", "img"],
        include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }]
      })

      const data = {
        data: {
          id: album.id,
          name: album.name,
          img: album.img,
          songs: album.songs
        },
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.status(error.code).json(error.message) : res.status(500).json(ApiError.internal("Couldn't create album"))
    }
  }

  async update(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["name", "img"])
      if (inValidFields.length) {
        return res.status(400).json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const { id } = req.params
      const { name, img } = req.body

      await Album.update({ name, img }, { where: { id } })
      const album = await Album.findOne({
        where: { id },
        attributes: ["id", "name", "img"],
        include: [{
          model: Song, attributes: ["id", "name", "audio", "img"],
          include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }]
        }]
      })

      const data = {
        data: album
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.status(error.code).json(error.message) : res.status(500).json(ApiError.internal("Couldn't update album"))
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      await Song.update({ album_id: null }, { where: { album_id: id } })

      const isDeleted = await Album.destroy({ where: { id } })

      if (!isDeleted) {
        return res.status(404).json(ApiError.notFound("There is no album with this id"))
      }

      return res.json({ data: {} })
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.status(error.code).json(error.message) : res.status(500).json(ApiError.internal("Couldn't delete album"))
    }
  }

  async addSongToAlbum(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["song_id"])
      if (inValidFields.length) {
        return res.status(400).json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const { id } = req.params
      const { song_id } = req.body

      await Song.update(
        { album_id: id },
        { where: { id: song_id, album_id: null } })

      const song = await Song.findOne({
        where: { id: song_id },
        attributes: ["id", "album_id", "name", "audio", "img"],
        include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }]
      })

      const data = {
        data: song
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.status(error.code).json(error.message) : res.status(500).json(ApiError.internal("Couldn't update album"))
    }
  }

  async deleteSongFromAlbum(req, res) {
    try {
      const { id } = req.params

      await Song.update({ album_id: null }, { where: { id } })

      return res.json({ data: {} })
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.status(error.code).json(error.message) : res.status(500).json(ApiError.internal("Couldn't update album"))
    }
  }
}

module.exports = new AlbumController()