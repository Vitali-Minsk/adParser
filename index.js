const express = require("express");
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 80; 
const config = require('./config.json');

const url = 'https://api.av.by/offer-types/cars/filters/main/init?place_city[0]=2&place_region[0]=1005&price_currency=2&price_usd[max]=10000&seller_type[0]=1&sort=4';
let previousAdId = null; // Переменная для хранения предыдущего id объявления

app.listen(PORT, () => {
  console.log(`Server has been started on PORT: ${PORT}`);
});

async function avParser() {
  try {
    const response = await axios.get(url);
    const adId = response.data.adverts[0].id;
    const regCountryValue = response.data.adverts[0].properties.find(obj => obj.id === 22)?.value;
    const isAdNew = response.data.adverts[0].originalDaysOnSale === 1;
    const isTop = response.data.adverts[0].top;
    const currentPrice = response.data.adverts[0].price.usd.amount;
    if (adId !== previousAdId && 
      regCountryValue !== "регистрация РФ" &&
      isAdNew &&
      !isTop
      ) { // Сравниваем текущий и предыдущий id объявления

      console.log("ID:",adId, "Регистрация: ", regCountryValue || "Свойство с id равным 22 не найдено."); // Выводим id только при появлении нового объявления
      const adLink = response.data.adverts[0].publicUrl

      // Дополнительный запрос для получения средней цены
      const additionalDataUrl = `https://api.av.by/offer-types/cars/price-statistics/offers/${adId}`;
      try {
        const additionalResponse = await axios.get(additionalDataUrl);
        // Обработка дополнительных данных
        const mediumPrice = additionalResponse.data.mediumPrice.priceUsd;
        const mediumPriceMessage = mediumPrice !== 0 ? `Средняя цена: ${mediumPrice} USD` : "Средняя цена неизвестна";
        // Посылаем ссылку в телеграмм-бот
        if (currentPrice < mediumPrice || mediumPrice == 0) sendMsg(`${adLink}\n${mediumPriceMessage}`);
        console.log(mediumPriceMessage)
      } catch (error) {
        console.error('Ошибка при выполнении дополнительного запроса на среднюю цену:', error);
        sendMsg(adLink);
      }
    }
    previousAdId = adId; // Сохраняем текущий id в качестве предыдущего
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
  }
}

async function sendMsg(data) {
  const urlTelegram = 'https://api.telegram.org/bot' + config.telegram.token + '/sendMessage';

  try {
    const response = await axios.post(urlTelegram, {
      chat_id: config.telegram.chat,
      text: data
    });
    console.log("Ссылка отправлена успешно");
  } catch (error) {
    console.error('Ошибка при отправке сообщения в Telegram:', error.message);
  }
}

let intervalCounter = 0;
let intervalCounterMax = 1000;
let [min, max] = [5000, 12000];

const intervalObj = setInterval(async () => {
  console.log(intervalCounter);
  if (intervalCounter > intervalCounterMax) clearInterval(intervalObj);
  await avParser(url);
  intervalCounter++;
}, Math.floor(Math.random() * (max - min + 1)) + min);