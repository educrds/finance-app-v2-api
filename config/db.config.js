import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();
let dbConfig = {
  host: dotenv.config().parsed.HOST,
  database: dotenv.config().parsed.DATABASE,
  user: dotenv.config().parsed.USER,
  port: dotenv.config().parsed.PORT,
  password: dotenv.config().parsed.PASSWORD,
  connectionLimit: 3,
  bigIntAsNumber: true
}

console.log('NODE_ENV', dotenv.config().env.NODE_ENV);

if(dotenv.config().env.NODE_ENV === 'production') {
  dbConfig = {
    ...dbConfig,
    host: dotenv.config().parsed.RDS_HOSTNAME,
    database: dotenv.config().parsed.RDS_DATABASE,
    user: dotenv.config().parsed.RDS_USER,
    port: dotenv.config().parsed.RDS_PORT,
    password: dotenv.config().parsed.RDS_PASSWORD,
  }
}

const pool = mariadb.createPool(dbConfig);

export async function executeQuery(query, ...params) {
  let conn;

  try {
    conn = await pool.getConnection();
    return await conn.query(query, ...params);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

export async function executeBatch(query, ...params) {
  let conn;

  try {
    conn = await pool.getConnection();

    return await conn.batch(query, ...params);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

export async function executeTransaction(queries) {
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    for (const { query, params } of queries) {
      if (Array.isArray(params[0])) {
        await conn.batch(query, ...params);
      } else {
        await conn.query(query, ...params);
      }
    }

    await conn.commit();
  } catch (error) {
    if (conn) {
      await conn.rollback();
    }
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

