const { PrismaClient } = require("@prisma/client");
const express = require("express");
const { body, validationResult } = require("express-validator");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

//Middleware for validating user data

//Get all users

//Get a user by id (with validation of id)

//Create a user (with validation of user data)

//Update a user (with validation of user data)

//Delete a user

//Create a server and listen on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
