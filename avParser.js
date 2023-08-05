const axios = require('axios');
const sendMsg = require('./sendMsg');
const urls = require('./urls');

let previousAdId = null; // Переменная для хранения предыдущего id объявления


async function avParser() {
    try {
      const response = await axios.get(urls.avUrl);
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
  
        console.log("av.by: ID",adId, "Регистрация: ", regCountryValue || "Свойство с id равным 22 не найдено."); // Выводим id только при появлении нового объявления
        const adLink = response.data.adverts[0].publicUrl
  
        // Дополнительный запрос для получения средней цены
        const additionalDataUrl = `https://api.av.by/offer-types/cars/price-statistics/offers/${adId}`;
        try {
          const additionalResponse = await axios.get(additionalDataUrl);
          // Обработка дополнительных данных
          const mediumPrice = additionalResponse.data.mediumPrice.priceUsd;
          const mediumPriceMessage = mediumPrice !== 0 ? `Средняя цена: ${mediumPrice} USD` : "Средняя цена неизвестна";
          // Посылаем ссылку в телеграмм-бот
          if (currentPrice < mediumPrice || mediumPrice == 0) //sendMsg(`${adLink}\n${mediumPriceMessage}`);
          console.log(mediumPriceMessage)
        } catch (error) {
          console.error('Ошибка при выполнении дополнительного запроса на среднюю цену:', error);
          // sendMsg(adLink);
          console.log(adLink)
        }
      }
      previousAdId = adId; // Сохраняем текущий id в качестве предыдущего
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  }
module.exports = avParser;