const sequelize = require("../db")
const { DataTypes } = require("sequelize")

const Playlist = sequelize.define("playlist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, required: true, allowNull: false, validate: { isInt: true } },
  name: { type: DataTypes.STRING, required: true, allowNull: false, validate: { len: [1, 100] } },
  img: { type: DataTypes.STRING, validate: { isUrl: true } },
})

const Album = sequelize.define("album", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, required: true, allowNull: false, unique: true, validate: { len: [1, 100] } },
  img: { type: DataTypes.STRING, validate: { isUrl: true } },
})

const Author = sequelize.define("author", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, required: true, allowNull: false, unique: true, validate: { len: [1, 100] } },
})

const Genre = sequelize.define("genre", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, required: true, allowNull: false, unique: true, validate: { len: [1, 100] } },
})

const Song = sequelize.define("song", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  album_id: { type: DataTypes.INTEGER, references: { model: Album, key: "id" }, allowNull: true, validate: { isInt: true } },
  author_id: { type: DataTypes.INTEGER, references: { model: Author, key: "id" }, required: true, allowNull: false, validate: { isInt: true } },
  genre_id: { type: DataTypes.INTEGER, references: { model: Genre, key: "id" }, required: true, allowNull: false, validate: { isInt: true } },
  name: { type: DataTypes.STRING, required: true, allowNull: false, validate: { len: [1, 100] } },
  audio: { type: DataTypes.STRING, required: true, allowNull: false, unique: true, validate: { isUrl: true } },
  img: { type: DataTypes.STRING, validate: { isUrl: true } },
})

const PlaylistSong = sequelize.define("playlist_song", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

Song.belongsToMany(Playlist, { through: PlaylistSong })
Playlist.belongsToMany(Song, { through: PlaylistSong })

Album.hasMany(Song, { foreignKey: "album_id" })
Song.belongsTo(Album, { foreignKey: "album_id" })

Author.hasMany(Song, { foreignKey: "author_id", onDelete: "CASCADE", hooks: true })
Song.belongsTo(Author, { foreignKey: "author_id" })

Genre.hasMany(Song, { foreignKey: "genre_id", onDelete: "CASCADE", hooks: true })
Song.belongsTo(Genre, { foreignKey: "genre_id" })

module.exports = {
  Song,
  Playlist,
  Album,
  Author,
  Genre,
  PlaylistSong,
}