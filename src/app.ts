import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import { runner } from './examples';
dotenv.config();

export const start = async () => {
  try {
    const connection = await createConnection();
    await runner(connection);

    process.exit(0);
  } catch (error: unknown) {
    console.log(error);
    process.exit(1);
  }
};

start();