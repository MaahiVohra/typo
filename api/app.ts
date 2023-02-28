import express from "express";
import path from "path";
import { registerRouter } from "./routes/register";
import { loginRouter } from "./routes/login";
import { updateRouter } from "./routes/update";
import { PrismaClient } from "@prisma/client";
import { Auth } from "./routes/auth";
export const prisma = new PrismaClient();
export const app = express();
const port = process.env.PORT || 5173;
app.use(express.static(path.join(__dirname, "../dist")));

// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "../public", "index.html"));
// });
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../dist", "/index.html"));
});
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});
app.options("*", (req, res) => {
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
	res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.status(200).send();
});
app.get("/api/app", (req, res) => {
	res.send("Hello from the API!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// login routes
app.use("/api/routes/register", registerRouter);
app.use("/api/routes/login", loginRouter);
app.use("/api/routes/update", Auth, updateRouter);
app.listen(port, () => {
	console.log("listening at port ", port);
});
module.exports = app;
