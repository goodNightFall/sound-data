const Router = require("express")
const router = new Router()
const genreController = require("../controllers/genreController")

router.get("/genres", genreController.getAll)
router.post("/genre", genreController.create)
router.put("/genres/:id", genreController.update)
router.delete("/genres/:id", genreController.delete)

module.exports = router