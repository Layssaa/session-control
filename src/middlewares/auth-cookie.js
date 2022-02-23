const { getDataRedis } = require("../repositories/get-redis");

async function authCookie(req, res, next) {
  const { token: _token } = req.cookies;
  const userLogged = await getDataRedis(`user-${_token}`);
  
  if (!userLogged) return next();

  if (userLogged.attempts > 5) {
    res.status(200).send({
      status: 400,
      msg: `You have exceeded the maximum request, wait ${
        userLogged.attempts * 2
      } minutes`,
    });
  }

  next();
}

module.exports = { authCookie };

//https://stackoverflow.com/questions/19690950/preventing-brute-force-using-node-and-express-js
