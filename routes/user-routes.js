const express = require("express");
const { v4: uuid } = require("uuid");

const CustomError = require("../templates/ErrorTemplate");

const router = express.Router();

let users = [
  {
    id: 1,
    firstName: "Arafat",
    lastName: "Hossain",
    email: "abc@abc.com",
    password: "1234",
  },
  {
    id: 2,
    firstName: "Nasima",
    lastName: "Akter",
    email: "abcd@abc.com",
    password: "1234",
  },
];

router.get("/", (req, res, next) => {
  res.json({ message: "get all users" });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  const loggedinUser = users.find(
    (user) => user.email == email
  );
  if(!loggedinUser || loggedinUser.password != password){
    return next(new CustomError("User not found, try again with different credentials", 404));
  }
  res.json({ user: loggedinUser });
});

router.post("/signup", (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const newUser = {
    id: uuid(),
    firstName,
    lastName,
    email,
    password,
  };

  users.push(newUser);

  res.status(201).json({ user: newUser });
});

module.exports = router;
