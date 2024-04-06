const sequelize = require("../db")
const { DataTypes } = require("sequelize")

const Song = sequelize.define("song", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  audio: { type: DataTypes.STRING, allowNull: false, unique: true },
  img: { type: DataTypes.STRING },
})

const Playlist = sequelize.define("playlist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING },
})

const Album = sequelize.define("album", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  img: { type: DataTypes.STRING },
})

const Author = sequelize.define("author", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
})

const Genre = sequelize.define("genre", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
})

const PlaylistSong = sequelize.define("playlist_song", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

Song.belongsToMany(Playlist, { through: PlaylistSong })
Playlist.belongsToMany(Song, { through: PlaylistSong })

Album.hasMany(Song)
Song.belongsTo(Album)

Author.hasMany(Song)
Song.belongsTo(Author)

Genre.hasMany(Song)
Song.belongsTo(Genre)

module.exports = {
  Song,
  Playlist,
  Album,
  Author,
  Genre,
  PlaylistSong,
}