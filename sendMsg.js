const axios =require('axios')

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

module.exports = sendMsg;