const apiRouter = require("express").Router();

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

const codeRouter = require("./code");
apiRouter.use("/code", codeRouter);

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
