const express = require("express");
const {authenticateUser} = require("../middleware/auth-middleware");
const { default: mongoose } = require("mongoose");
const { Log } = require("../models/log-model");

const router = express.Router();

router.use(authenticateUser);

router.get("/:siteid", async (req, res, next) => {
  const siteid = req.params.siteid;

  try {
    var logs = await Log.find({siteId: siteid});
  } catch (e) {
    return next(new CustomError("Something went wrong", 500));
  }

  res.json({ logs: logs || [] });
});

module.exports = router;
