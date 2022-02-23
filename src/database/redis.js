const Redis = require("ioredis");

const redisClient = new Redis();

redisClient.on("error", (err) => {
  console.log(err);
});

async function getDataRedis(_search) {
  return JSON.parse(await redisClient.get(_search));
}

async function setDataRedis(_key, _send, ..._options) {
  return await redisClient.set(_key, JSON.stringify(_send), ..._options);
}

module.exports = { redisClient, getDataRedis, setDataRedis };

// melhorar conexão com redis
