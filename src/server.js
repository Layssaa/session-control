require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routers/routers");
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

app.use(router);

app.listen(process.env.PORT || 3030, () => {
  console.log("Servidor rodando na porta", process.env.PORT);
});
