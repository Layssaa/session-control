const router = require("express").Router();
const { login } = require("../controllers/login");
const { insertData } = require("../controllers/insertData");
const { authCookie } = require("../middlewares/auth-cookie");

router.post("/insert", insertData);

router.post("/auth", authCookie, login);

module.exports = router;
