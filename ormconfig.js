module.exports = {
  "type": "mysql",
  "host": process.env.DATABASE_HOST,
  "port": process.env.DATABASE_PORT,
  "username": process.env.DATABASE_USERNAME,
  "password": process.env.DATABASE_PASSWORD,
  "database": process.env.DATABASE_NAME,
  "synchronize": false,
  "entities": ["src/models/**/*Entity.ts"],
  "migrations": ["src/migration/*.ts"],
  "cli": {
    "entitiesDir": "src/models",
    "migrationsDir": "src/migration"
  }
}