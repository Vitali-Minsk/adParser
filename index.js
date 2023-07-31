const express = require("express");
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 80; 
const config = require('./config.json');
const avParser = require('./avParser')

const url = 'https://api.av.by/offer-types/cars/filters/main/init?place_city[0]=2&place_region[0]=1005&price_currency=2&price_usd[max]=10000&seller_type[0]=1&sort=4';

app.listen(PORT, () => {
  console.log(`Server has been started on PORT: ${PORT}`);
});



let intervalCounter = 0;
let intervalCounterMax = 1000;
let [min, max] = [5000, 12000];

const intervalObj = setInterval(async () => {
  console.log(intervalCounter);
  if (intervalCounter > intervalCounterMax) clearInterval(intervalObj);
  await avParser(url);
  intervalCounter++;
}, Math.floor(Math.random() * (max - min + 1)) + min);