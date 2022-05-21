const CustomError = require("../templates/ErrorTemplate");

let siteList = [
  {
    id: 1,
    name: "Hospital site",
    region: "Dhaka, Bangladesh",
    description: "A place to build a hospital",
    longitude: 100.0,
    latitude: 100.0,
    userid: 1,
  },
  {
    id: 2,
    name: "Power plant site",
    region: "Barisal, Bangladesh",
    description: "A place to build a power plant",
    longitude: 200.0,
    latitude: 100.0,
    userid: 2,
  },
];

const getSitebyUserid = (req, res, next) => {
  const userid = req.params.userid;
  const selectedSite = siteList.find((site) => site.userid == userid);
  if (!selectedSite) {
    return next(
      new CustomError("Could not find any place for the given user", 404)
    );
  }
  res.json({ sites: selectedSite });
};

exports.getSitebyUserid;