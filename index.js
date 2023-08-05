const express = require("express");
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 80; 
const avParser = require('./avParser')
const kufarParser = require('./kufarParser')

const urlAv = 'https://api.av.by/offer-types/cars/filters/main/init?place_city[0]=2&place_region[0]=1005&price_currency=2&price_usd[max]=10000&seller_type[0]=1&sort=4';
const urlKufar = 'https://api.kufar.by/search-api/v1/search/rendered-paginated?cat=2010&cmp=0&cur=USD&lang=ru&prc=r%3A0%2C10000&rgn=7&size=30&sort=lst.d&typ=sell'

app.listen(PORT, () => {
  console.log(`Server has been started on PORT: ${PORT}`);
});



let intervalCounter = 0;
let intervalCounterMax = 1000;
let [min, max] = [5000, 12000];

const intervalObj = setInterval(async () => {
  try {
    console.log(intervalCounter);
    if (intervalCounter > intervalCounterMax) clearInterval(intervalObj);
    await avParser(urlAv);
    await kufarParser(urlKufar);
    intervalCounter++;
  } catch (error) {
    console.error('Ошибка во время парсинга:', error);
    // отправить сообщение об ошибке в Telegram
    // sendMsg('Произошла ошибка во время парсинга');
  }
}, Math.floor(Math.random() * (max - min + 1)) + min);
