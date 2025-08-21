const express = require("express");

const app = express();
app.use(express.json());

//Create a GET request to the root route
app.get("/", (req, res) => {
	res.send("OK!");
});

//Create a POST request to the root route
app.post("/", (req, res) => {
	console.log(req.body);
	res.send("Received a POST request");
});

//create a PUT request to the root route
app.put("/", (req, res) => {
	res.send("Received a PUT request");
});

//create a DELETE request to the root route
app.delete("/", (req, res) => {
	res.send("Received a DELETE request");
});

//create a server and listen on port 3000
app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
