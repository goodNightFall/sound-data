const Router = require("express")
const router = new Router()

const songRouter = require("./songRouter")
const playlistRouter = require("./playlistRouter")
const albumRouter = require("./albumRouter")
const authorRouter = require("./authorRouter")
const genreRouter = require("./genreRouter")

router.use("/", songRouter)
router.use("/", playlistRouter)
router.use("/", albumRouter)
router.use("/", authorRouter)
router.use("/", genreRouter)

module.exports = router