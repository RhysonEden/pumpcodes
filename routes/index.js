const apiRouter = require("express").Router();
require("dotenv").config();

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

const codeRouter = require("./code");
apiRouter.use("/code", codeRouter);

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

apiRouter.use((err, req, res, next) => {
  res.send(err);
});

module.exports = apiRouter;
