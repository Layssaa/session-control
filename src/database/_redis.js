const Redis = require("ioredis");

const redisClient = new Redis();

redisClient.on("error", (err) => {
    console.log(err);
});

module.exports = { redisClient };
