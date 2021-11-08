import "reflect-metadata";
import * as dotenv from 'dotenv';
import createApp from './config/app';
import createDatabaseConnection from "./config/database/connect";
import createDependencyInjector from "./config/dependencies/createInjector";
dotenv.config();

export const start = async () => {
  try {
    await createDatabaseConnection();
    createDependencyInjector();
    createApp().listen(process.env.PORT);

    console.log(`Application running on port ${process.env.PORT}`);
  } catch (error) {
    console.error('Fatal error: ', error);
  }
};

start();
