import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "development" ? false : true,
  });
  
  try {
    await client.connect();
    const res = await client.query(queryObject);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getVersion() {
  const response = await query("SHOW server_version;");
  return response.rows[0].server_version;
}

async function getMaxConnections() {
  const response = await query("SHOW max_connections;");
  return Number(response.rows[0].max_connections);
}

async function getCurrentConnections() {
  const databaseName = process.env.POSTGRES_DB;
  const response = await query({
    text: `SELECT COUNT(*)::int AS current_connections FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });
  return response.rows[0].current_connections;
}

export default {
  query,
  getVersion,
  getMaxConnections,
  getCurrentConnections,
};
