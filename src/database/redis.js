const Redis = require("ioredis");

const redisClient = new Redis();

redisClient.on("error", (err) => {
  console.log(err);
});

async function getDataRedis(_search) {
  return JSON.parse(await redisClient.get(_search));
}

async function setDataRedis(_key, _send, timestamp) {
  const time = timestamp ** 2 * 1000;
  console.log(_send);
  return await redisClient.set(_key, JSON.stringify(_send), "EX", timestamp ** 2 * 1000);
}

module.exports = { getDataRedis, setDataRedis };

// melhorar conexão com redis
