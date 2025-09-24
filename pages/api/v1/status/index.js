import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: await database.getVersion(),
        max_connections: await database.getMaxConnections(),
        current_connections: await database.getCurrentConnections(),
      },
    },
  });
}

export default status;
