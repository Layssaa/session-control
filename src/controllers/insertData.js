const { connect_DB } = require("../database/connect");

async function insertData(req, res) {
  const { name, email } = req.body;
  try {
    const result = await connect_DB(
      "INSERT INTO management.session (name, email, cpf, last_name, gender, favorite_genre, read_books, birth_date, language,) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)    ",
      name,
      email,
      cpf,
      last_name,
      gender,
      favorite_genre,
      read_books,
      birth_date,
      language
    );

    console.log(result);
    res.status(200).send({ msg: "Registration successful!" });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .send({ status: 400, msg: "Unable to register, check the data sent." });
  }
}

module.exports = { insertData };
