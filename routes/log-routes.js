const express = require("express");

const router = express.Router();

router.get("/:siteid", (req, res, next) => {
  res.json({ message: "get site logs" });
});

module.exports = router;
