import mariadb from 'mariadb';
import dotenv from 'dotenv';

const isProduction = process.env.NODE_ENV === 'production';

if(!isProduction){
  dotenv.config();
}

let dbConfig = {
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DATABASE,
  user: process.env.RDS_USER,
  port: process.env.RDS_DB_PORT,
  password: process.env.RDS_PASSWORD,
  connectionLimit: 10,
  acquireTimeout: 20000,
  bigIntAsNumber: true,
  // debug: true
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

