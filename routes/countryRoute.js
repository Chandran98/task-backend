const express = require("express");

const {
  getAllCountries,
  searchCountries,
  getCountriesbyregion,
  getCountriesCode,
} = require("../controllers/countrycontroller");
const router = express.Router();
router.route("/countries").get( getAllCountries);

router.route("/countriescode/:code").get( getCountriesCode);

router.route("/countries/region/:region").get( getCountriesbyregion);
router.route("/countries/search").get( searchCountries);


module.exports = router;
