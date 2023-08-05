const express = require("express");
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 80; 
const avParser = require('./avParser')
const kufarParser = require('./kufarParser')

app.listen(PORT, () => {
  console.log(`Server has been started on PORT: ${PORT}`);
});

let intervalCounterAv = 0;
let intervalCounterKufar = 0;
let intervalCounterMax = 1000;
let [min, max] = [5000, 12000];

const intervalObjAv = setInterval(async () => {
  try {
    console.log('Av: ', intervalCounterAv);
    if (intervalCounterAv > intervalCounterMax) clearInterval(intervalObjAv);
    await avParser();
    intervalCounterAv++;
  } catch (error) {
    console.error('Ошибка во время парсинга:', error);
  }
}, Math.floor(Math.random() * (max - min + 1)) + min);

const intervalObjKufar = setInterval(async () => {
  try {
    console.log('Kufar: ', intervalCounterKufar);
    if (intervalCounterKufar > intervalCounterMax) clearInterval(intervalObjKufar);
    await kufarParser();
    intervalCounterKufar++;
  } catch (error) {
    console.error('Ошибка во время парсинга:', error);
  }
}, Math.floor(Math.random() * (max - min + 1)) + min);