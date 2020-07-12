// Connect to DB
const { Client } = require("pg");
const bcrypt = require("bcrypt");
// const DB_URL = process.env.DATABASE_URL || `postgres://${DB_NAME}`;
// const client = new Client(DB_URL);

const client = new Client("postgres://localhost:5432/pumpcodes");

async function createErrorCode({ errorcode, severity, meaning, solution }) {
  try {
    const { rows } = await client.query(
      `
        INSERT INTO errorcodes(errorcode, severity, meaning, solution)
        VALUES ($1, $2, $3, $4);
    `,
      [errorcode, severity, meaning, solution]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  if (!username || !password) {
    return;
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) return;
    const matchingPassword = bcrypt.compareSync(password, user.password);
    if (!matchingPassword) return;
    return user;
  } catch (error) {
    throw error;
  }
}

async function updateErrorCode(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows } = await client.query(
      `
      UPDATE errorcodes
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllCodes() {
  const { rows } = await client.query(
    `SELECT *
    FROM errorcodes;
  `
  );

  return rows;
}

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username, password, email
    FROM users;
  `
  );

  return rows;
}

async function createUser({ username, password, email }) {
  try {
    console.log("username", username);
    console.log("password", password);
    console.log("email", email);
    const result = await client.query(
      `
      INSERT INTO users(username, password, email)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [username, password, email]
    );
    console.log("result", result);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  updateErrorCode,
  createErrorCode,
  getAllCodes,
  getUser,
};
