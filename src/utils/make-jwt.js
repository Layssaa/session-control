const jwt = require("jsonwebtoken");

const CreateToken = async (_token) => {
  const token = await jwt.sign({ _token }, process.env.SECRET, {
    expiresIn: "600s",
  });

  return { token };
};

module.exports = { CreateToken };
