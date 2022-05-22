const express = require("express");

const { Site } = require("../models/site-model");
const CustomError = require("../templates/ErrorTemplate");
const getCoordinates = require("../Util/location");
const EM = require("../Util/texts");

const router = express.Router();

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
      new CustomError("Could not fetch data. Please try again later", 404)
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

  try {
    const res = await newSite.save();
  } catch (err) {
    let message = "";
    if (err.name === "ValidationError") {
      var keys = Object.keys(err.errors);

      if (err.errors[keys[0]]) {
        message = err.errors[keys[0]].message;
      } else {
        message = EM.ERR_UNKNOWN;
      }
      return next(new CustomError(message, 500));
    }
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

  try{
    var updatedPlace = await Site.findOneAndUpdate(filter, update, {new: true});
  }catch(err){
    return next(
      new CustomError("Failed to update the site.", 500)
    );
  }

  res.json({ site: updatedPlace });
});

router.delete("/:siteid", async (req, res, next) => {
  const siteid = req.params.siteid;
  
  try{
    await Site.findOneAndDelete({_id: siteid});
  }catch(e){
    return next(
      new CustomError("Failed to delete the site.", 500)
    );
  }

  res.json({ message: "Deleted a site" });
});

module.exports = router;
