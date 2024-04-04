require("dotenv").config()
const express = require("express")
const sequelize = require("./db")
// eslint-disable-next-line no-unused-vars
const models = require("./models/models")

const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())

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
