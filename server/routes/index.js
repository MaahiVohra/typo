var express = require("express");
var router = express.Router();
/* GET home page. */
router.post("/", function (req, res, next) {
	res.status(200).send({ data: "some text" });
});
router.get("/", function (req, res) {
	res.send("hello from login");
});
module.exports = router;
