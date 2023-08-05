const axios =require('axios');
const config = require('./config.json');

const urlTelegram = 'https://api.telegram.org/bot' + config.telegram.token + '/sendMessage';

async function sendMsg(data) {

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

module.exports = sendMsg;