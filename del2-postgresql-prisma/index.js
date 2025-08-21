const { PrismaClient } = require("@prisma/client");
const express = require("express");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

//Get all users

app.get("/users", async (req, res) => {
	try {
		const users = await prisma.user.findMany();
		console.log("users", users);
		res.send(users);
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: "Internal server error" });
	}
});

//Get a user by id
app.get("/users/:id", async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: parseInt(req.params.id) },
		});
		res.status(200).send(user);
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: "Internal server error" });
	}
});

//Create a user
app.post("/users", async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const newUser = await prisma.user.create({
			data: {
				username,
				email,
				password,
			},
		});
		return res.status(201).send("Created user");
	} catch (error) {
		console.log(error);
		if (error.code === "P2002") {
			return res.status(409).send("Username is taken");
		}
		return res.status(500).send("Internal server error");
	}
});

//Update a user
app.put("/users", async (req, res) => {
	const updatedUser = await prisma.user.update({
		where: { id: req.body.id },
		data: {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
		},
	});

	console.log("updatedUser", updatedUser);

	res.send("Updated user");
});

//Delete a user
app.delete("/users", async (req, res) => {
	const deletedUser = await prisma.user.delete({
		where: { id: req.body.id },
	});

	console.log("deletedUser", deletedUser);

	res.send("Deleted user");
});

//Create a server and listen on port 3000
app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
