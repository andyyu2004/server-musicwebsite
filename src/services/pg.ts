import * as pg from 'pg';

// const client = new pg.Client();
// client.connect();

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "music",
  password: "password",
  port: 5432
});
