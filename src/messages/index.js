// รวม (barrel) ฟังก์ชันสร้าง Flex Message ทั้งหมดไว้ที่จุดเดียว เพื่อให้ import ง่าย
const leaveFlex = require('./leaveFlex');
const registrationFlex = require('./registrationFlex');
const announcementFlex = require('./announcementFlex');

module.exports = {
  ...leaveFlex,
  ...registrationFlex,
  ...announcementFlex,
};
