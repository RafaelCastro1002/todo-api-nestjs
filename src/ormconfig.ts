import {ConnectionOptions} from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: true,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migration/*{.ts,.js}"],
  subscribers: ["dist/subscriber/*.ts"],
  cli: {
    entitiesDir: "dist/**/*.entity.ts",
    migrationsDir: "src/migration",
    subscribersDir: "dist/subscriber"
  },
  migrationsRun: false,
};

export = config;