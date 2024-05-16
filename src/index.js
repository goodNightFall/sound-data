require("dotenv").config()
require("./models/models")
const express = require("express")
const sequelize = require("./db")
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./docs/sound_data")
const router = require("./routes/index")
const errorHandler = require("./middleware/ErrorHandlingMiddleware")

const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use("/api", router)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(errorHandler)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`Start services ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()
