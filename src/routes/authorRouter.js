const Router = require("express")
const router = new Router()
const authorController = require("../controllers/authorController")

router.get("/authors", authorController.getAll)
router.post("/author", authorController.create)
router.put("/authors/:id", authorController.update)
router.delete("/authors/:id", authorController.delete)

module.exports = router