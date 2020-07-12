const bcrypt = require("bcrypt");
const SALT_COUNT = 10;
const saltRounds = 10;
const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  updateErrorCode,
  createErrorCode,
  getAllCodes,
} = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS users;

    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar UNIQUE NOT NULL,
        password varchar NOT NULL,
        email varchar NOT NULL
      );
    `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

// CREATE TABLE users (
//       username varchar(255) UNIQUE NOT NULL,
//       password varchar(255) NOT NULL,
//       admin varchar(255) DEFAULT 'false',
//       seller varchar(255) DEFAULT 'false'
//     );

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await testUsers();
    // await createInitialUsers();
  } catch (error) {
    throw error;
  }
}

async function testUsers() {
  try {
    console.log("testing");
    bcrypt.hash("bertie99", saltRounds, async function (err, hash) {
      const starter = await createUser({
        username: "jgaleiphone",
        password: hash,
        email: "jgale@guardianfueltech.com",
      });
    });
  } catch (error) {
    console.log(error);
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    // bcrypt.hash("bertie99", SALT_COUNT, async function (err, hashedPassword) {
    //   const arman = await createUser({
    //     username: "arman",
    //     password: hashedPassword,
    //     email: "test123",
    //   });
    //   console.log(arman);
    // });
    // bcrypt.hash("bertie99", SALT_COUNT, async function (err, hashedPassword) {
    //   const james = await createUser({
    //     username: "james",
    //     password: hashedPassword,
    //     email: "test123",
    //   });
    //   console.log(james);
    // });
    // bcrypt.hash("bertie99", SALT_COUNT, async function (err, hashedPassword) {
    //   const robin = await createUser({
    //     username: "robin",
    //     password: hashedPassword,
    //     email: "test123",
    //   });
    //   console.log(robin);
    // });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    // console.log("Calling updateUser on users[0]");
    // const updateUserResult = await updateUser(users[0].id, {
    //   password: 123456,
    // });
    // console.log("Result:", updateUserResult);

    // console.log("Calling getAllCodes");
    // const codes = await getAllCodes();
    // console.log("Result:", codes);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
