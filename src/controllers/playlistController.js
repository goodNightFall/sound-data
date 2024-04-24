const { Playlist, Song, Genre, Author, PlaylistSong } = require("../models/models")
const ApiError = require("../error/ApiError")
const errorDetection = require("../utils/errorDetection")
const incorrectFields = require("../utils/incorrectFields")
const { nodeLogger } = require("../logger")

class PlaylistController {
  async getAllByUser(req, res) {
    try {
      const playlists = await Playlist.findAll({
        attributes: ["id", "user_id", "name", "img"],
        include: [{
          model: Song, attributes: ["id", "name", "audio", "img"],
          include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }]
        }]
      })

      const data = {
        data: playlists.map(playlist => {
          return {
            id: playlist.id,
            name: playlist.name,
            img: playlist.img,
            songs: playlist.songs.map(song => {
              return {
                id: song.id,
                name: song.name,
                audio: song.audio,
                img: song.img,
                genre: song.genre,
                author: song.author,
                playlist_song_id: song.playlist_song.id
              }
            })
          }
        })
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't get playlists"))
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const playlist = await Playlist.findOne({
        where: { id },
        attributes: ["id", "name", "img"],
        include: [{
          model: Song, attributes: ["id", "name", "audio", "img"],
          include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }]
        }]
      })

      const data = {
        data: {
          id: playlist.id,
          name: playlist.name,
          img: playlist.img,
          songs: playlist.songs.map(song => {
            return {
              id: song.id,
              name: song.name,
              audio: song.audio,
              img: song.img,
              genre: song.genre,
              author: song.author,
              playlist_song_id: song.playlist_song.id
            }
          })
        }
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't get playlist"))
    }
  }

  async create(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["name", "user_id", "img", "songs"])
      if (inValidFields.length) {
        return res.json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const { name, user_id, img, songs } = req.body
      const playlist = await Playlist.create({ name, user_id, img })

      if (songs && Array.isArray(songs)) {
        await Promise.all(songs.map(async song_id => await playlist.addSong(await Song.findByPk(song_id))))
      }

      const newPlaylist = await Playlist.findOne({
        where: { id: playlist.id },
        attributes: ["id", "name", "img"],
        include: [{
          model: Song, attributes: ["id", "name", "audio", "img"],
          include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }]
        }]
      })

      const data = {
        data: {
          id: playlist.id,
          name: playlist.name,
          img: playlist.img,
          songs: newPlaylist.songs.map(song => {
            return {
              id: song.id,
              name: song.name,
              audio: song.audio,
              img: song.img,
              genre: song.genre,
              author: song.author,
              playlist_song_id: song.playlist_song.id
            }
          })
        }
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't create playlist"))
    }
  }

  async update(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["name", "img"])
      if (inValidFields.length) {
        return res.json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const { id } = req.params
      const { name, img } = req.body

      await Playlist.update({ name, img }, { where: { id } })
      const playlist = await Playlist.findOne({
        where: { id },
        attributes: ["id", "name", "img"],
        include: [{
          model: Song, attributes: ["id", "name", "audio", "img"],
          include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }]
        }]
      })

      const data = {
        data: {
          id: playlist.id,
          name: playlist.name,
          img: playlist.img,
          songs: playlist.songs.map(song => {
            return {
              id: song.id,
              name: song.name,
              audio: song.audio,
              img: song.img,
              genre: song.genre,
              author: song.author,
              playlist_song_id: song.playlist_song.id
            }
          })
        }
      }

      return res.json(data)
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't update album"))
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params

      const isDeleted = await Playlist.destroy({ where: { id } })

      if (!isDeleted) {
        return res.json(ApiError.notFound("There is no album with this id"))
      }

      return res.json({ data: {} })
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't delete album"))
    }
  }

  async addSongToPlaylist(req, res) {
    try {
      const inValidFields = incorrectFields(req.body, ["song_id"])
      if (inValidFields.length) {
        return res.json(ApiError.badRequest(`Field's ${inValidFields.join(", ")} is not allowed`))
      }

      const { id } = req.params
      const { song_id } = req.body

      const playlist = await Playlist.findByPk(id) || res.json(ApiError.badRequest("There is no playlist with this id"))

      await playlist.addSong(await Song.findByPk(song_id))

      const song = await Song.findOne({
        where: { id: song_id },
        attributes: ["id", "album_id", "name", "audio", "img"],
        include: [{ model: Genre, attributes: ["id", "name"] }, { model: Author, attributes: ["id", "name"] }]
      })

      const data = {
        data: song
      }

      return res.json(data)
    }
    catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't update album"))
    }
  }

  async deleteSongFromPlaylist(req, res) {
    try {
      const { id } = req.params

      await PlaylistSong.destroy({ where: { id } })

      return res.json({ data: {} })
    } catch (err) {
      nodeLogger.error(err)
      const error = errorDetection(err)
      error ? res.json(error) : res.json(ApiError.internal("Couldn't update album"))
    }
  }
}



module.exports = new PlaylistController()