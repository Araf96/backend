const express = require("express");
const { v4: uuid } = require("uuid");

const CustomError = require("../templates/ErrorTemplate");

const router = express.Router();

let siteList = [
  {
    id: 1,
    name: "Hospital site",
    region: "Dhaka, Bangladesh",
    description: "A place to build a hospital",
    coordinates: { longitude: 100.0, latitude: 100.0 },
    createdBy: 1,
  },
  {
    id: 2,
    name: "Power plant site",
    region: "Barisal, Bangladesh",
    description: "A place to build a power plant",
    coordinates: { longitude: 200.0, latitude: 100.0 },
    createdBy: 2,
  },
];

router.get("/getsite/:userid", (req, res, next) => {
  const userid = req.params.userid;
  const selectedSite = siteList.filter((site) => site.createdBy == userid);
  if (!selectedSite) {
    return next(
      new CustomError("Could not find any place for the given user", 404)
    );
  }
  res.json({ sites: selectedSite });
});

router.get("/", (req, res, next) => {
  res.json({ sites: siteList });
});

router.post("/", (req, res, next) => {
  const { name, region, description, coordinates, createdBy } = req.body;

  const newSite = {
    id: uuid(),
    name,
    region,
    description,
    coordinates,
    createdBy,
  };

  siteList.push(newSite);

  res.status(201).json({ site: newSite });
});

router.patch("/:siteid", (req, res, next) => {
  const siteid = req.params.siteid;
  const { name, region, description, coordinates, createdBy } = req.body;
  const site = siteList.find((site) => site.id == siteid);

  if (!site) {
    return next(new CustomError("Could not find the requested site", 404));
  }

  const updatedSite = { ...site };

  const siteIndex = siteList.findIndex((site) => site.id == siteid);
  updatedSite.name = name;
  updatedSite.region = region;
  updatedSite.description = description;
  updatedSite.coordinates = coordinates;
  updatedSite.createdBy = createdBy;

  siteList[siteIndex] = updatedSite;

  res.json({ site: updatedSite });
});

router.delete("/:siteid", (req, res, next) => {
  const siteid = req.params.siteid;
  siteList = siteList.filter((site) => site.id != siteid);

  res.json({ message: "delete a site" });
});

module.exports = router;
