const axios = require('axios');
const sendMsg = require('./sendMsg')

let previousAdId = null; // Переменная для хранения предыдущего id объявления

async function kufarParser(url) {
  try {
    const response = await axios.get(url);
    const adId = response.data.ads[0].ad_id;
    if (adId !== previousAdId) { // Сравниваем текущий и предыдущий id объявления

      const currentPrice = Math.floor(response.data.ads[0].price_usd / 100);

      const adParameters = response.data.ads[0].ad_parameters;
      const paramNames = [
        "Марка",
        "Модель",
        "Поколение",
        "Год",
        "Тип двигателя",
        "Объем, л",
        "Коробка передач",
        "Тип кузова",
        "Цвет",
        "Город / Район"
      ];
      const carParam = {};
      paramNames.forEach((paramName) => {
        const parameter = adParameters.find((param) => param.pl === paramName);
        if (parameter) {
          carParam[paramName] = parameter.vl;
        }
      });

      const adLink = response.data.ads[0].ad_link;
      const carParamMessage = Object.values(carParam).join(", ");
      // const imageCarUrl ='https://rms7.kufar.by/v1/list_thumbs_2x/' + response.data.ads[0].images[0].path
      const message = `${currentPrice}$ \n ${carParamMessage}, \n ${adLink}`

      console.log('kufar.by: ID', adId)
      sendMsg(message)
    }
    previousAdId = adId; // Сохраняем текущий id в качестве предыдущего
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
  }
}
module.exports = kufarParser;