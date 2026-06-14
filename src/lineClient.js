const line = require('@line/bot-sdk');
const config = require('./config');

// สร้าง Client สำหรับส่งข้อความกลับ (ใช้ร่วมกันทั้งแอป)
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken,
});

module.exports = client;
