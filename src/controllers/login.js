const { connect_DB } = require("../database/connect");
const { getDataRedis, setDataRedis } = require("../database/redis");
const { CreateToken } = require("../utils/make-jwt");

async function login(req, res) {
  const { email, password } = req.body;
  const { _token } = req.cookies;
  let userData;

  console.log(_token);
  console.log("_______________");

  try {
    userData = await getDataRedis(`session-${_token}`); //mudar a KEY, deixar só o token
    console.log(userData);

    if (!userData || userData.attempts != 0 || !_token) {
      const { rows } = await connect_DB(
        "SELECT * FROM  users WHERE email = $1",
        [email]
      );

      userData = rows;
      const { token } = await CreateToken(email);

      if (userData.length == 0) throw new Error("User not found");

      if (userData[0].password != password) {
        console.log("token", token);

        setDataRedis(
          `session-${token}`,
          {
            id: userData.id,
            attempts: userData.attempts + 1,
            delete: false,
          },
          "EX",
          0
        );

        res.cookie("_token", _token || token, {
          secure: true,
          httpOnly: true,
          sameSite: "none",
        });

        return res.send({ data: "Incorrect data", status: 401 }).status(200);

        // throw new Error("Incorrect data");
      }

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
    res.status(200).send({ status: 500, msg: error });
  }
}

module.exports = { login };

/*if (_token != undefined) {
          console.log('_token', _token);
          setDataRedis(
            `session-${_token}`,
            {
              id: userData.id,
              attempts: userData.attempts + 1,
              delete: false,
            },
            "EX",
            120 * Number(userData.attempts) + 10
          );
        } else {*/
//}
