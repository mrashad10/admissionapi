const express = require("express")
const routes = require("./routes/routes")
const rabbit = require("./models/rabbit");

const app = express()
app.use(express.json());
app.use("/", routes);

app.listen(3000, () => {
	console.log("Server is up")
	rabbit.connect()
})
