const apiRouter = require("express");
const usersRouter = apiRouter.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createUser, getUserByUsername, getUser } = require("../db");
const saltRounds = 10;

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.send({ users });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingUserNameOrPassword",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ username, password });
    if (!user) {
      next({
        name: "WrongUserNameOrPassword",
        message: "Username or password is incorrect",
      });
    } else {
      const token = await jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1w" }
      );
      res.send({ message: "you're logged in!", token });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    console.log("req", req.body);
    const queriedUser = await getUserByUsername(username);
    if (queriedUser) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
        email: "Please enter valid email",
      });
    } else if (password.length < 8) {
      next({
        name: "PasswordLengthError",
        message: "Password Too Short!",
        email: "Please enter valid email",
      });
    } else {
      bcrypt.hash(password, saltRounds, async function (err, hashedPassword) {
        const user = await createUser({
          username,
          password: hashedPassword,
          email,
        });
        if (err) {
          next(err);
        } else {
          res.send({ user });
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
