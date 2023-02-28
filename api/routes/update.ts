import express from "express";
import { prisma, app } from "../app";
export const updateRouter = express.Router();
updateRouter.get("/", function (req, res) {
	res.send("Hello from update");
});
updateRouter.post("/", (req, res) => {
	console.log(req.body);
	prisma.user
		.update({
			where: {
				name: req.body.name,
			},
			data: {
				score: req.body.score,
			},
		})
		.then((user) => {
			//   return success res
			res.status(200).send({
				message: "Update Successful",
				username: user!.name,
				score: user!.score,
			});
		})
		.catch((err) => {
			res.status(400).send({
				message: "Not Authorized or email not found",
				err,
			});
		});
});
