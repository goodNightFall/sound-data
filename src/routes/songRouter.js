const Router = require("express")
const router = new Router()
const songController = require("../controllers/songController")

router.get("/songs", songController.getAll)
router.get("/songs/:id", songController.getOne)
router.patch("/songs/:id", songController.update)
router.delete("/songs/:id", songController.delete)
router.post("/songs:search", songController.searchByFilter)
router.post("/song", songController.create)

module.exports = router