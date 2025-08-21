const { PrismaClient } = require("@prisma/client");
const express = require("express");
const { body, validationResult } = require("express-validator");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

//Middleware for validating user data
const validateUser = [
	body("username")
		.isString()
		.withMessage("Username must be a string")
		.isLength({ min: 3 })
		.withMessage("Username must be at least 3 characters long"),
	body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
	body("password")
		.isString()
		.withMessage("Password must be a string")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
];

//Get all users
app.get("/users", async (req, res) => {
	const users = await prisma.user.findMany();
	res.send(users);
});

//Get a user by id (with validation of id)
app.get("/users/:id", async (req, res) => {
	console.log(`ID is: ${req.params.id}`);
	if (typeof req.params.id !== "number") {
		return res.status(400).send("ID must be number");
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: parseInt(req.params.id) },
		});
		return res.status(200).send({ message: "User found", user });
	} catch (error) {
		return res
			.status(500)
			.send(`User with ID:${req.params.id} could not be found`);
	}
});

//Create a user (with validation of user data)
app.post("/users", validateUser, async (req, res) => {
	const result = validationResult(req);
	console.log(result);
	if (result.isEmpty()) {
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
				//Prisma error code when value is not unique
				/*
                Eftersom vårt prisma schema ser ut såhär så får vi ju en error eftersom username och email måste vara unika
                model User {
                    id       Int    @id @default(autoincrement())
                    username String @unique
                    email    String @unique
                    password String
                }
                */
				return res.status(409).send("Username is taken");
			}
			return res.status(500).send("Internal server error");
		}
	}
	return res.status(400).send({ errors: result.array() });
});

//Update a user (with validation of user data)
app.put("/users", validateUser, async (req, res) => {
	const result = validationResult(req);

	if (result.isEmpty()) {
		const updatedUser = await prisma.user.update({
			where: { id: req.body.id },
			data: {
				username: req.body.username,
				email: req.body.email,
				password: req.body.password,
			},
		});
		return res.status(200).send({ message: "Updated user", user: updatedUser });
	}
	return res.status(400).send({ errors: result.array() });
});

//Delete a user
app.delete("/users", async (req, res) => {
	try {
		const deletedUser = await prisma.user.delete({
			where: { id: req.body.id },
		});

		res.status(200).send({ message: "Deleted user", user: deletedUser });
	} catch (err) {
		if (err.code === "P2025") {
			// Prisma error code when record not found
			return res.status(404).send({ error: "User not found" });
		}
		console.error(err);
		res.status(500).send({ error: "Internal server error" });
	}
});

//Create a server and listen on port 3000
app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
