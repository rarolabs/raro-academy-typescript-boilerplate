import { Connection, createConnection } from "typeorm";

const createDatabaseConnection = (): Promise<Connection> => {
  return createConnection();
};

export default createDatabaseConnection;
