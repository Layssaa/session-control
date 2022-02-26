const { connect_DB } = require("../database/connect");
const { getDataRedis, setDataRedis } = require("../database/redis");
const { CreateToken } = require("../utils/make-jwt");

async function login(req, res) {
  const { email, password } = req.body;
  const { _token } = req.cookies;
  let userData;
  let feedbackMessage = "";

  try {
    userData = await getDataRedis(`session-${_token}`);
    feedbackMessage = "Login successfully done";
    // console.log("------- Data ------");
    // console.log(userData);

    // userData: {
    //    id,
    //    attempts,
    //    delete
    // }

    if (!userData || userData.attempts != 0 || !_token) {
      const { rows } = await connect_DB(
        "SELECT * FROM  users WHERE email = $1",
        [email]
      );

      userData = rows;

      if (userData.length == 0) throw new Error("User not found");

      const { token, message } = await matchPasswordControllSession(
        userData,
        email,
        password,
        _token
      );

      feedbackMessage = message;

      console.log(feedbackMessage);
      console.log("--------------token---------------");
      console.log(token);

      res.cookie("_token", token, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
    }

    res.json({ data: userData, message: feedbackMessage }).status(200);
  } catch (error) {
    console.log(error);
    res.status(200).send({ status: 500, msg: error });
  }
}

module.exports = { login };

async function matchPasswordControllSession(userData, email, password, _token) {
  console.log(userData);
  if (userData[0].password != password && !_token) {
    const { token } = await CreateToken(email);

    setDataRedis(
      `session-${token}`,
      {
        id: userData[0].id,
        attempts: 1,
        delete: false,
      },
      1
    );

    return { token, message: "Incorret password and dont have loggin before" };
  }

  if (userData[0].password != password && _token) {
    setDataRedis(
      `session-${_token}`,
      {
        id: userData[0].id,
        attempts: userData.attempts + 1,
        delete: false,
      },
      userData.attempts + 1
    );

    return {
      token: _token,
      message: "Incorret password and try do loggin before",
    };
  }

  const { token } = await CreateToken(email);

  setDataRedis(
    `session-${token}`,
    {
      id: userData.id,
      attempts: 0,
      delete: false,
    },
    3600
  );

  return { token, message: "OK" };
}

// console.log("token -->", _token);
//  console.log("attempts -->", userData);
//
//  const attempts = userData[0].attempts || 0;
//  console.log("Verificar ATTEMPTS", attempts);
//
//  setDataRedis(
//  `session-${_token || token}`,
//  {
//  id: userData[0].id,
//  attempts: attempts + 1,
//  delete: false,
//  },
//  attempts + 1
//  );
//
//  res.cookie("_token", _token || token, {
//  secure: true,
//  httpOnly: true,
//  sameSite: "none",
//  });
//
//  return res.send({ data: "Incorrect data", status: 401 }).status(200);
//
// throw new Error("Incorrect data");
//  return;
