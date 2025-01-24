import { Pool } from "pg";

const client = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    port: 5432,
  });

  export const BASE_URL="http://gestionofstock.onrender.com"
  export default client;
