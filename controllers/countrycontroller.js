const { default: axios } = require("axios");
const asyncHandler = require("express-async-handler");
const REST_COUNTRIES_API = "https://restcountries.com/v3.1";
const cache = require('../utils/cache');

// to get every country list


const getAllCountries =  asyncHandler(async (req, res) => {
  const cachedData = cache.get('allCountries');
  if (cachedData) return res.json(cachedData);

  try {
    const response = await axios.get(`${REST_COUNTRIES_API}/all`);
    const data = response.data.map((country) => ({
      name: country.name.common,
      population: country.population,
      flag: country.flags.svg,
      region: country.region,
      code:country.cca2,

      currency: country.currencies
        ? Object.keys(country.currencies).join(", ")
        : "N/A",
    }));
    console.log(data.length);
    cache.set('allCountries', data, 3600); // Cache for 1 hour

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch countries data ${}" });
  }
});


// to get  country Details using country code


const getCountriesCode = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const cacheKey = `country_${code}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);

  try {
    const response = await axios.get(`${REST_COUNTRIES_API}/alpha/${code}`);
    cache.set(cacheKey, response.data, 3600);

    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: `Country with code ${code} not found` });
  }
});



// to get country List using country region

const getCountriesbyregion = asyncHandler(async (req, res) => {
  const { region } = req.params;
  const cacheKey = `countries_region_${region}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);

  try {
    const response = await axios.get(`${REST_COUNTRIES_API}/region/${region}`);
    cache.set(cacheKey, response.data, 3600);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch countries by region" });
  }
});


// search country  using Name, capital region and timezone


const searchCountries = asyncHandler(async (req, res) => {

  const { name, capital, region, timezone } = req.query;

  try {
    const response = await axios.get(`${REST_COUNTRIES_API}/all`);
    let data = response.data;

    if (name) {
      data = data.filter((country) =>
        country.name.common.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (capital) {
      data = data.filter(
        (country) =>
          country.capital &&
          country.capital[0].toLowerCase().includes(capital.toLowerCase())
      );
    }
    if (region) {
      data = data.filter(
        (country) => country.region.toLowerCase() === region.toLowerCase()
      );
    }
    if (timezone) {
      data = data.filter(
        (country) => country.timezones && country.timezones.includes(timezone)
      );
    }

    if (!data.length) {
      return res
        .status(404)
        .json({ error: "No countries found matching the criteria" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to search countries" });
  }
});



module.exports = {
  getAllCountries,
  getCountriesCode,
  getCountriesbyregion,
  searchCountries,
};
