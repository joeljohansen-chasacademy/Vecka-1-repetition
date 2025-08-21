const { PrismaClient } = require("@prisma/client");
const express = require("express");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

//Get all users

//Get a user by id

//Create a user
app.post("/users", async (req, res) => {
	//return res.status(200).json({ message: "User created successfully" });
});

//Update a user

//Delete a user

//Create a server and listen on port 3000
app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
