const apiRouter = require("express");

const codeRouter = apiRouter.Router();

const { getAllCodes } = require("../db");

codeRouter.get("/", async (req, res, next) => {
  try {
    const allCodes = await getAllCodes();
    res.send({
      allCodes,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = codeRouter;
