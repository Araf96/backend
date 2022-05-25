const express = require("express");

const { Site } = require("../models/site-model");
const CustomError = require("../templates/ErrorTemplate");
const getCoordinates = require("../Util/location");
const EM = require("../Util/texts");
const {authenticateUser} = require("../middleware/auth-middleware");
const { default: mongoose } = require("mongoose");
const { Log } =  require("../models/log-model");
const { User } = require("../models/user-model");

const router = express.Router();

router.use(authenticateUser);

router.get("/:userid", async (req, res, next) => {
  const userid = req.params.userid;
  let sites = [];

  try {
    sites = await Site.find({ createdBy: userid });
    if (sites.length === 0) {
      return next(
        new CustomError("Could not find any place for the given user", 404)
      );
    }
  } catch (e) {
    return next(new CustomError("Something went wrong", 500));
  }

  res.json({ sites });
});

router.get("/site/:siteid", async (req, res, next) => {
  const siteid = req.params.siteid;
  let site;

  try {
    site = await Site.findById(siteid);
    if (!site) {
      return next(
        new CustomError("Could not find any place", 404)
      );
    }
  } catch (e) {
    return next(new CustomError("Something went wrong", 500));
  }

  res.json({ site });
});

router.get("/", async (req, res, next) => {
  let sites = [];
  try {
    sites = await Site.find();
    if (sites.length === 0) {
      return next(
        new CustomError(
          "Could not find any site to show. Please try again later",
          404
        )
      );
    }
  } catch (e) {
    return next(
      new CustomError("Could not fetch data. Please try again later", 500)
    );
  }

  res.json({ sites });
});

router.post("/", async (req, res, next) => {
  const { name, region, description, createdBy } = req.body;

  try {
    var response = await getCoordinates(region);
    if (response.status === "FAILED") {
      return next(
        new CustomError("Area could not be found. Try a new area", 422)
      );
    }
  } catch (e) {
    return next(
      new CustomError("Something went wrong.", 500)
    );
  }

  const newSite = new Site({
    name,
    region,
    description,
    coordinates: response.coordinates,
    createdBy,
  });

  let logTime = new Date();
  let logType = "create";
  let logDescription = "Created by "+ req.body.user.firstName + " " + req.body.user.lastName; 
  let loggedBy = req.body.user._id;

  const newLog = new Log({
    logTime,
    logType,
    logDescription,
    loggedBy
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const user = await User.findById(createdBy);
    if(!user){
      throw new Error();
    }
    await newSite.save({session: sess});
    newLog.siteId = newSite._id;
    await newLog.save({session: sess});
    user.sites.push(newSite);
    await user.save({session: sess});
    await sess.commitTransaction();

  } catch (err) {
    console.log(err)
    let message = EM.ERR_UNKNOWN;
    if (err.name === "ValidationError") {
      var keys = Object.keys(err.errors);

      if (err.errors[keys[0]]) {
        message = err.errors[keys[0]].message;
      }
    }
    return next(new CustomError(message, 500));
  }
  res.status(201).json({ site: newSite });
});

router.patch("/:siteid", async(req, res, next) => {
  const siteid = req.params.siteid;
  const { name, region, description } = req.body;

  try {
    var response = await getCoordinates(region);

    if (response.status === "FAILED") {
      return next(
        new CustomError("Area could not be found. Try a new area", 422)
      );
    }
  } catch (e) {
    return next(
      new CustomError("Something went wrong.", 500)
    );
  }

  const filter = { _id: siteid };
  const update = { name, region, description, coordinates: response.coordinates };

  let logTime = new Date();
  let logType = "update";
  let logDescription = "Updated by "+ req.body.user.firstName + " " + req.body.user.lastName; 
  let loggedBy = req.body.user._id;

  const newLog = new Log({
    logTime,
    logType,
    logDescription,
    loggedBy
  });

  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    var updatedPlace = await Site.findOneAndUpdate(filter, update, {new: true, session: sess});
    newLog.siteId = updatedPlace._id;
    await newLog.save({session: sess});
    sess.commitTransaction();

  }catch(err){
    return next(
      new CustomError("Failed to update the site.", 500)
    );
  }

  res.json({ site: updatedPlace });
});

router.delete("/:siteid", async (req, res, next) => {
  const siteid = req.params.siteid;

  let logTime = new Date();
  let logType = "delete";
  let logDescription = "Deleted by "+ req.body.user.firstName + " " + req.body.user.lastName; 
  let loggedBy = req.body.user._id;

  const newLog = new Log({
    logTime,
    logType,
    logDescription,
    loggedBy
  });
  
  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Site.findOneAndDelete({_id: siteid},{session: sess});
    newLog.siteId = siteid;
    await newLog.save({session: sess});
    sess.commitTransaction();
  }catch(e){
    return next(
      new CustomError("Failed to delete the site.", 500)
    );
  }

  res.json({ message: "Deleted a site" });
});

module.exports = router;
