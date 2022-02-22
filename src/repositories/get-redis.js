const { redisClient } = require("../database/_redis");

async function getDataRedis(_search) {
  return await redisClient.get(_search);
}

module.exports = { getDataRedis };
