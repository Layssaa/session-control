const { redisClient } = require("../database/_redis");

async function setDataRedis(_key, _send, ..._options) {
  return await redisClient.set(_key, JSON.stringify(_send), ..._options);
}

module.exports = { setDataRedis };
