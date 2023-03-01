import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const registerRouter = express.Router();
registerRouter.get("/", function (req, res) {
	res.send("Hello from register");
});
registerRouter.post("/", function (req, res, next) {
	bcrypt
		.hash(req.body.password, 10)
		.then(async (hashedPassword) => {
			const user = await prisma.user.findUnique({
				where: {
					email: req.body.email,
				},
			});
			if (user) {
				res.status(409).send({
					message: "User already exists",
				});
				return;
			}
			// create a new user instance and collect the data
			prisma.user
				.create({
					data: {
						email: req.body.email,
						name: req.body.name,
						password: hashedPassword.toString(),
					},
				})
				// return success if the new user is added to the database successfully
				.then((result) => {
					res.status(200).send({
						message: "User Created Successfully",
						result,
					});
				})
				// catch error if the new user wasn't added successfully to the database
				.catch((error) => {
					res.status(500).send({
						message: "Error creating user",
						error,
					});
				});
		})
		// catch error if the password hash isn't successful
		.catch((e) => {
			res.status(500).send({
				message: "Password was not hashed successfully",
				e,
			});
		});
});
