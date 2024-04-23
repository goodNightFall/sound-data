const Router = require("express")
const router = new Router()
const playlistController = require("../controllers/playlistController")

router.get("/playlists/user/:id", playlistController.getAllByUser)
router.get("/playlists/:id", playlistController.getOne)
router.patch("/playlists/:id", playlistController.update)
router.delete("/playlists/:id", playlistController.delete)
router.post("/playlist", playlistController.create)
router.post("/playlist/song/:id", playlistController.addSongToPlaylist)
router.delete("/playlist/song/:id", playlistController.deleteSongFromPlaylist)

module.exports = router