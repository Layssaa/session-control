const { connect_DB } = require("../database/connect");
const { getDataRedis } = require("../repositories/get-redis");
const { setDataRedis } = require("../repositories/set-redis");
const { CreateToken } = require("../utils/make-jwt");

async function login(req, res) {
  const { email, password } = req.body;
  const { token: _token } = req.cookies;
  let userData;

  console.log(_token);

  try {
    userData = await getDataRedis(`session-${_token}`); //o token sempre muda
    console.log(userData);

    if (!userData || userData.attempts != 0) {
      const { rows } = await connect_DB(
        " SELECT * FROM  users WHERE email = $1",
        [email]
      );

      userData = rows;

      if (userData.length == 0) throw new Error("User not found");

      if (userData[0].password != password) {
        console.log("senha errada");
        setDataRedis(
          `session-${_token}`,
          {
            id: userData.id,
            attempts: userData.attempts + 1,
            delete: false,
          },
          "EX",
          120 * userData.attempts + 10
        );

        res.cookie("_token", _token, {
          secure: true,
          httpOnly: true,
          sameSite: "none",
        });

        throw new Error("Incorrect data");
      }

      const { token } = await CreateToken(email); 
      console.log("será enviado");
      console.log(`session-${token}`);

      setDataRedis(
        `session-${token}`,
        {
          id: userData.id,
          attempts: 0,
          delete: false,
        },
        "EX",
        3600
      );

      res.cookie("_token", token, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
    }

    res.json({ data: userData }).status(200);
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .send({ status: 500, msg: "Could not connect to the database." });
  }
}

module.exports = { login };
