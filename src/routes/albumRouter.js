const Router = require("express")
const router = new Router()
const albumController = require("../controllers/albumController")

router.get("/albums", albumController.getAll)
router.get("/albums/:id", albumController.getOne)
router.patch("/albums/:id", albumController.update)
router.delete("/albums/:id", albumController.delete)
router.post("/album", albumController.create)
router.post("/album/song/:id", albumController.addSongToAlbum)
router.delete("/album/song/:id", albumController.deleteSongFromAlbum)

module.exports = router