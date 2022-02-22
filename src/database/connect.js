const { Client } = require("pg");

const connect_DB = async (query, values) => {
  let result;

  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });

  try {
    await client.connect();

    if (!values) {
      result = await client.query(query);
    } else {
      await client.query("BEGIN TRANSACTION");
      result = await client.query(query, values);
      await client.query("COMMIT");
    }

    await client.end();
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("[DATABASE]_error__________________connect_DB________________");
    console.log(error);
    await client.end();
    throw new Error(error);
  }
};

module.exports = {
  connect_DB,
};
